import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navigation from "../components/layout/Navigation";
import { CartProvider } from "../components/cart/CartProvider";
import { getCart } from "../lib/actions/cart-actions";

//important
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Berryfy - Your Shopping Destination",
  description: "Shop the best products with our amazing shopping cart experience",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = await getCart();
  const initialItemCount =
    cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const initialTotal = cart?.total || 0;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CartProvider initialItemCount={initialItemCount} initialTotal={initialTotal}>
          <Navigation />
          <main className="min-vh-100">
            {children}
            <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          </main>
          <footer className="bg-dark text-light py-4 mt-5">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <h5>Berryfy</h5>
                  <p className="text-white-50">Your trusted shopping destination with server-side cart management.</p>
                </div>
                <div className="col-md-6 text-md-end">
                  <p className="text-white-50 mb-0">
                    &copy; 2026 Berryfy. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
