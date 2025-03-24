import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Club Sportif
        </Link>
        <div className="flex space-x-4">
          <Link href="/activities" className="text-white hover:text-gray-200">
            Activités
          </Link>
          <Link href="/shop" className="text-white hover:text-gray-200">
            Boutique
          </Link>
          <Link href="/auth" className="text-white hover:text-gray-200">
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  );
}