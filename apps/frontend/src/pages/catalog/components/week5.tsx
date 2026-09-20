import { OPACITY } from '@/common/utils/palette';
import FloatingCircles from '@/common/components/effects/floating-circles';
import useIsMobile from '@/common/hooks/use-is-mobile';

const Week5Example = () => {
  const isMobile = useIsMobile();
  return <FloatingCircles count={isMobile ? 50 : 100} opacity={OPACITY[50]} />;
};

export default Week5Example;