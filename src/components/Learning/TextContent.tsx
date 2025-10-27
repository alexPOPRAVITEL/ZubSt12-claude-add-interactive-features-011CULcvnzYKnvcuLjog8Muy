import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TextContentProps {
  content: {
    text: string;
    format?: 'markdown' | 'html' | 'plain';
  };
  onComplete?: () => void;
}

export const TextContent: React.FC<TextContentProps> = ({ content, onComplete }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const element = e.target as HTMLDivElement;
      const scrolled = element.scrollTop;
      const maxScroll = element.scrollHeight - element.clientHeight;
      const progress = Math.min((scrolled / maxScroll) * 100, 100);

      setScrollProgress(progress);

      if (progress >= 90 && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
      }
    };

    const contentElement = document.getElementById('text-content-container');
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [hasScrolledToBottom]);

  const renderContent = () => {
    if (content.format === 'html') {
      return <div dangerouslySetInnerHTML={{ __html: content.text }} />;
    }

    return (
      <div className="prose prose-blue max-w-none">
        {content.text.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div
        id="text-content-container"
        className="max-h-[500px] overflow-y-auto pr-4 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #F7FAFC',
        }}
      >
        {renderContent()}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {hasScrolledToBottom
            ? '✓ You have reviewed all the content'
            : 'Scroll to read all content'}
        </p>

        <button
          onClick={onComplete}
          disabled={!hasScrolledToBottom}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark as Complete
        </button>
      </div>
    </div>
  );
};
