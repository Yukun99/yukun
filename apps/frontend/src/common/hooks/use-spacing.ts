import useIsMobile from '@/common/hooks/use-is-mobile';

const useSpacing = () => {
  const isMobile = useIsMobile();
  return { margin: isMobile ? 8 : 16, padding: isMobile ? 18 : 24, smallRadius: 8 };
};

export default useSpacing;
