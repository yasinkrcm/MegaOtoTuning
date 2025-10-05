import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import MobileCartButton from "../components/MobileCartButton";
import { AuthProvider } from "../components/AuthContext";
import { CartProvider } from "../components/CartContext";
import PageLoader from "../components/PageLoader";
import PageTransition from '../components/PageTransition';
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "Mega Oto Tuning",
  description: "Aracınızı Oto Tuning ile performans ve tarz açısından geliştirin. Motor ve görsel modifikasyonlarla fark yaratın.",
  icons: {
    icon: "/logo.jpg",
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className="bg-dark min-h-screen font-sans">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <PageLoader />
            <PageTransition>
              <main className="pt-4 pb-8 px-2 sm:px-0">
                {children}
              </main>
            </PageTransition>
            <Footer />
            <WhatsAppButton />
            <MobileCartButton />
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
