import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  permissions: Record<string, boolean>;
  is_active: boolean;
  last_login: string | null;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const savedAuth = localStorage.getItem('admin-auth');
      if (savedAuth !== 'true') {
        setLoading(false);
        return;
      }

      const savedEmail = localStorage.getItem('admin-email');
      if (!savedEmail) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', savedEmail)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAdminUser(data);
        await updateLastLogin(data.id);
      }
    } catch (err) {
      console.error('Error checking admin auth:', err);
      setError(err instanceof Error ? err.message : 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const login = async (password: string): Promise<boolean> => {
    try {
      if (password === 'zubst2024admin') {
        const email = 'admin@zubnayastanciya.ru';

        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setAdminUser(data);
          localStorage.setItem('admin-auth', 'true');
          localStorage.setItem('admin-email', email);

          await updateLastLogin(data.id);
          await logActivity(data.id, 'login', 'auth', null, { success: true });

          return true;
        }
      }

      await logActivity(null, 'login', 'auth', null, { success: false });
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    if (adminUser) {
      await logActivity(adminUser.id, 'logout', 'auth', null, {});
    }

    setAdminUser(null);
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('admin-email');
  };

  const updateLastLogin = async (userId: string) => {
    try {
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (err) {
      console.error('Error updating last login:', err);
    }
  };

  const logActivity = async (
    adminUserId: string | null,
    action: string,
    resourceType: string,
    resourceId: string | null,
    details: Record<string, any>
  ) => {
    try {
      await supabase
        .from('admin_activity_logs')
        .insert({
          admin_user_id: adminUserId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
          ip_address: null,
          user_agent: navigator.userAgent
        });
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!adminUser) return false;

    if (adminUser.role === 'super_admin') return true;

    if (adminUser.role === 'admin') {
      return !['manage_admins', 'delete_any'].includes(permission);
    }

    if (adminUser.role === 'editor') {
      return ['create', 'update', 'view'].some(p => permission.includes(p));
    }

    if (adminUser.role === 'viewer') {
      return permission.includes('view');
    }

    return adminUser.permissions[permission] === true;
  };

  return {
    adminUser,
    loading,
    error,
    login,
    logout,
    hasPermission,
    logActivity: (action: string, resourceType: string, resourceId: string | null, details: Record<string, any>) => {
      if (adminUser) {
        return logActivity(adminUser.id, action, resourceType, resourceId, details);
      }
    }
  };
};
