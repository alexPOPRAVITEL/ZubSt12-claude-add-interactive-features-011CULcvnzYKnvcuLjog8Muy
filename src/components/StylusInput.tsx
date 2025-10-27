import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Eraser, PenTool, Download } from 'lucide-react';

interface StylusInputProps {
  onSubmit?: (imageData: string, text: string) => void;
  placeholder?: string;
}

export const StylusInput: React.FC<StylusInputProps> = ({
  onSubmit,
  placeholder = 'Напишите или нарисуйте свой отзыв...'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [textInput, setTextInput] = useState('');
  const [activeInput, setActiveInput] = useState<'draw' | 'text'>('text');
  const [strokeColor, setStrokeColor] = useState('#2176FF');
  const [strokeWidth, setStrokeWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        setContext(ctx);

        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;

    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;

    e.preventDefault();

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x, y, pressure = 1;
    if ('touches' in e) {
      const touch = e.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
      if ('force' in touch && touch.force > 0) {
        pressure = touch.force;
      }
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      if ('pressure' in e && (e as any).pressure > 0) {
        pressure = (e as any).pressure;
      }
    }

    context.lineWidth = strokeWidth * pressure;
    context.strokeStyle = tool === 'pen' ? strokeColor : '#ffffff';
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    setIsDrawing(false);
    context.closePath();
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleSubmit = () => {
    if (!canvasRef.current) return;
    const imageData = canvasRef.current.toDataURL('image/png');
    onSubmit?.(imageData, textInput);
    setTextInput('');
    clearCanvas();
  };

  const downloadDrawing = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100"
      >
        <div className="flex border-b-2 border-gray-100">
          <button
            onClick={() => setActiveInput('text')}
            className={`flex-1 py-4 font-semibold transition-all stylus-target ${
              activeInput === 'text'
                ? 'bg-primary text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Текстовый ввод
          </button>
          <button
            onClick={() => setActiveInput('draw')}
            className={`flex-1 py-4 font-semibold transition-all stylus-target ${
              activeInput === 'draw'
                ? 'bg-primary text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Рисование
          </button>
        </div>

        <div className="p-6">
          {activeInput === 'text' ? (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={placeholder}
              className="w-full h-64 p-6 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 resize-none stylus-target transition-all"
              style={{ minHeight: '44px', fontSize: '18px' }}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3 items-center pb-4 border-b border-gray-200">
                <button
                  onClick={() => setTool('pen')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all stylus-target ${
                    tool === 'pen'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                  <span>Перо</span>
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all stylus-target ${
                    tool === 'eraser'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Eraser className="w-5 h-5" />
                  <span>Ластик</span>
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <label className="text-sm font-medium text-gray-700">Цвет:</label>
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer stylus-target"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Толщина:</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-24 stylus-target"
                  />
                  <span className="text-sm text-gray-600 min-w-[2rem]">{strokeWidth}px</span>
                </div>
              </div>

              <div className="relative">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-96 border-2 border-gray-200 rounded-2xl bg-white cursor-crosshair touch-none"
                  style={{
                    touchAction: 'none',
                  }}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm text-gray-600 pointer-events-none">
                  {tool === 'pen' ? 'Рисуйте пальцем или стилусом' : 'Стирайте ненужные линии'}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearCanvas}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors stylus-target"
                >
                  Очистить
                </button>
                <button
                  onClick={downloadDrawing}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 stylus-target"
                >
                  <Download className="w-5 h-5" />
                  Скачать
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 stylus-target"
            >
              <Send className="w-5 h-5" />
              Отправить
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
