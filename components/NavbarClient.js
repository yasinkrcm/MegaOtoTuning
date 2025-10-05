'use client';

import Link from 'next/link';
import { useAuth } from './AuthContext';
import CartButton from './CartButton';
import OrdersButton from './OrdersButton';


export default function NavbarClient({ user }) {
  const { logout } = useAuth();
  
  const handleSignOut = async (e) => {
    e.preventDefault();
    await logout();
  };
  
  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center">
      <Link href="/cart" className="mr-2">
        <CartButton />
      </Link>
      
      {user ? (
        <>
          <Link 
            href="/user/orders" 
            className="text-white-500 hover:text-pink-700 px-3 py-2 text-sm font-medium relative"
          >
            <OrdersButton />
          </Link>
          <Link 
            href="/user/profile" 
            className="text-white-500 hover:text-pink-700 px-3 py-2 text-sm font-medium"
          >
            Profilim
          </Link>
          {user?.role === 'admin' && (
            <Link 
              href="/admin" 
              className="text-white-500 hover:text-pink-700 px-3 py-2 text-sm font-medium"
            >
              Admin Panel
            </Link>
          )}
          <button 
            onClick={handleSignOut}
            className="ml-4 bg-pink-100 text-pink-700 hover:bg-pink-200 px-3 py-2 rounded-md text-sm font-medium"
          >
            Çıkış Yap
          </button>
        </>
      ) : (
        <>
          <Link 
            href="/login" 
            className="text-white-500 hover:text-white-700 px-3 py-2 text-sm font-medium"
          >
            Giriş Yap
          </Link>
          <Link 
            href="/register" 
            className="ml-4 bg-pink-100 text-pink-700 hover:bg-pink-200 px-3 py-2 rounded-md text-sm font-medium"
          >
            Kayıt Ol
          </Link>
        </>
      )}
    </div>
  );
}
