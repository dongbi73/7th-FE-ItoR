import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Blank } from '@/components/common/Blank';
import type { UserData } from '@/api/user';
import { cn } from '@/utils/cn';

interface ProfileCardProps {
  user?: UserData;
  nickname?: string;
  email?: string;
  isLoggedIn?: boolean;
  onAvatarClick?: () => void;
  onMyGitlog?: () => void;
  onWriteGitlog?: () => void;
  onSetting?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const ProfileCard = ({
  user,
  nickname,
  isLoggedIn = false,
  onMyGitlog,
  onWriteGitlog,
  onSetting,
  onLogout,
  className,
}: ProfileCardProps) => {
  const defaultDescription = 'You can make anything by writing';
  const displayNickname = user?.nickname || nickname;
  const displayIntroduction = user?.introduction;
  const nicknameFallback = displayNickname ? displayNickname.charAt(0).toUpperCase() : 'G';

  return (
    <section className={cn('flex flex-col w-60 h-full bg-gray-96 ', className)}>
      <div className="w-full py-6">

        <div className="px-4">
          <Avatar size={64} src={user?.profilePicture} fallback={isLoggedIn ? nicknameFallback : 'G'} />
          
        </div>


        <div className="flex flex-col px-5 py-3 gap-3">
          {isLoggedIn && displayNickname ? (
            <>
              <h3 className="wrap-break-word text-[32px] font-medium leading-tight text-black">{displayNickname}</h3>
              <p className="wrap-break-word text-[14px] leading-5 text-gray-20">
                {displayIntroduction || '한 줄 소개가 없습니다.'}
              </p>
            </>
          ) : (
            <p className="max-w-33 text-[12px] leading-5 text-gray-37">{defaultDescription}</p>
          )}
        </div>

      

          <Blank size="sm" />
      
      <div className="flex px-4 gap-2.5">
        {isLoggedIn ? (
          <>
            <Button variant="primaryOutline" onClick={onMyGitlog}
              className="h-9.5 px-3 py-2">
              나의 깃로그
            </Button>
            <Button variant="primaryOutline" onClick={onWriteGitlog}
              className="h-9.5 px-3 py-2">
              깃로그 쓰기
            </Button>
          </>
        ) : (
          <Button variant="primaryOutline" onClick={onWriteGitlog}
            className="h-9.5 px-3 py-2">
            깃로그 시작하기
          </Button>
        )}
      </div>

      </div>


      <section className=" mt-auto py-6">
        <Blank size="sm"/>
        {isLoggedIn && (
        <div className=" flex gap-2.5 px-4">
          <Button variant="grayOutline" className="w-24.75 h-9.5  px-3 py-2" onClick={onSetting}>
            설정
          </Button>
          <Button variant="grayOutline" className=" w-24.75 h-9.5 px-3 py-2" onClick={onLogout}>
            로그아웃
          </Button>
        </div>
      )}
      </section>
      
    </section>
  );
};
