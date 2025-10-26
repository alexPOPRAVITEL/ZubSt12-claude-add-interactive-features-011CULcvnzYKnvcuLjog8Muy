import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  images?: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: string;
  author?: string;
  read_time?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  area: string;
  images: string[];
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  treatment_type?: string;
  duration?: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  education?: string;
  photo_url?: string;
  bio?: string;
  phone?: string;
  email?: string;
  schedule?: string;
  is_active: boolean;
  quote?: string;
  achievements?: string[];
  buttons?: Array<{
    label: string;
    action_type: 'appointment' | 'blog' | 'link';
    target_value: string;
  }>;
  service_categories?: string[];
  created_at: string;
  updated_at: string;
};

export type AppointmentServiceCategory = {
  id: string;
  name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type AppointmentService = {
  id: string;
  category_id: string;
  name: string;
  duration?: string;
  price?: number;
  description?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchBlogPosts(category: string = 'all'): Promise<BlogPost[]> {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

export async function fetchProjects(category: string = 'all'): Promise<Project[]> {
  let query = supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  if (category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function fetchDoctors(): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }

  return data || [];
}

export async function fetchAppointmentCategories(): Promise<AppointmentServiceCategory[]> {
  const { data, error } = await supabase
    .from('appointment_service_categories')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching appointment categories:', error);
    return [];
  }

  return data || [];
}

export async function fetchAppointmentServices(categoryId?: string): Promise<AppointmentService[]> {
  let query = supabase
    .from('appointment_services')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching appointment services:', error);
    return [];
  }

  return data || [];
}