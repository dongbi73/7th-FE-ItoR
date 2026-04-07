import { Outlet } from 'react-router-dom';
import { Header } from './Header'; 

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* 헤더 */}
      <Header />
      
      {/* 본문 */}
      <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-8">
        {/* Outlet */}
        <Outlet />
      </main>

      {/* Footer */}
    </div>
  );
};