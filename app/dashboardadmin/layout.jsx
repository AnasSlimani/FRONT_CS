import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Admin Dashboard - Club Sportif",
  description: "Admin dashboard for Club Sportif management",
}

// This is the critical part - we're creating a completely separate layout
export default function AdminLayout({ children }) {
  console.log("Admin Layout Loaded");
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* You can add admin-specific navigation here if needed */}
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  )
}

