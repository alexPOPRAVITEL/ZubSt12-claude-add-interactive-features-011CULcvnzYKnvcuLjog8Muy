import { supabase } from './supabase';

export interface DeviceFingerprint {
  canvas: string;
  screen: string;
  timezone: string;
  language: string;
  platform: string;
  userAgent: string;
  plugins: string;
  webgl: WebGLFingerprint | null;
}

export interface WebGLFingerprint {
  vendor: string;
  renderer: string;
}

export interface UserSession {
  userId: string | null;
  sessionId: string;
  fingerprint: string;
  startTime: number;
}

export class UserTracker {
  private userId: string | null = null;
  private fingerprint: string = '';
  private sessionId: string = '';
  private sessionStart: number = 0;
  private events: AnalyticsEvent[] = [];
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private isActive: boolean = true;
  private lastActivity: number = Date.now();

  constructor() {
    this.sessionStart = Date.now();
    this.sessionId = this.generateSessionId();
  }

  async initialize(): Promise<void> {
    this.fingerprint = await this.generateFingerprint();
    await this.identifyUser();
    this.setupEventListeners();
    this.startAutoFlush();
    this.trackPageView();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async generateFingerprint(): Promise<string> {
    const fingerprintData: DeviceFingerprint = {
      canvas: await this.getCanvasFingerprint(),
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      plugins: this.getPluginsFingerprint(),
      webgl: this.getWebGLFingerprint(),
    };

    return this.hashFingerprint(JSON.stringify(fingerprintData));
  }

  private async getCanvasFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Browser fingerprint 🔒', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Browser fingerprint 🔒', 4, 17);

    return canvas.toDataURL();
  }

  private getPluginsFingerprint(): string {
    const plugins = Array.from(navigator.plugins || [])
      .map((p) => p.name)
      .join(',');
    return plugins;
  }

  private getWebGLFingerprint(): WebGLFingerprint | null {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return null;

    return {
      vendor: (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
      renderer: (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
    };
  }

  private hashFingerprint(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  private async identifyUser(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      this.userId = user.id;

      const { data: profile } = await supabase
        .from('learning_user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.from('learning_user_profiles').insert({
          id: user.id,
          fingerprint_hash: this.fingerprint,
          display_name: user.email?.split('@')[0] || 'User',
        });
      } else {
        await supabase
          .from('learning_user_profiles')
          .update({
            last_active: new Date().toISOString(),
            fingerprint_hash: this.fingerprint
          })
          .eq('id', user.id);
      }
    }
  }

  private setupEventListeners(): void {
    document.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    window.addEventListener('beforeunload', () => this.flush());

    let scrollTimeout: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.handleScroll(), 150);
    });
  }

  private handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    this.trackEvent('click', {
      element: target.tagName,
      id: target.id,
      className: target.className,
      text: target.innerText?.substring(0, 50),
      x: e.clientX,
      y: e.clientY,
    });
    this.updateActivity();
  }

  private handleVisibilityChange(): void {
    this.isActive = !document.hidden;
    this.trackEvent('visibility_change', {
      hidden: document.hidden,
    });
  }

  private handleScroll(): void {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    this.trackEvent('scroll', {
      percent: Math.round(scrollPercent),
      position: window.scrollY,
    });
    this.updateActivity();
  }

  private updateActivity(): void {
    this.lastActivity = Date.now();
  }

  private trackPageView(): void {
    this.trackEvent('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
    });
  }

  public trackEvent(eventType: string, eventData: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      user_id: this.userId,
      session_id: this.sessionId,
      event_type: eventType,
      event_data: eventData,
      fingerprint: this.fingerprint,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    this.eventQueue.push(event);

    if (this.eventQueue.length >= 10) {
      this.flush();
    }
  }

  private startAutoFlush(): void {
    this.flushInterval = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, 30000);
  }

  public async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const { error } = await supabase
        .from('learning_analytics_events')
        .insert(eventsToSend);

      if (error) {
        console.error('Failed to send analytics:', error);
        this.eventQueue.push(...eventsToSend);
      }
    } catch (err) {
      console.error('Analytics flush error:', err);
      this.eventQueue.push(...eventsToSend);
    }
  }

  public getSessionInfo(): UserSession {
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      fingerprint: this.fingerprint,
      startTime: this.sessionStart,
    };
  }

  public getTimeOnPage(): number {
    return Math.floor((Date.now() - this.sessionStart) / 1000);
  }

  public isUserActive(): boolean {
    return Date.now() - this.lastActivity < 60000;
  }

  public destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}

export interface AnalyticsEvent {
  user_id: string | null;
  session_id: string;
  event_type: string;
  event_data: Record<string, any>;
  fingerprint: string;
  user_agent: string;
  timestamp: string;
}

export const userTracker = new UserTracker();
