import i18n from 'i18next';

export function getPathLabel(path: string): string {
  return i18n.t(`routeNames.${path}`);
}
