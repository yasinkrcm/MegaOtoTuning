'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import SearchParamsProvider from '../../components/SearchParamsProvider';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Yükleniyor...</div>}>
      <SearchParamsProvider>
        {({ searchParams }) => <LoginForm searchParams={searchParams} />}
      </SearchParamsProvider>
    </Suspense>
  );
}

function LoginForm({ searchParams }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, login } = useAuth();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'CredentialsSignin':
          setError('E-posta veya şifre hatalı.');
          break;
        case 'SessionRequired':
          setError('Bu sayfaya erişmek için giriş yapmalısınız.');
          break;
        default:
          setError('Giriş yapılamadı. Lütfen tekrar deneyin.');
          break;
      }
    }
  }, [searchParams]);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Lütfen e-posta ve şifre giriniz.');
      setIsLoading(false);
      return;
    }

    try {
  
      
      await login(email, password);
      

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error('Giriş hatası:', error);
      setError('Giriş sırasında bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-pink-700 text-center">Giriş Yap</h1>
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Gizle' : 'Göster'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              disabled={isLoading}
            >
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-center text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{' '}
              <Link href="/register" className="text-pink-600 hover:text-pink-800">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
