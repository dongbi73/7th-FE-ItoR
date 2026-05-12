import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router/Router';
import { useAuthStore } from '@/store/useAuthStore';

function DevAuthPanel() {
  const { isLoggedIn, user, mockLogin, logout } = useAuthStore();

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed right-4 bottom-4 z-9999 flex gap-2 rounded-md bg-black px-3 py-2 text-white">
      <span>{isLoggedIn ? user?.nickname : 'guest'}</span>
      <button onClick={mockLogin}>mock login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function App() {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    window.addEventListener('auth:expired', logout);

    return () => {
      window.removeEventListener('auth:expired', logout);
    };
  }, [logout]);

  return (
    <>
      <RouterProvider router={router} />
      <DevAuthPanel />
    </>
  );
}

export default App;
