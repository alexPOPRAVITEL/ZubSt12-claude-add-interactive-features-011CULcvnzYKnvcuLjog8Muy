import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Bot } from 'npm:grammy@1.19.2';
import { createClient } from 'npm:@supabase/supabase-js@2';

const TELEGRAM_BOT_TOKEN = '7586460732:AAEWcXpmrv3cNiONowaWvQ1Ivmfm886OjRo';
const TELEGRAM_CHAT_ID = '-1002507869697';
const TELEGRAM_THREAD_ID = '162';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey'
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    console.log('Received request body:', body);

    const { type = 'appointment' } = body;

    let message: string;

    if (type === 'Отзыв') {
      const { name, phone, service, rating, review } = body;

      if (!name || !rating || !review) {
        console.error('Missing required fields for review:', { name, rating, review });
        return new Response(
          JSON.stringify({ error: 'Missing required fields for review' }), 
          { status: 400, headers: corsHeaders }
        );
      }

      message = [
        `⭐ *НОВЫЙ ОТЗЫВ О КЛИНИКЕ*`,
        ``,
        `👤 *Имя*: ${name}`,
        phone ? `📱 *Телефон*: ${phone}` : null,
        service ? `🦷 *Услуга*: ${service}` : null,
        `⭐ *Оценка*: ${rating}/5`,
        ``,
        `💬 *Текст отзыва*:`,
        `"${review}"`,
        ``,
        `📍 *Источник*: Сайт - Форма отзывов`,
        `⏰ *Время отправки*: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Barnaul' })}`,
        ``,
        `ℹ️ *Для публикации отзыва на сайте обратитесь к администратору*`
      ].filter(Boolean).join('\n');
    } else if (type === 'Программа лояльности') {
      const { name, phone, email, gender } = body;

      if (!name || !phone || !email || !gender) {
        console.error('Missing required fields:', { name, phone, email, gender });
        return new Response(
          JSON.stringify({ error: 'Missing required fields for loyalty card' }), 
          { status: 400, headers: corsHeaders }
        );
      }

      message = [
        `🎯 *НОВАЯ ЗАЯВКА НА КАРТУ ЛОЯЛЬНОСТИ*`,
        ``,
        `👤 *Имя*: ${name}`,
        `📱 *Телефон*: ${phone}`,
        `📧 *Email*: ${email}`,
        `👥 *Пол*: ${gender === 'male' ? 'Мужской' : 'Женский'}`,
        ``,
        `📍 *Источник*: Сайт - Форма карты лояльности`,
        `⏰ *Время заявки*: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Barnaul' })}`
      ].join('\n');
    } else if (type === 'Заказ из магазина') {
      const { customer_name, customer_phone, customer_email, items, subtotal, discount, total, promo_code, is_gift, notifications } = body;

      if (!customer_name || !customer_phone || !items || !Array.isArray(items)) {
        console.error('Missing required fields for marketplace order:', { customer_name, customer_phone, items });
        return new Response(
          JSON.stringify({ error: 'Missing required fields for marketplace order' }), 
          { status: 400, headers: corsHeaders }
        );
      }

      const itemsList = items.map(item => `• ${item.name} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ₽`).join('\n');

      message = [
        `🛒 *НОВЫЙ ЗАКАЗ ИЗ МАГАЗИНА*`,
        ``,
        `👤 *Клиент*: ${customer_name}`,
        `📱 *Телефон*: ${customer_phone}`,
        customer_email ? `📧 *Email*: ${customer_email}` : null,
        ``,
        `📦 *Заказ*:`,
        itemsList,
        ``,
        `💰 *Сумма*: ${subtotal.toLocaleString()} ₽`,
        discount > 0 ? `💸 *Скидка*: ${discount.toLocaleString()} ₽` : null,
        promo_code ? `🎫 *Промокод*: ${promo_code}` : null,
        `💳 *К оплате*: ${total.toLocaleString()} ₽`,
        ``,
        is_gift ? `🎁 *Подарок*: Да` : null,
        notifications ? `🔔 *Уведомления*: Да` : `🔕 *Уведомления*: Нет`,
        ``,
        `📍 *Источник*: Сайт - Магазин`,
        `⏰ *Время заказа*: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Barnaul' })}`,
        ``,
        `ℹ️ *Свяжитесь с клиентом для подтверждения заказа*`
      ].filter(Boolean).join('\n');
    } else if (type === 'Абонемент "5+2"') {
      const { name, phone, email } = body;

      if (!name || !phone || !email) {
        console.error('Missing required fields for subscription:', { name, phone, email });
        return new Response(
          JSON.stringify({ error: 'Missing required fields for subscription' }), 
          { status: 400, headers: corsHeaders }
        );
      }

      message = [
        `💳 *НОВАЯ ЗАЯВКА НА АБОНЕМЕНТ "5+2"*`,
        ``,
        `👤 *Имя*: ${name}`,
        `📱 *Телефон*: ${phone}`,
        `📧 *Email*: ${email}`,
        ``,
        `💰 *Абонемент*: "5+2" (28 600₽)`,
        `📋 *Включает*:`,
        `• 5 лечебных приёмов с пломбировкой`,
        `• 2 профессиональные чистки AirFlow`,
        `• 2 профилактических осмотра`,
        `• Скидка 5% на все услуги клиники`,
        ``,
        `📍 *Источник*: Сайт - Форма абонемента`,
        `⏰ *Время заявки*: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Barnaul' })}`,
        ``,
        `ℹ️ *Свяжитесь с клиентом для оформления абонемента*`
      ].join('\n');
    } else if (type === 'Заявка на работу') {
      const { name, position, experience, phone, email, motivation } = body;

      if (!name || !position || !phone || !email || !motivation) {
        console.error('Missing required fields for job application:', { name, position, phone, email, motivation });
        return new Response(
          JSON.stringify({ error: 'Missing required fields for job application' }), 
          { status: 400, headers: corsHeaders }
        );
      }

      const positionNames = {
        'orthodontist': 'Врач-ортодонт',
        'implantologist': 'Врач-имплантолог',
        'pediatric': 'Детский стоматолог',
        'therapist': 'Врач-терапевт',
        'surgeon': 'Врач-хирург',
        'assistant': 'Ассистент врача',
        'administrator': 'Администратор',
        'other': 'Другая позиция'
      };

      const experienceNames = {
        'no-experience': 'Без опыта',
        '1-3': '1-3 года',
        '3-5': '3-5 лет',
        '5+': 'Более 5 лет'
      };

      message = [
        `👨‍⚕️ *НОВАЯ ЗАЯВКА НА РАБОТУ*`,
        ``,
        `👤 *Имя*: ${name}`,
        `💼 *Позиция*: ${positionNames[position as keyof typeof positionNames] || position}`,
        experience ? `📈 *Опыт*: ${experienceNames[experience as keyof typeof experienceNames] || experience}` : null,
        `📱 *Телефон*: ${phone}`,
        `📧 *Email*: ${email}`,
        ``,
        `💭 *Мотивация*:`,
        `"${motivation}"`,
        ``,
        `📍 *Источник*: Сайт - Страница команды`,
        `⏰ *Время заявки*: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Barnaul' })}`,
        ``,
        `ℹ️ *Свяжитесь с кандидатом для собеседования*`
      ].filter(Boolean).join('\n');
    } else {
      const { name, phone, service, date, time, comment, doctor } = body;

      if (!name || !phone || !service) {
        console.error('Missing required fields:', { name, phone, service });
        return new Response(
          JSON.stringify({ error: 'Missing required fields for appointment' }),
          { status: 400, headers: corsHeaders }
        );
      }

      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          service_id: service,
          doctor_id: doctor || null,
          appointment_date: date || null,
          appointment_time: time || null,
          client_name: name,
          client_phone: phone,
          client_email: null,
          status: 'pending'
        })
        .select()
        .single();

      if (appointmentError) {
        console.error('Error saving appointment to DB:', appointmentError);
      } else {
        console.log('Appointment saved to DB:', appointmentData);
      }

      message = [
        `🆕 *НОВАЯ ЗАЯВКА НА ПРИЁМ*`,
        ``,
        `📝 *Услуга*: ${service}`,
        doctor ? `👨‍⚕️ *Врач*: ${doctor}` : null,
        `👤 *Имя*: ${name}`,
        `📱 *Телефон*: ${phone}`,
        date ? `📅 *Дата*: ${date}` : null,
        time ? `⏰ *Время*: ${time}` : null,
        comment ? `💬 *Комментарий*: ${comment}` : null,
        ``,
        `📍 *Источник*: Сайт - Форма записи`,
        `⏰ *Время заявки*: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Barnaul' })}`
      ].filter(Boolean).join('\n');
    }

    console.log('Sending Telegram message:', message);

    const bot = new Bot(TELEGRAM_BOT_TOKEN);

    try {
      const result = await bot.api.sendMessage(TELEGRAM_CHAT_ID, message, {
        parse_mode: 'Markdown',
        message_thread_id: parseInt(TELEGRAM_THREAD_ID)
      });

      console.log('Telegram API response:', result);

      return new Response(
        JSON.stringify({ success: true }), 
        { headers: corsHeaders }
      );
    } catch (error) {
      console.error('Telegram API Error:', error);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send Telegram message',
          details: error instanceof Error ? error.message : 'Unknown error'
        }), 
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});