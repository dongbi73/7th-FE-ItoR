import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Blank } from '@/components/common/Blank';
import { SettingsIcon } from '@/assets/icons';
import FeedPage from '@/pages/FeedPage';
import { useMeQuery } from '@/hooks/queries/useUserQueries';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data: user } = useMeQuery();

  return (
    <div>
      <section className="bg-gray-96">
        <div className="mx-auto max-w-172">
          <Blank size="lg"/>
          
          <div className="px-4 py-3">
            <Avatar size={64} src={user?.profilePicture} fallback={user?.nickname?.charAt(0) || 'G'} />
          </div>

          <div className="flex flex-col gap-3 px-4 py-3">
            <h2 className="text-[32px] font-medium text-black">
              {user?.nickname || '%{닉네임}'}
            </h2>
            <p className="text-[14px] font-light text-gray-20">
              {user?.introduction || '%{한 줄 소개}'}
            </p>
          </div>
          
          <div className="px-4 py-3">
            <Button  variant="grayOutline" icon={<SettingsIcon />} iconClassName="w-[14px] h-[14px]" 
            className="px-2 pt-0.5 pb-1 text-[12px] border border-gray-90 rounded-none"
            onClick={() => navigate('/profile/me/settings')}
            >
              내 프로필 설정
            </Button>
          </div>
          
          <Blank size ="sm"/>

        </div>
      </section>

      <FeedPage />
    </div>
  );
};

export default ProfilePage;
