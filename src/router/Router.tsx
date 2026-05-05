import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import FeedPage from '@/pages/FeedPage';
import PostDetailPage from '@/pages/PostDetailPage';
import RegisterPage from '@/pages/RegisterPage';
import WritePage from '@/pages/WritePage';
import LoginPage from '@/pages/auth/LoginPage';
import { KakaoCallback } from '@/pages/auth/KakaoCallback';
import { AuthModalProvider } from '@/context/AuthModalContext';
import ProfilePage from '@/pages/profile/ProfilePage';
import ProfileSettingPage from '@/pages/profile/ProfileSettingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthModalProvider>
        <Layout />
      </AuthModalProvider>
    ),
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'post/:postId', element: <PostDetailPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'write', element: <WritePage /> },
      { path: 'write/:postId', element: <WritePage /> },
      { path: '/auth/kakao/callback', element: <KakaoCallback /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'profile/me', element: <ProfilePage /> },
      { path: 'profile/me/settings', element: <ProfileSettingPage /> },
    ],
  },
]);
