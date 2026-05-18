import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router/Router';
import { useAuthStore } from '@/store/useAuthStore';

function App() {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    window.addEventListener('auth:expired', logout);

    return () => {
      window.removeEventListener('auth:expired', logout);
    };
  }, [logout]);

  return <RouterProvider router={router} />;
}

export default App;
