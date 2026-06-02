import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AuthModalProvider } from '@/context/AuthModalContext';
import { PageFallback } from '@/router/PageFallback';
import {
  FeedPage,
  KakaoCallback,
  LoginPage,
  PostDetailPage,
  ProfilePage,
  ProfileSettingPage,
  RegisterPage,
  WritePage,
} from '@/router/lazyPages';

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
