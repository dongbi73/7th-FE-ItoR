import { lazy } from 'react';

export const FeedPage = lazy(() => import('@/pages/FeedPage'));
export const PostDetailPage = lazy(() => import('@/pages/PostDetailPage'));
export const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
export const WritePage = lazy(() => import('@/pages/WritePage'));
export const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
export const KakaoCallback = lazy(() =>
  import('@/pages/auth/KakaoCallback').then((module) => ({ default: module.KakaoCallback })),
);
export const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
export const ProfileSettingPage = lazy(() => import('@/pages/profile/ProfileSettingPage'));
