/*
  # Seed Sample Learning Content
  
  1. Data Seeding
    - Insert sample achievements
    - Insert sample course "Web Development Fundamentals"
    - Insert modules for the course
    - Insert lessons for each module
    - Insert steps (video, text, quiz) for lessons
  
  2. Notes
    - This creates a complete sample course for testing
    - Includes various content types: video, text, and quiz
    - All content is marked as published
*/

-- Insert sample achievements
INSERT INTO learning_achievements (id, name, description, icon, criteria, points)
VALUES
  (gen_random_uuid(), 'first_step', 'Complete your first lesson', '🎯', '{"lessons_completed": 1}'::jsonb, 10),
  (gen_random_uuid(), 'quick_learner', 'Complete 5 lessons', '🚀', '{"lessons_completed": 5}'::jsonb, 50),
  (gen_random_uuid(), 'dedicated', 'Spend 10 hours learning', '⏰', '{"time_spent": 36000}'::jsonb, 100),
  (gen_random_uuid(), 'excellence', 'Achieve 90% average score', '⭐', '{"avg_score": 90}'::jsonb, 150),
  (gen_random_uuid(), 'streak_master', 'Learn 7 days in a row', '🔥', '{"streak_days": 7}'::jsonb, 200)
ON CONFLICT DO NOTHING;

-- Insert sample course
INSERT INTO learning_courses (id, title, description, thumbnail_url, duration_hours, difficulty, category, is_published)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 
   'Web Development Fundamentals', 
   'Learn the basics of web development including HTML, CSS, and JavaScript. Perfect for beginners starting their coding journey.',
   'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
   12.5,
   'beginner',
   'Web Development',
   true)
ON CONFLICT DO NOTHING;

-- Insert modules
INSERT INTO learning_modules (id, course_id, title, description, position, estimated_time, is_published)
VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 
   'Introduction to Web Development', 
   'Get started with web development basics and understand how the web works.',
   1, 120, true),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 
   'HTML Essentials', 
   'Master HTML tags, attributes, and document structure.',
   2, 180, true),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 
   'CSS Styling', 
   'Learn how to style web pages with CSS and create beautiful layouts.',
   3, 240, true),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 
   'JavaScript Basics', 
   'Introduction to programming with JavaScript and DOM manipulation.',
   4, 210, true)
ON CONFLICT DO NOTHING;

-- Insert lessons for Module 1
INSERT INTO learning_lessons (id, module_id, title, description, position, duration_minutes, content_types, is_published)
VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001',
   'What is Web Development?',
   'Understand the fundamentals of web development and how websites work.',
   1, 30, ARRAY['video', 'text', 'quiz'], true),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001',
   'How the Internet Works',
   'Learn about clients, servers, and HTTP protocols.',
   2, 40, ARRAY['video', 'text', 'quiz'], true)
ON CONFLICT DO NOTHING;

-- Insert lessons for Module 2
INSERT INTO learning_lessons (id, module_id, title, description, position, duration_minutes, content_types, is_published)
VALUES
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002',
   'HTML Document Structure',
   'Learn the basic structure of an HTML document.',
   1, 35, ARRAY['video', 'text', 'quiz'], true),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002',
   'Common HTML Tags',
   'Master the most commonly used HTML tags.',
   2, 45, ARRAY['video', 'text', 'practice'], true)
ON CONFLICT DO NOTHING;

-- Insert steps for "What is Web Development?"
INSERT INTO learning_steps (id, lesson_id, step_number, type, title, content, estimated_time)
VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 1, 'video',
   'Introduction to Web Development',
   '{"url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "thumbnail": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800", "duration": 596}'::jsonb,
   10),
  ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 2, 'text',
   'Understanding Web Technologies',
   '{"text": "Web development involves creating websites and web applications that run in web browsers. It encompasses three main technologies:\n\nHTML (HyperText Markup Language): Provides the structure and content of web pages. Think of it as the skeleton of a website.\n\nCSS (Cascading Style Sheets): Controls the visual presentation and layout. This is like the skin and clothing that makes the website look good.\n\nJavaScript: Adds interactivity and dynamic behavior. This brings the website to life with animations, user interactions, and real-time updates.\n\nModern web development also involves:\n- Responsive design for mobile devices\n- Web accessibility for all users\n- Performance optimization\n- Security best practices\n\nAs you progress in this course, you will learn each of these technologies in depth and understand how they work together to create modern web applications.", "format": "plain"}'::jsonb,
   15),
  ('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 3, 'quiz',
   'Test Your Knowledge',
   '{"questions": [
      {
        "id": "q1",
        "text": "Which technology is responsible for the structure of a web page?",
        "options": [
          {"label": "A", "value": "A", "text": "CSS"},
          {"label": "B", "value": "B", "text": "HTML"},
          {"label": "C", "value": "C", "text": "JavaScript"},
          {"label": "D", "value": "D", "text": "Python"}
        ],
        "correctAnswer": "B",
        "explanation": "HTML (HyperText Markup Language) provides the structure and content of web pages.",
        "hint": "Think about what creates the skeleton of a website."
      },
      {
        "id": "q2",
        "text": "What does CSS stand for?",
        "options": [
          {"label": "A", "value": "A", "text": "Computer Style Sheets"},
          {"label": "B", "value": "B", "text": "Creative Style System"},
          {"label": "C", "value": "C", "text": "Cascading Style Sheets"},
          {"label": "D", "value": "D", "text": "Colorful Style Sheets"}
        ],
        "correctAnswer": "C",
        "explanation": "CSS stands for Cascading Style Sheets, which control the visual presentation of web pages.",
        "hint": "The C stands for a word meaning flowing downward."
      },
      {
        "id": "q3",
        "text": "Which technology adds interactivity to websites?",
        "options": [
          {"label": "A", "value": "A", "text": "HTML"},
          {"label": "B", "value": "B", "text": "CSS"},
          {"label": "C", "value": "C", "text": "JavaScript"},
          {"label": "D", "value": "D", "text": "SQL"}
        ],
        "correctAnswer": "C",
        "explanation": "JavaScript is the programming language that adds interactivity and dynamic behavior to websites.",
        "hint": "Look for the programming language in the options."
      }
    ], "passingScore": 70, "allowRetry": true, "instantFeedback": true}'::jsonb,
   5)
