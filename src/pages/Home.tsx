import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { TextField } from '@/components/common/TextField';
import { Toast } from '@/components/common/Toast/Toast';
import { Avatar } from '@/components/common/Avatar';
import { Modal } from '@/components/common/Modal/Modal';
import { Dropdown } from '@/components/common/Dropdown/Dropdown';
import { Pagination } from '@/components/common/Pagination';

import { ErrorOutlineIcon, DoneIcon,MoreVertIcon,DeleteForeverIcon,CreateIcon,SettingsIcon } from '@/assets/icons';

const Home = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ id: string; msg: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ id: Date.now().toString(), msg: message, type });
  };

  const TOTAL_ITEMS = 100; 
  const ITEMS_PER_PAGE = 10; 
  const totalPages = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

  const onDelete = () => {
    showToast('success', '성공적으로 삭제되었습니다.');
    setIsModalOpen(false); // 삭제 후 모달 닫기
  };

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold text-slate-900">Component Showcase</h1>

      {/* 1. Avatar & Button Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Avatars</h3>
          <div className="flex items-end gap-4">
            <Avatar size={90} />
            <Avatar size={64} />
            <Avatar size={40} />
            <Avatar size={20} />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="blackFilled">Black Filled</Button>
            <Button variant="primaryOutline" icon={<CreateIcon className="w-full h-full" />}>
              Icon Button
            </Button>
          </div>
        </div>
      </section>

      {/* 2. TextField & Dropdown Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">TextField</h3>
          <TextField 
            label="이름" 
            placeholder="이름을 입력하세요" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        {/* ✅ 여기에 드롭다운 섹션 추가 */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Dropdown</h3>
          <div className="relative inline-block">
            {/* 트리거 버튼 (MoreVertIcon 사용) */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <MoreVertIcon className="w-6 h-6 text-slate-600" />
            </button>

            {/* 우리가 정의한 구조의 Dropdown */}
            <Dropdown 
              isOpen={isDropdownOpen} 
              onClose={() => setIsDropdownOpen(false)}
              isIconOnly={true}
            >
              <Dropdown.Item 
                icon={SettingsIcon}
                onClick={() => { showToast('success', '설정 클릭!'); setIsDropdownOpen(false); }}
              >
                수정하기
              </Dropdown.Item>
              <Dropdown.Item 
                icon={DeleteForeverIcon}
                className="text-red-500"
                onClick={() => { setIsModalOpen(true); setIsDropdownOpen(false); }}
              >
                삭제하기
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </section>

      {/* 3. Pagination Section */}
      <section className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-6 self-start">Pagination</h3>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)}/>
      </section>

      {/* 4. Modal & Toast Controls */}
      <div className="flex gap-4 justify-center">
        <Button variant="blackFilled" onClick={() => setIsModalOpen(true)}>모달 열기</Button>
        <Button variant="primaryOutline" onClick={() => showToast('error', '경고 토스트')}>에러 토스트</Button>
      </div>

      {/* --- 포털용 컴포넌트 (Modal, Toast) --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>테스트 모달</Modal.Title>
        </Modal.Header>
        
        <Modal.Description>
          Layout 구조에서 잘 작동하나요? 합성 컴포넌트 방식으로 조립되었습니다.
        </Modal.Description>
        
        <Modal.Footer>
        <div className="flex justify-end gap-2 w-full mt-4">
          <Button 
            variant="ghost" 
            onClick={() => setIsModalOpen(false)}
            className="text-slate-500 hover:bg-slate-100 px-4"
          >취소
          </Button>
          <Button 
            onClick={onDelete}
            className="bg-[#FF4D4D] text-white hover:bg-[#FF3333] px-6"
          >
          삭제하기
          </Button>
          </div>
        </Modal.Footer>
      </Modal>


      {/* Toast 렌더링 영역 */}
      {toast && (
        <Toast
          id={toast.id}
          type={toast.type}
          message={toast.msg}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );

};

export default Home;