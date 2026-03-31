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
          {/* 검색바 */}
          <div className="relative group mr-2">
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-40 lg:w-48 rounded-full bg-gray-100 border-none py-1.5 pl-9 pr-4 text-xs transition-all duration-300 focus:w-64 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none"
            />
            <svg 
              className="absolute left-3 top-2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>


          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">홈</Link>
          <Link to="/write" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">글쓰기</Link>
          
          <div className="ml-4 flex items-center gap-2 border-l pl-6 border-gray-100">
            <Link to="/login">
              <Button variant="outline" size="sm" className="rounded-full px-5 border-gray-200">로그인</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="rounded-full px-5">회원가입</Button>
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
        {/* 검색바 */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full rounded-xl bg-gray-100 border-none py-3 pl-11 pr-4 text-sm outline-none"
          />
          <svg className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <nav className="flex flex-col gap-5">
          <Link to="/" className="text-ld font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>홈</Link>
          <Link to="/write" className="text-lg font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>글쓰기</Link>
          <hr className="border-gray-100" />
          <div className="flex flex-col gap-3">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full rounded-xl py-6">로그인</Button>
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full rounded-xl py-6">회원가입</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};