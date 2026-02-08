import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'RAS Beacon - Faro de Productividad',
  description: 'Faro digital para la iniciativa de robótica RAS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white min-h-screen">
        <Providers>
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #FFD700',
              },
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  )
}
