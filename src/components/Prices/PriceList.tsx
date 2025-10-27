import React from 'react';
import { ServiceCategory } from './ServiceCategory';

interface PriceListProps {
  searchQuery: string;
}

export const PriceList: React.FC<PriceListProps> = ({ searchQuery }) => {
  const categories = [
    {
      title: 'Терапия',
      services: [
        { name: 'Консультация стоматолога-терапевта', price: 600 },
        { name: 'Анестезия аппликационная', price: 150, priceFrom: true },
        { name: 'Анестезия инфильтрационная/проводниковая', price: 500, priceFrom: true },
        { name: 'Лечение кариеса', price: 3550, priceFrom: true },
        { name: 'Лечение пульпита', price: 7800, priceFrom: true },
        { name: 'Лечение периодонтита', price: 12400, priceFrom: true },
        { name: 'Дентальный снимок', price: 350, priceFrom: true }
      ]
    },
    {
      title: 'Профессиональная гигиена',
      services: [
        { name: 'Профессиональная гигиена 1 сегмента AirFlow', price: 1700, priceFrom: true },
        { name: 'Профессиональная гигиена 1 челюсти AirFlow', price: 2700, priceFrom: true },
        { name: 'Профессиональная гигиена полости рта AirFlow', price: 4400, priceFrom: true },
        { name: 'Фторирование зубов в капах', price: 800 },
        { name: 'Отбеливание', price: 10000, priceFrom: true }
      ]
    },
    {
      title: 'Хирургия',
      services: [
        { name: 'Удаление зуба простое', price: 3000 },
        { name: 'Удаление зуба сложное', price: 5000 },
        { name: 'Имплантация зуба под ключ', price: 45000 },
        { name: 'Синус-лифтинг', price: 30000 },
        { name: 'Костная пластика', price: 25000 }
      ]
    },
    {
      title: 'Ортодонтия',
      services: [
        { name: 'Консультация ортодонта', price: 1500 },
        { name: 'Установка брекетов', price: 40000, priceFrom: true },
        { name: 'Элайнеры', price: 150000, priceFrom: true },
        { name: 'Ретейнеры', price: 8000 },
        { name: 'Коррекция прикуса', price: 5000 }
      ]
    },
    {
      title: 'Протезирование',
      services: [
        { name: 'Металлокерамическая коронка', price: 11000 },
        { name: 'Коронка безметалловая', price: 25000 },
        { name: 'Виниры', price: 35000 },
        { name: 'Съемный протез', price: 30000 },
        { name: 'Бюгельный протез', price: 45000 }
      ]
    },
    {
      title: 'Детская стоматология',
      services: [
        { name: 'Консультация детского стоматолога', price: 1000 },
        { name: 'Лечение молочных зубов', price: 3500 },
        { name: 'Герметизация фиссур', price: 2000 },
        { name: 'Серебрение зубов', price: 1500 },
        { name: 'Пломбирование молочных зубов', price: 4000 }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <ServiceCategory
          key={index}
          title={category.title}
          services={category.services}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
};