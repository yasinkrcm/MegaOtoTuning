'use client';
import Toast from '../../components/Toast';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const [toastMsg, setToastMsg] = useState('');
  const [lastLogId, setLastLogId] = useState(null);

  useEffect(() => {
    async function fetchLatestLog() {
      try {
        const res = await fetch('/api/logs');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.length > 0 && data[0]._id !== lastLogId) {
          if (lastLogId !== null) setToastMsg(data[0].message.replace(/\([^)]+\)/g, ''));
          setLastLogId(data[0]._id);
        }
      } catch {}
    }
    fetchLatestLog();
    const interval = setInterval(fetchLatestLog, 2000);
    return () => clearInterval(interval);
  }, [lastLogId]);

  return (
    <>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
      {children}
    </>
  );
} 