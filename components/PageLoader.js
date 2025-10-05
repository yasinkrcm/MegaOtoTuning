"use client";
import { useState, useEffect } from 'react';

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);
    window.addEventListener('routeChangeStart', handleStart);
    window.addEventListener('routeChangeComplete', handleStop);
    window.addEventListener('routeChangeError', handleStop);
    return () => {
      window.removeEventListener('routeChangeStart', handleStart);
      window.removeEventListener('routeChangeComplete', handleStop);
      window.removeEventListener('routeChangeError', handleStop);
    };
  }, []);
  return loading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-pink-500 border-b-4 border-gray-200"></div>
    </div>
  ) : null;
} 