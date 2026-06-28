import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPathLabel } from '@/app/routes';
import { useTranslation } from 'react-i18next';

const useDocumentTitle = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const baseTitle = t('common.name');
    const label = getPathLabel(pathname);
    document.title = label ? `${baseTitle} - ${label}` : baseTitle;
  }, [pathname, t]);
};

export default useDocumentTitle;