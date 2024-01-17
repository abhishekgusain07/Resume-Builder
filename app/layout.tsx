"use client";
import { Inter } from 'next/font/google'
import './globals.css'
import { TopNavBar } from './components/TopNavbar'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNavBar />
        {children}
        </body>
    </html>
  )
}
