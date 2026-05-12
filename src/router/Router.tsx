import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AuthModalProvider } from '@/context/AuthModalContext';

const FeedPage = lazy(() => import('@/pages/FeedPage'));
const PostDetailPage = lazy(() => import('@/pages/PostDetailPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const WritePage = lazy(() => import('@/pages/WritePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const KakaoCallback = lazy(() =>
  import('@/pages/auth/KakaoCallback').then((module) => ({ default: module.KakaoCallback })),
);
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const ProfileSettingPage = lazy(() => import('@/pages/profile/ProfileSettingPage'));

const PageFallback = () => (
  <div
    role="status"
    aria-live="polite"
    className="mx-auto flex min-h-[240px] w-full max-w-172 items-center justify-center px-4 text-[14px] text-gray-56"
  >
    페이지를 불러오고 있습니다.
  </div>
);

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<PageFallback />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthModalProvider>
        <Layout />
      </AuthModalProvider>
    ),
    children: [
      { index: true, element: withSuspense(<FeedPage />) },
      { path: 'post/:postId', element: withSuspense(<PostDetailPage />) },
      { path: 'register', element: withSuspense(<RegisterPage />) },
      { path: 'write', element: withSuspense(<WritePage />) },
      { path: 'write/:postId', element: withSuspense(<WritePage />) },
      { path: '/auth/kakao/callback', element: withSuspense(<KakaoCallback />) },
      { path: 'login', element: withSuspense(<LoginPage />) },
      { path: 'profile/me', element: withSuspense(<ProfilePage />) },
      { path: 'profile/me/settings', element: withSuspense(<ProfileSettingPage />) },
    ],
  },
]);
