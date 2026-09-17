import "./globals.css";

export const metadata = {
  title: "Jaipur Market",
  description: "Oxidized Jewellery, Kurtis, Printed Apparel & Fabric — online store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900">
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-semibold tracking-tight">
              Jaipur Market
            </a>
            <nav className="flex gap-4 text-sm">
              <a href="/cart">Cart</a>
              <a href="/orders">Orders</a>
              <a href="/login">Login</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
