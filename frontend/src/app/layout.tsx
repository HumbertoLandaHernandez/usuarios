import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Proyecto',
  description: 'Next + Nest + PostgreSQL + JWT',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
