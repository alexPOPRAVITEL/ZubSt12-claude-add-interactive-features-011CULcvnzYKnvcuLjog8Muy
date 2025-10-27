import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Baby, MessageCircle, Brain, Wrench, Syringe, Bone, Heart, Magnet, Award, Users, Sparkles, Shield } from 'lucide-react';
import { AppointmentModal } from './AppointmentModal';
import { supabase } from '../utils/supabase';

interface DoctorButton {
  label: string;
  action_type: 'appointment' | 'blog' | 'link';
  target_value: string;
}

interface Doctor {
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
  buttons?: DoctorButton[];
  service_categories?: string[];
  created_at: string;
  updated_at: string;
}

export const Doctors: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      // Fallback to empty array if there's an error
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Determine features based on specialization
  const getDoctorFeatures = (specialization: string): string[] => {
    const features = ['communication']; // All doctors have communication
    
    if (specialization.toLowerCase().includes('терапевт')) {
      features.push('microscope');
    }
    if (specialization.toLowerCase().includes('детский') || specialization.toLowerCase().includes('ребен')) {
      features.push('children', 'heart');
    }
    if (specialization.toLowerCase().includes('хирург')) {
      features.push('syringe');
    }
    if (specialization.toLowerCase().includes('ортопед')) {
      features.push('wrench');
    }
    if (specialization.toLowerCase().includes('ортодонт')) {
      features.push('magnet');
    }
    if (specialization.toLowerCase().includes('имплант')) {
      features.push('bone');
    }
    if (specialization.toLowerCase().includes('директор') || specialization.toLowerCase().includes('управляющий')) {
      features.push('brain');
    }
    if (specialization.toLowerCase().includes('администратор') || specialization.toLowerCase().includes('ассистент')) {
      features.push('heart');
    }
    
    return features;
  };

  const handleButtonAction = (doctor: Doctor, button: DoctorButton) => {
    switch (button.action_type) {
      case 'appointment':
        setSelectedDoctor(doctor.name);
        setSelectedService(button.target_value);
        setIsModalOpen(true);
        break;
      case 'blog':
        if (button.target_value.startsWith('http')) {
          window.open(button.target_value, '_blank');
        } else {
          window.location.href = button.target_value;
        }
        break;
      case 'link':
        window.open(button.target_value, '_blank');
        break;
    }
  };

  // Get trust badges based on experience
  const getTrustBadges = (experienceYears: number, specialization: string) => {
    const badges = [];

    // Опыт
    if (experienceYears >= 10) {
      badges.push({ icon: Award, label: 'Эксперт', color: 'text-yellow-600' });
    } else if (experienceYears >= 5) {
      badges.push({ icon: Award, label: 'Опытный', color: 'text-blue-600' });
    } else {
      badges.push({ icon: Sparkles, label: 'Перспективный', color: 'text-purple-600' });
    }

    // Доверие пациентов
    badges.push({ icon: Users, label: 'Любим пациентами', color: 'text-green-600' });

    // Профессионализм
    if (!specialization.toLowerCase().includes('администратор') &&
        !specialization.toLowerCase().includes('ассистент')) {
      badges.push({ icon: Shield, label: 'Сертифицирован', color: 'text-indigo-600' });
    }

    return badges;
  };

  const FeatureIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'microscope':
        return <Microscope className="w-5 h-5" title="Работает с микроскопом" />;
      case 'children':
        return <Baby className="w-5 h-5" title="Работает с детьми" />;
      case 'communication':
        return <MessageCircle className="w-5 h-5" title="Говорит по-человечески" />;
      case 'brain':
        return <Brain className="w-5 h-5" title="Стратегическое управление" />;
      case 'wrench':
        return <Wrench className="w-5 h-5" title="Протезирование" />;
      case 'syringe':
        return <Syringe className="w-5 h-5" title="Хирургия" />;
      case 'bone':
        return <Bone className="w-5 h-5" title="Имплантация" />;
      case 'heart':
        return <Heart className="w-5 h-5" title="Детский подход" />;
      case 'magnet':
        return <Magnet className="w-5 h-5" title="Ортодонтия" />;
      default:
        return null;
    }
  };

  const handleAppointment = (doctorName: string) => {
    // Check if this is Alexander (not a doctor)
    if (doctorName === 'Голев Александр Леонидович') {
      // Open contact form or redirect to contacts
      window.location.href = '/contacts';
    } else {
      setSelectedDoctor(doctorName);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8">
            Врачи, которым доверяют семьи
          </h1>
          
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Мы собрали команду, которая не просто лечит зубы — а помогает преодолеть страхи, 
            сохранить здоровье и уверенность на долгие годы.
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Врачи скоро появятся</h3>
              <p className="text-gray-600">Мы работаем над добавлением информации о наших специалистах</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-64 mb-6 overflow-hidden rounded-lg">
                  <img
                    src={doctor.photo_url || 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-[center_30%]"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                <p className="text-primary mb-2">{doctor.specialization} | {doctor.experience_years} {doctor.experience_years === 1 ? 'год' : doctor.experience_years < 5 ? 'года' : 'лет'} опыта</p>
                
                <div className="flex space-x-3 mb-4">
                  {getDoctorFeatures(doctor.specialization).map((feature, i) => (
                    <span key={i} className="text-primary">
                      <FeatureIcon type={feature} />
                    </span>
                  ))}
                </div>

                {doctor.quote && (
                  <blockquote className="text-gray-600 italic mb-6">
                    "{doctor.quote}"
                  </blockquote>
                )}

                {doctor.achievements && doctor.achievements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">ДОСТИЖЕНИЯ:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {doctor.achievements.slice(0, 3).map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-green-500 mr-2 text-xs">✓</span>
                          {achievement}
                        </li>
                      ))}
                      {doctor.achievements.length > 3 && (
                        <li className="text-gray-500 text-xs">и еще {doctor.achievements.length - 3}...</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {getTrustBadges(doctor.experience_years, doctor.specialization).map((badge, i) => {
                      const IconComponent = badge.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass-button flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-primary/30 transition-all duration-300"
                        >
                          <IconComponent className={`w-4 h-4 ${badge.color}`} />
                          <span className="text-xs font-medium text-gray-700">{badge.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Action Buttons */}
                {doctor.buttons && doctor.buttons.length > 0 ? (
                  <div className="space-y-2">
                    {doctor.buttons.map((button, buttonIndex) => (
                      <button
                        key={buttonIndex}
                        onClick={() => handleButtonAction(doctor, button)}
                        className={`w-full py-2 px-4 rounded-xl font-medium transition-colors duration-300 ${
                          button.action_type === 'appointment' 
                            ? 'bg-primary text-white hover:bg-primary-dark'
                            : button.action_type === 'blog'
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-500 text-white hover:bg-gray-600'
                        }`}
                      >
                        {button.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAppointment(doctor.name)}
                    className="w-full bg-primary text-white py-2 px-4 rounded-xl hover:bg-primary-dark transition-colors duration-300"
                  >
                    {doctor.name === 'Голев Александр Леонидович' ? 'Связаться' : 'Записаться на приём'}
                  </button>
                )}
              </motion.div>
            ))}
            </div>
          )}
        </motion.div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDoctor('');
          setSelectedService('');
        }}
        selectedDoctor={selectedDoctor}
        selectedService={selectedService}
      />
    </div>
  );
};