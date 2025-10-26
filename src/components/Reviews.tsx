import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const reviews = [
  {
    id: 1,
    name: 'Анна Петрова',
    date: '15 марта 2024',
    text: 'Прекрасная клиника! Лечила зубы у Натальи Федоровны, очень внимательный и профессиональный врач. Всё прошло безболезненно и комфортно.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
  },
  {
    id: 2,
    name: 'Михаил Иванов',
    date: '10 марта 2024',
    text: 'Делал имплантацию, очень доволен результатом. Персонал заботливый, всё объясняют, отвечают на вопросы. Рекомендую!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
  },
  {
    id: 3,
    name: 'Елена Сидорова',
    date: '5 марта 2024',
    text: 'Водила ребёнка на первый приём. Врач нашла подход, ребёнок совсем не боялся. Теперь ходим только сюда!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=100&h=100'
  }
];

export const Reviews: React.FC = () => {
  const iframeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.id = 'big_light_70000001085665549';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.sandbox.add('allow-scripts', 'allow-same-origin', 'allow-forms', 'allow-modals', 'allow-popups', 'allow-top-navigation-by-user-activation');
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = `
      ((r,u)=>{
        const l=document.getElementById(r);
        l.contentWindow.document.open();
        l.contentWindow.document.write(decodeURIComponent(escape(atob(u))));
        l.contentWindow.document.close();
      })("big_light_70000001085665549", "PGhlYWQ+PHNjcmlwdCB0eXBlPSJ0ZXh0L2phdmFzY3JpcHQiPgogICAgd2luZG93Ll9fc2l6ZV9fPSdiaWcnOwogICAgd2luZG93Ll9fdGhlbWVfXz0nbGlnaHQnOwogICAgd2luZG93Ll9fYnJhbmNoSWRfXz0nNzAwMDAwMDEwODU2NjU1NDknCiAgICB3aW5kb3cuX19vcmdJZF9fPSc3MDAwMDAwMTA4NTY2NTU0OCcKICAgPC9zY3JpcHQ+PHNjcmlwdCBjcm9zc29yaWdpbj0iYW5vbnltb3VzIiB0eXBlPSJtb2R1bGUiIHNyYz0iaHR0cHM6Ly9kaXNrLjJnaXMuY29tL3dpZGdldC1jb25zdHJ1Y3Rvci9hc3NldHMvaWZyYW1lLmpzIj48L3NjcmlwdD48bGluayByZWw9Im1vZHVsZXByZWxvYWQiIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIGhyZWY9Imh0dHBzOi8vZGlzay4yZ2lzLmNvbS93aWRnZXQtY29uc3RydWN0b3IvYXNzZXRzL2RlZmF1bHRzLmpzIj48bGluayByZWw9InN0eWxlc2hlZXQiIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIGhyZWY9Imh0dHBzOi8vZGlzay4yZ2lzLmNvbS93aWRnZXQtY29uc3RydWN0b3IvYXNzZXRzL2RlZmF1bHRzLmNzcyI+PC9oZWFkPjxib2R5PjxkaXYgaWQ9ImlmcmFtZSI+PC9kaXY+PC9ib2R5Pg==");
    `;

    if (iframeRef.current) {
      iframeRef.current.innerHTML = '';
      iframeRef.current.appendChild(iframe);
      document.body.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Отзывы наших пациентов</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="pb-12"
              >
                {reviews.map((review) => (
                  <SwiperSlide key={review.id}>
                    <div className="bg-white rounded-2xl p-6 shadow-md h-full">
                      <div className="flex items-center mb-4">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                          loading="lazy"
                        />
                        <div>
                          <h3 className="font-semibold">{review.name}</h3>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden h-[600px]">
              <div ref={iframeRef} className="w-full h-full"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};