'use client';

import { useEffect } from 'react';

let globalAudio;
if (typeof window !== 'undefined') {
  globalAudio = globalAudio || new Audio('/notification.mp3');
}

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    // Bildirim sesi çal
    if (globalAudio) {
      globalAudio.currentTime = 0;
      globalAudio.play().catch(() => {});
    }
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast flex items-center gap-3 shadow-lg z-[9999]">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/30 text-white text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
      </span>
      <span>{message}</span>
    </div>
  );
} 