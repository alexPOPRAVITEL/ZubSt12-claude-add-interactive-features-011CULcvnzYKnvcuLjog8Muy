import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface TelegramUserData {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
  gender?: string;
  birth_date?: string;
  age?: number;
}

export const logVisit = async (qrParams?: Record<string, string>) => {
  if (import.meta.env.DEV) {
    console.log('Analytics skipped in development mode');
    return;
  }

  try {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }

    const platform = navigator.platform;
    const userAgent = navigator.userAgent;
    const browser = detectBrowser(userAgent);
    const isTelegram = window.Telegram?.WebApp !== undefined;
    const source = isTelegram ? 'telegram' : 'web';

    let telegramData: TelegramUserData | null = null;

    if (isTelegram && window.Telegram?.WebApp?.initDataUnsafe) {
      const { user, auth_date, hash } = window.Telegram.WebApp.initDataUnsafe;
      
      if (user) {
        // Extract additional user data if available
        const additionalData = window.Telegram.WebApp.initDataUnsafe.user as any;
        
        telegramData = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          language_code: user.language_code,
          photo_url: user.photo_url,
          auth_date,
          hash,
          // Additional fields from Telegram if available
          gender: additionalData?.gender,
          birth_date: additionalData?.birth_date,
          age: additionalData?.age
        };
      }
    }

    const visitorData = {
      source,
      platform,
      browser,
      user_agent: userAgent,
      referrer: document.referrer,
      qr_params: qrParams,
      telegram_data: telegramData,
      // Add fields directly to visitor record if available in Telegram data
      gender: telegramData?.gender,
      birth_date: telegramData?.birth_date,
      age: telegramData?.age,
      visited_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('visitors')
      .insert([visitorData]);

    if (error) {
      console.error('Failed to log visit to Supabase:', error);
    }

    // Also send to Google Analytics
    gtag('event', 'visit', {
      ...visitorData,
      telegram_user_id: telegramData?.id,
      telegram_username: telegramData?.username,
      user_gender: telegramData?.gender,
      user_age: telegramData?.age
    });

  } catch (error) {
    console.error('Failed to log visit:', error);
  }
};

// Track form submissions
export const trackFormSubmission = (formType: string, formData: Record<string, any>) => {
  if (import.meta.env.DEV) {
    console.log('Form tracking skipped in development mode', { formType, formData });
    return;
  }

  try {
    if (window.gtag) {
      window.gtag('event', 'form_submission', {
        form_type: formType,
        form_id: formType.toLowerCase().replace(/\s+/g, '_'),
        ...formData
      });
    }
  } catch (error) {
    console.error('Failed to track form submission:', error);
  }
};

// Track phone calls
export const trackPhoneCall = (phoneNumber: string) => {
  if (import.meta.env.DEV) {
    console.log('Phone call tracking skipped in development mode', { phoneNumber });
    return;
  }

  try {
    if (window.gtag) {
      window.gtag('event', 'phone_call', {
        phone_number: phoneNumber
      });
    }
  } catch (error) {
    console.error('Failed to track phone call:', error);
  }
};

// Track service views
export const trackServiceView = (serviceName: string, serviceCategory: string) => {
  if (import.meta.env.DEV) {
    console.log('Service view tracking skipped in development mode', { serviceName, serviceCategory });
    return;
  }

  try {
    if (window.gtag) {
      window.gtag('event', 'service_view', {
        service_name: serviceName,
        service_category: serviceCategory
      });
    }
  } catch (error) {
    console.error('Failed to track service view:', error);
  }
};

// Track doctor profile views
export const trackDoctorView = (doctorName: string, specialization: string) => {
  if (import.meta.env.DEV) {
    console.log('Doctor view tracking skipped in development mode', { doctorName, specialization });
    return;
  }

  try {
    if (window.gtag) {
      window.gtag('event', 'doctor_view', {
        doctor_name: doctorName,
        specialization: specialization
      });
    }
  } catch (error) {
    console.error('Failed to track doctor view:', error);
  }
};

function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

declare global {
  function gtag(...args: any[]): void;
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id?: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
            gender?: string;
            birth_date?: string;
            age?: number;
          };
          auth_date?: number;
          hash?: string;
        };
      };
    };
  }
}