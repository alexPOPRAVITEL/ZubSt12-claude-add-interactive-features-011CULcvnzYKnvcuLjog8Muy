import { supabase } from './supabase';

export interface MediaFile {
  id: string;
  section: string;
  file_name: string;
  yandex_disk_path: string;
  public_url: string;
  type: 'image' | 'video';
  alt_text: string;
  caption: string;
  created_at: string;
  updated_at: string;
}

/**
 * Получить медиафайлы для определенного раздела сайта
 */
export async function getMediaFiles(section: string): Promise<MediaFile[]> {
  try {
    // Check if table exists first
    const { data: tableCheck, error: tableError } = await supabase
      .from('site_media_content')
      .select('id')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') {
      console.warn('site_media_content table does not exist yet');
      return [];
    }

    const { data, error } = await supabase
      .from('site_media_content')
      .select('*')
      .eq('section', section)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media files:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getMediaFiles:', error);
    return [];
  }
}

/**
 * Получить конкретный медиафайл по имени и разделу
 */
export async function getMediaFile(section: string, fileName: string): Promise<MediaFile | null> {
  try {
    const { data, error } = await supabase
      .from('site_media_content')
      .select('*')
      .eq('section', section)
      .eq('file_name', fileName)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching media file, using fallback:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Error in getMediaFile, using fallback:', error);
    return null;
  }
}

/**
 * Получить URL изображения с fallback на дефолтное изображение
 */
export async function getImageUrl(section: string, fileName: string, fallbackUrl: string): Promise<string> {
  const file = await getMediaFile(section, fileName);
  return file?.public_url || fallbackUrl;
}

/**
 * Получить все изображения для раздела с fallback
 */
export async function getSectionImages(section: string, fallbackUrls: string[] = []): Promise<string[]> {
  const files = await getMediaFiles(section);
  const imageFiles = files.filter(file => file.type === 'image');
  
  if (imageFiles.length === 0) {
    return fallbackUrls;
  }
  
  return imageFiles.map(file => file.public_url);
}

/**
 * Хук для использования медиафайлов в React компонентах
 */
export function useMediaFiles(section: string) {
  const [files, setFiles] = React.useState<MediaFile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const mediaFiles = await getMediaFiles(section);
        setFiles(mediaFiles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [section]);

  return { files, loading, error, refetch: () => loadFiles() };
}