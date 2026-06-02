export const redirectTo = (url: string) => {
  window.location.assign(url);
};

export const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    redirectTo('/login');
  }
};
