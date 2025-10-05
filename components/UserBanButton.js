'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export default function UserBanButton({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserState, setCurrentUserState] = useState(user);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { authenticatedFetch } = useAuth();

  const toggleBanStatus = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setShowSuccess(false);
    
    try {
      console.log(`Attempting to toggle ban status for user: ${user._id}`);
      
      await authenticatedFetch(`/api/users?userId=${user._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'toggleBan' }),
      });
      
      // Show success message
      console.log('Ban toggle successful');
      setShowSuccess(true);
      
      // Update user state locally first
      setCurrentUserState({
        ...currentUserState,
        isBanned: !currentUserState.isBanned
      });
      
      // Use a more gentle approach to refresh the data
      setTimeout(() => {
        try {
          // Use router.refresh() to refresh the data without a full page reload
          router.refresh();
        } catch (err) {
          console.error('Error refreshing page:', err);
        }
      }, 1500);
    } catch (error) {
      console.error('Error toggling ban status:', error);
      setError(error.message || 'İşlem sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-end">
      <button
        onClick={toggleBanStatus}
        disabled={isLoading}
        className={`px-3 py-1 rounded ${
          currentUserState.isBanned
            ? 'bg-green-50 text-green-600 hover:bg-green-100'
            : 'bg-red-50 text-red-600 hover:bg-red-100'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading
          ? 'İşleniyor...'
          : currentUserState.isBanned
          ? 'Engeli Kaldır'
          : 'Engelle'}
      </button>
      
      {error && (
        <div className="mt-2 text-xs text-red-600">{error}</div>
      )}
      
      {showSuccess && (
        <div className="mt-2 text-xs text-green-600">
          {currentUserState.isBanned 
            ? 'Kullanıcı başarıyla engellendi' 
            : 'Kullanıcı engeli başarıyla kaldırıldı'}
        </div>
      )}
    </div>
  );
}