ON CONFLICT DO NOTHING;

-- Insert steps for "How the Internet Works"
INSERT INTO learning_steps (id, lesson_id, step_number, type, title, content, estimated_time)
VALUES
  ('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', 1, 'video',
   'Understanding the Internet',
   '{"url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "thumbnail": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", "duration": 653}'::jsonb,
   12),
  ('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 2, 'text',
   'Client-Server Architecture',
   '{"text": "The internet works on a client-server model:\n\nClient: Your web browser (Chrome, Firefox, Safari, etc.) that requests and displays web pages. The client is your device - computer, phone, or tablet.\n\nServer: A powerful computer that stores website files and sends them to clients when requested. Servers run 24/7 to ensure websites are always available.\n\nHow it works:\n1. You type a URL in your browser\n2. The browser sends an HTTP request to the server\n3. The server processes the request\n4. The server sends back HTML, CSS, and JavaScript files\n5. Your browser renders the web page\n\nKey Concepts:\n\nHTTP (HyperText Transfer Protocol): The language browsers and servers use to communicate\n\nURL (Uniform Resource Locator): The web address that identifies a resource on the internet\n\nDNS (Domain Name System): Translates human-readable domain names into IP addresses\n\nIP Address: A unique numerical identifier for every device on the internet\n\nThis process happens in milliseconds, creating the seamless browsing experience you are familiar with.", "format": "plain"}'::jsonb,
   20),
  ('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 3, 'quiz',
   'Internet Knowledge Check',
   '{"questions": [
      {
        "id": "q4",
        "text": "What is the role of a web server?",
        "options": [
          {"label": "A", "value": "A", "text": "To display web pages to users"},
          {"label": "B", "value": "B", "text": "To store and serve website files"},
          {"label": "C", "value": "C", "text": "To browse the internet"},
          {"label": "D", "value": "D", "text": "To write code"}
        ],
        "correctAnswer": "B",
        "explanation": "A web server stores website files and sends them to clients when requested."
      },
      {
        "id": "q5",
        "text": "What does HTTP stand for?",
        "options": [
          {"label": "A", "value": "A", "text": "HyperText Transfer Protocol"},
          {"label": "B", "value": "B", "text": "High Transfer Text Protocol"},
          {"label": "C", "value": "C", "text": "HyperText Transmission Process"},
          {"label": "D", "value": "D", "text": "Home Tool Transfer Protocol"}
        ],
        "correctAnswer": "A",
        "explanation": "HTTP stands for HyperText Transfer Protocol, the foundation of data communication on the web."
      }
    ], "passingScore": 70, "allowRetry": true, "instantFeedback": false}'::jsonb,
   8)
ON CONFLICT DO NOTHING;

-- Insert steps for "HTML Document Structure"
INSERT INTO learning_steps (id, lesson_id, step_number, type, title, content, estimated_time)
VALUES
  ('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440003', 1, 'text',
   'Basic HTML Structure',
   '{"text": "Every HTML document follows a basic structure:\n\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>Page Title</title>\n  </head>\n  <body>\n    <h1>My First Heading</h1>\n    <p>My first paragraph.</p>\n  </body>\n</html>\n\nKey Elements:\n\n<!DOCTYPE html>: Declares this is an HTML5 document\n\n<html>: The root element that contains all other elements\n\n<head>: Contains meta information about the document (title, styles, scripts)\n\n<title>: Specifies the title shown in the browser tab\n\n<body>: Contains the visible page content\n\nHTML uses tags (enclosed in angle brackets) to define elements. Most tags come in pairs: an opening tag <tag> and a closing tag </tag>.", "format": "plain"}'::jsonb,
   15)
ON CONFLICT DO NOTHING;