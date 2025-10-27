import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string; // Data URL of the image to crop
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob, fileName: string) => void;
  fileName: string; // Original file name for the cropped image
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  fileName,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    // Reset crop when modal opens or image changes
    if (isOpen && imageSrc) {
      setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
      setCompletedCrop(undefined);
      setScale(1);
      setRotate(0);
    }
  }, [isOpen, imageSrc]);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget;
  }, []);

  const getCroppedImg = useCallback(async () => {
    const image = imgRef.current;

    if (!completedCrop || !image) {
      throw new Error('Crop not set or image not loaded.');
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to the crop size
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);

    // Draw the cropped image
    ctx.drawImage(
      image,
      (completedCrop.x * scaleX - canvas.width / 2) / scale,
      (completedCrop.y * scaleY - canvas.height / 2) / scale,
      (completedCrop.width * scaleX) / scale,
      (completedCrop.height * scaleY) / scale,
      -canvas.width / 2 / scale,
      -canvas.height / 2 / scale,
      (completedCrop.width * scaleX) / scale,
      (completedCrop.height * scaleY) / scale
    );

    ctx.restore();

    // Convert canvas to blob
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        0.95
      );
    });
  }, [completedCrop, scale, rotate]);

  const handleCropAndSave = async () => {
    try {
      const croppedBlob = await getCroppedImg();
      onCropComplete(croppedBlob, fileName);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Ошибка при обрезке изображения');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Обрезать фотографию врача</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto mb-6 flex justify-center">
              {imageSrc && (
                <div className="max-w-full max-h-96">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1} // Square aspect ratio for doctor photos
                    minWidth={100}
                    minHeight={100}
                    circularCrop={false}
                  >
                    <img
                      ref={imgRef}
                      alt="Обрезать изображение"
                      src={imageSrc}
                      onLoad={onImageLoad}
                      style={{ 
                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                        maxWidth: '100%',
                        maxHeight: '400px'
                      }}
                    />
                  </ReactCrop>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setScale(prev => Math.min(3, prev + 0.1))}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <ZoomIn className="w-4 h-4 mr-2" />
                Увеличить
              </button>
              <button
                onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <ZoomOut className="w-4 h-4 mr-2" />
                Уменьшить
              </button>
              <button
                onClick={() => setRotate(prev => (prev + 90) % 360)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Повернуть
              </button>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Выберите область для обрезки. Рекомендуется квадратное изображение для лучшего отображения.
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleCropAndSave}
                disabled={!completedCrop?.width || !completedCrop?.height}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Check className="w-5 h-5 mr-2" />
                Обрезать и сохранить
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};