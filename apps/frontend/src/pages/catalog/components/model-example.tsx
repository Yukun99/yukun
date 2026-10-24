import useIsMobile from '@/common/hooks/use-is-mobile';
import ModelViewer from '@/pages/3d/components/model-viewer';
import usePlates from '@/pages/catalog/use-plates';
import Box from '@mui/material/Box';

const HEIGHT = { desktop: 480, mobile: 260 };

type ModelExampleProps = { url: string };

const ModelExample = ({ url }: ModelExampleProps) => {
  const isMobile = useIsMobile();
  const { plates, loading } = usePlates(url);

  return (
    <Box sx={{ width: '100%', height: isMobile ? HEIGHT.mobile : HEIGHT.desktop }}>
      <ModelViewer objects={plates} loading={loading} />
    </Box>
  );
};

export default ModelExample;
