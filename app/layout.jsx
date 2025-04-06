"use client"
import { Geist, Geist_Mono } from "next/font/google"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import "./globals.css"
import { usePathname } from 'next/navigation'



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})



export default function RootLayout({ children }) {
  
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/dashboardadmin');
  
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <div className="flex flex-col min-h-screen">
          {!isAdmin && <Navbar />}
          <main className="flex-grow pt-16">{children}</main>
          {!isAdmin && <Footer />}
        </div>
      </body>
    </html>
  )
}

