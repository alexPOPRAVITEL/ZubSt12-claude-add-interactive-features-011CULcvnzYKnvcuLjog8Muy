import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const YANDEX_DISK_TOKEN = Deno.env.get('YANDEX_DISK_TOKEN') ?? '';
const YANDEX_API_BASE = 'https://cloud-api.yandex.net/v1/disk';

interface YandexDiskFile {
  name: string;
  type: 'file' | 'dir';
  path: string;
  size?: number;
  created: string;
  modified: string;
  preview?: string;
  file?: string; // download URL
}

interface YandexDiskResponse {
  _embedded?: {
    items: YandexDiskFile[];
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const section = url.searchParams.get('section');

    switch (action) {
      case 'list':
        return await listMedia(section);
      case 'upload':
        return await uploadMedia(req);
      case 'delete':
        return await deleteMedia(req);
      case 'get-upload-url':
        return await getUploadUrl(req);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: corsHeaders }
        );
    }
  } catch (error) {
    console.error('Error in yandex-disk function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

async function listMedia(section: string | null) {
  try {
    if (!section) {
      return new Response(
        JSON.stringify({ error: 'Section parameter is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const folderPath = `site-content/${section}`;
    
    // Получаем список файлов из Яндекс.Диска
    const response = await fetch(
      `${YANDEX_API_BASE}/resources?path=${encodeURIComponent(folderPath)}&limit=100`,
      {
        headers: {
          'Authorization': `OAuth ${YANDEX_DISK_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // Папка не существует, создаем её
        await createFolder(folderPath);
        return new Response(
          JSON.stringify({ files: [] }),
          { headers: corsHeaders }
        );
      }
      throw new Error(`Yandex.Disk API error: ${response.status}`);
    }

    const data: YandexDiskResponse = await response.json();
    const files = data._embedded?.items?.filter(item => item.type === 'file') || [];

    // Получаем данные из Supabase для сопоставления
    const { data: dbFiles, error: dbError } = await supabase
      .from('site_media_content')
      .select('*')
      .eq('section', section);

    if (dbError) {
      console.error('Database error:', dbError);
    }

    // Объединяем данные из Яндекс.Диска и Supabase
    const combinedFiles = files.map(file => {
      const dbFile = dbFiles?.find(db => db.file_name === file.name);
      return {
        id: dbFile?.id,
        name: file.name,
        path: file.path,
        size: file.size,
        type: getFileType(file.name),
        preview: file.preview,
        downloadUrl: file.file,
        altText: dbFile?.alt_text || '',
        caption: dbFile?.caption || '',
        createdAt: file.created,
        modifiedAt: file.modified,
        publicUrl: dbFile?.public_url || ''
      };
    });

    return new Response(
      JSON.stringify({ files: combinedFiles }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error listing media:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

async function uploadMedia(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const section = formData.get('section') as string;
    const altText = formData.get('altText') as string || '';
    const caption = formData.get('caption') as string || '';

    if (!file || !section) {
      return new Response(
        JSON.stringify({ error: 'File and section are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const folderPath = `site-content/${section}`;
    const filePath = `${folderPath}/${file.name}`;

    // Получаем URL для загрузки
    const uploadUrlResponse = await fetch(
      `${YANDEX_API_BASE}/resources/upload?path=${encodeURIComponent(filePath)}&overwrite=true`,
      {
        headers: {
          'Authorization': `OAuth ${YANDEX_DISK_TOKEN}`,
        },
      }
    );

    if (!uploadUrlResponse.ok) {
      throw new Error(`Failed to get upload URL: ${uploadUrlResponse.status}`);
    }

    const { href: uploadUrl } = await uploadUrlResponse.json();

    // Загружаем файл
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.status}`);
    }

    // Получаем публичную ссылку
    const publicUrl = await getPublicUrl(filePath);

    // Сохраняем информацию в Supabase
    const { data, error } = await supabase
      .from('site_media_content')
      .upsert({
        section,
        file_name: file.name,
        yandex_disk_path: filePath,
        public_url: publicUrl,
        type: getFileType(file.name),
        alt_text: altText,
        caption: caption,
      }, {
        onConflict: 'section,file_name'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save file info to database');
    }

    return new Response(
      JSON.stringify({ success: true, file: data }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error uploading media:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

async function deleteMedia(req: Request) {
  try {
    const { section, fileName } = await req.json();

    if (!section || !fileName) {
      return new Response(
        JSON.stringify({ error: 'Section and fileName are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const filePath = `site-content/${section}/${fileName}`;

    // Удаляем файл с Яндекс.Диска
    const deleteResponse = await fetch(
      `${YANDEX_API_BASE}/resources?path=${encodeURIComponent(filePath)}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `OAuth ${YANDEX_DISK_TOKEN}`,
        },
      }
    );

    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      throw new Error(`Failed to delete file from Yandex.Disk: ${deleteResponse.status}`);
    }

    // Удаляем запись из Supabase
    const { error } = await supabase
      .from('site_media_content')
      .delete()
      .eq('section', section)
      .eq('file_name', fileName);

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to delete file info from database');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting media:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

async function getUploadUrl(req: Request) {
  try {
    const { section, fileName } = await req.json();

    if (!section || !fileName) {
      return new Response(
        JSON.stringify({ error: 'Section and fileName are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const filePath = `site-content/${section}/${fileName}`;

    const response = await fetch(
      `${YANDEX_API_BASE}/resources/upload?path=${encodeURIComponent(filePath)}&overwrite=true`,
      {
        headers: {
          'Authorization': `OAuth ${YANDEX_DISK_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get upload URL: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ uploadUrl: data.href }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error getting upload URL:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

async function createFolder(path: string) {
  try {
    const response = await fetch(
      `${YANDEX_API_BASE}/resources?path=${encodeURIComponent(path)}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `OAuth ${YANDEX_DISK_TOKEN}`,
        },
      }
    );

    if (!response.ok && response.status !== 409) { // 409 = folder already exists
      throw new Error(`Failed to create folder: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

async function getPublicUrl(path: string): Promise<string> {
  try {
    // Сначала публикуем файл
    const publishResponse = await fetch(
      `${YANDEX_API_BASE}/resources/publish?path=${encodeURIComponent(path)}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `OAuth ${YANDEX_DISK_TOKEN}`,
        },
      }
    );

    if (!publishResponse.ok) {
      throw new Error(`Failed to publish file: ${publishResponse.status}`);
    }

    // Получаем информацию о файле с публичной ссылкой
    const infoResponse = await fetch(
      `${YANDEX_API_BASE}/resources?path=${encodeURIComponent(path)}`,
      {
        headers: {
          'Authorization': `OAuth ${YANDEX_DISK_TOKEN}`,
        },
      }
    );

    if (!infoResponse.ok) {
      throw new Error(`Failed to get file info: ${infoResponse.status}`);
    }

    const fileInfo = await infoResponse.json();
    return fileInfo.public_url || fileInfo.file || '';
  } catch (error) {
    console.error('Error getting public URL:', error);
    return '';
  }
}

function getFileType(fileName: string): 'image' | 'video' {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'avi', 'mov', 'wmv'];

  if (imageExtensions.includes(extension || '')) {
    return 'image';
  } else if (videoExtensions.includes(extension || '')) {
    return 'video';
  }
  
  return 'image'; // default
}