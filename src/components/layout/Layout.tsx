import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ToastRenderer } from '@/components/common/Toast';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 헤더 */}
      <Header />
      <ToastRenderer />

      {/* 본문 */}
      <main className="pt-18">
        <Outlet />
      </main>
    </div>
  );
};
