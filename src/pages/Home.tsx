import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Toast } from '@/components/common/Toast';
import { Button } from '@/components/common/Button';
import { PostCard } from '@/components/domain/PostCard';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
    <div className="flex flex-col gap-12">
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

      {/* --- 상호작용 컴포넌트들 (화면 어디서든 뜰 수 있게 배치) --- */}
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