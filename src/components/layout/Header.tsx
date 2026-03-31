import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { useState } from 'react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-8">
        
        {/* 로고 */}
        <Link to="/" className="text-xl font-bold tracking-tighter text-blue-600 transition-colors hover:text-blue-700">
          Blog
        </Link>

        {/* 데스크탑 메뉴 (md 이상에서만 노출) */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600">홈</Link>
          <Link to="/write" className="text-sm font-medium text-gray-600 hover:text-blue-600">글쓰기</Link>
          
          <div className="ml-4 flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">로그인</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">회원가입</Button>
            </Link>
          </div>
        </nav>

        {/* 모바일 메뉴 버튼 (md 미만에서 노출) */}
        <button 
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 모바일 드롭다운 메뉴 (애니메이션 효과) */}
      <div className={cn(
        "absolute left-0 top-16 w-full border-b bg-white p-4 transition-all duration-300 md:hidden",
        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
      )}>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="text-base font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>홈</Link>
          <Link to="/write" className="text-base font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>글쓰기</Link>
          <hr />
          <div className="flex flex-col gap-2">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full">로그인</Button>
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full">회원가입</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};