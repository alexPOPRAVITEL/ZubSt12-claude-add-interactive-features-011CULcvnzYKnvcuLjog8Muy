/*
  # Real-time Notifications for Orders and Resumes

  1. Changes
    - Add trigger to send notifications when new orders are created
    - Add trigger to send notifications when new appointments are created
    - Add function to create admin notifications automatically

  2. Security
    - Maintains existing RLS policies
    - Only creates notifications for admin users
*/

-- Function to create admin notification
CREATE OR REPLACE FUNCTION create_admin_notification(
  notification_type TEXT,
  notification_title TEXT,
  notification_message TEXT,
  notification_data JSONB DEFAULT '{}'::jsonb
)
RETURNS void AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get first admin user (you can modify this to get all admins)
  SELECT id INTO admin_id
  FROM admin_users
  WHERE role = 'admin'
  LIMIT 1;

  IF admin_id IS NOT NULL THEN
    INSERT INTO admin_notifications (
      admin_user_id,
      type,
      title,
      message,
      data,
      is_read
    ) VALUES (
      admin_id,
      notification_type,
      notification_title,
      notification_message,
      notification_data,
      false
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for new orders
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_admin_notification(
    'new_order',
    'Новый заказ!',
    format('Получен новый заказ от %s на сумму %s ₽', NEW.customer_name, NEW.total_amount),
    jsonb_build_object(
      'order_id', NEW.id,
      'customer_name', NEW.customer_name,
      'customer_phone', NEW.customer_phone,
      'total_amount', NEW.total_amount
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for new appointments
CREATE OR REPLACE FUNCTION notify_new_appointment()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_admin_notification(
    'new_appointment',
    'Новая запись на прием!',
    format('Пациент %s записался на %s', NEW.patient_name, to_char(NEW.appointment_date, 'DD.MM.YYYY HH24:MI')),
    jsonb_build_object(
      'appointment_id', NEW.id,
      'patient_name', NEW.patient_name,
      'patient_phone', NEW.patient_phone,
      'appointment_date', NEW.appointment_date,
      'service', NEW.service
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_new_order ON orders;
CREATE TRIGGER trigger_new_order
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_order();

DROP TRIGGER IF EXISTS trigger_new_appointment ON appointments;
CREATE TRIGGER trigger_new_appointment
  AFTER INSERT ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_appointment();
