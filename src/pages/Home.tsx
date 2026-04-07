import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Toast } from '@/components/common/Toast';
import { Button } from '@/components/common/Button';
import { PostCard } from '@/components/domain/PostCard';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  //  음악 상태 더미 (UI 테스트용)
  const [isPlaying, setIsPlaying] = useState(false);

  // 더미 데이터
  const dummyPosts = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    title: i === 0 
      ? "블로그 UI 레이아웃" 
      : `ItoR 개발 블로그 포스팅 시리즈 ${i + 1}`,
    excerpt: "공통 컴포넌트 설계/ Tailwind CSS를 활용한 반응형 그리드 시스템",
    thumbnail: `https://picsum.photos/seed/${i + 123}/600/338`,
    author: "김동비",
    date: "2026.03.31"
  }));

  const handleToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex flex-col gap-24 pb-20">

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-16 text-white shadow-2xl md:px-12 md:py-20">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block rounded-full bg-blue-500/50 px-3 py-1 text-sm font-medium text-blue-100">
            Leets 7th FE Project
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Idea to Reality, <br />
            실현되는 기록의 가치
          </h1>
          <p className="mt-6 text-lg text-blue-100/90 md:text-xl">
            2주차 미션을 통해 구축된 탄탄한 UI 파운데이션을 확인해보세요.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {/* 상호작용 테스트를 위해 버튼 클릭 시 모달이 뜨게 연결합니다 */}
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => setIsModalOpen(true)}>
              미션 결과 확인하기
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" onClick={handleToast}>
              토스트 알림 띄우기
            </Button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
      </section>

      {/* 음악 플레이바 섹션 */}
      <section className="relative -mt-10 z-20 px-4 md:px-10"> 
        <div className="mx-auto max-w-6xl rounded-full bg-white/70 p-3 shadow-xl backdrop-blur-md border border-white/20 flex items-center justify-between gap-8">    
        {/* 재생 컨트롤 & 곡 정보 */}
          <div className="flex items-center gap-3 pl-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all active:scale-95">
              {isPlaying ? "Ⅱ" : "▶"}
            </button>
            <div className="hidden sm:block leading-none">
              <p className="text-sm font-black text-gray-900 tracking-tight">Idea to Reality</p>
              <p className="mt-1 text-[11px] text-gray-500 font-medium tracking-tight">Leets 7th FE Track • Playing Now</p>
            </div>
          </div>

        {/* 가짜 프로그레스 바 */}
          <div className="flex-1 px-4 hidden md:flex items-center gap-4">
            <span className="text-[11px] font-bold text-gray-400">01:45</span>
            <div className="h-1 flex-1 rounded-full bg-gray-200/50 overflow-hidden">
              <div className="h-full w-1/3 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)" />
            </div>
            <span className="text-[11px] font-bold text-gray-400">03:20</span>
          </div>

          <div className="flex items-center gap-5 pr-4 border-l border-gray-200/50 pl-6">
        {/* 볼륨 아이콘 */}
            <div className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>

        {/* 날씨 정보 */}
            <div className="flex items-center gap-3 border-l border-gray-200/50 pl-5 min-w-fit">
              <div className="text-right hidden sm:block leading-none">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seoul</p>
                <p className="mt-1 text-base font-black text-gray-800">18°C</p>
              </div>
              <div className="text-yellow-500">
                <svg fill="currentColor" viewBox="0 0 20 20" className="h-7 w-7">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z" />
                </svg>
              </div>
            </div>
          </div>
        
        </div>  
      </section>

      {/* --- Post Section --- */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">최신 게시글</h2>
          </div>
        </div>

        <main className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {dummyPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </main>
      </section>

      {/* --- 하단 CTA --- */}
      <section className="rounded-2xl bg-gray-100 py-12 text-center mb-10">
        <h3 className="text-xl font-bold text-gray-800">뉴스레터 구독</h3>
        <div className="mt-6 flex justify-center gap-2 px-4">
          <input 
            type="email" 
            placeholder="이메일 주소를 입력하세요" 
            className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2"
          />
          <Button onClick={handleToast}>구독</Button>
        </div>
      </section>

      {/* --- 상호작용 컴포넌트들 --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="2주차 미션"
      >
        <p>공통 컴포넌트 6종과 반응형 레이아웃 구현 </p>
      </Modal>

      <Toast message="성공적으로 알림이 전송되었습니다!" isVisible={showToast} />
    </div>
  );
};

export default Home;