import type { ReactNode } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import Chatbot from '@/components/chatbot';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-64">
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
      <Chatbot />
    </div>
  );
}
