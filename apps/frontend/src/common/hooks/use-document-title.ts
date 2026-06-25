import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPathLabel } from '@/app/routes';

const BASE_TITLE = 'Yukun';

const useDocumentTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const label = getPathLabel(pathname);
    document.title = label ? `${BASE_TITLE} - ${label}` : BASE_TITLE;
  }, [pathname]);
};

export default useDocumentTitle;