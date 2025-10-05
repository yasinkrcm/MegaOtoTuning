'use client';

import { useState } from 'react';
import { useAuth } from '../../../components/AuthContext';
import PayTRToggle from './PayTRToggle';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { authenticatedFetch } = useAuth();
  const [setupLoading, setSetupLoading] = useState(false);
  const [debugLoading, setDebugLoading] = useState(false);
  const [debugResult, setDebugResult] = useState(null);
  const [testCallbackLoading, setTestCallbackLoading] = useState(false);
  const [testCallbackResult, setTestCallbackResult] = useState(null);
  const [hashDebugLoading, setHashDebugLoading] = useState(false);
  const [hashDebugResult, setHashDebugResult] = useState(null);

  const handlePayTRSetup = async () => {
    try {
      setSetupLoading(true);
      const response = await authenticatedFetch('/api/paytr/setup', {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'PayTR kurulum işlemi başarısız');
      }

      toast.success(`PayTR kurulum başarılı! Bildirim URL: ${data.notification_url}`);
    } catch (error) {
      toast.error(`PayTR kurulum hatası: ${error.message}`);
    } finally {
      setSetupLoading(false);
    }
  };

 
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sistem Ayarları</h1>
      
      <div className="grid gap-6">
        {/* PayTR Ayarları */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">PayTR Ödeme Sistemi</h2>
          
          <div className="space-y-4">
            <PayTRToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
