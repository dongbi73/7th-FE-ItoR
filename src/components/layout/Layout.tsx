import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 헤더 */}
      <Header />
      {/* 본문 */}
      <main className="pt-18">
        <Outlet />
      </main>
    </div>
  );
};
