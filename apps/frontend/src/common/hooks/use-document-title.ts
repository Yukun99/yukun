import { getPathLabel } from '@/app/routes';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

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