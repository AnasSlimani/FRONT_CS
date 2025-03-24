import Navbar from '@/components/layout/Navbar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}