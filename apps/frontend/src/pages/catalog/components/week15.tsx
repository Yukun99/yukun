import benchy from '@/assets/catalog/benchy.3mf?url';
import useIsMobile from '@/common/hooks/use-is-mobile';
import ModelViewer from '@/pages/3d/components/model-viewer';
import { disposeObject } from '@/pages/3d/utils/dispose';
import { parseThreeMf } from '@/pages/3d/utils/three-mf';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import type { Group } from 'three';

const HEIGHT = { desktop: 480, mobile: 260 };

const usePlates = (url: string) => {
  const [plates, setPlates] = useState<Group[]>([]);
  useEffect(() => {
    let active = true;
    let owned: Group[] = [];
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then(parseThreeMf)
      .then((parsed) => {
        if (!active) return parsed.forEach(disposeObject);
        owned = parsed;
        setPlates(owned);
      })
      .catch(() => undefined);
    return () => {
      active = false;
      owned.forEach(disposeObject);
      setPlates([]);
    };
  }, [url]);
  return plates;
};

const Week15Example = () => {
  const isMobile = useIsMobile();
  const plates = usePlates(benchy);

  return (
    <Box sx={{ width: '100%', height: isMobile ? HEIGHT.mobile : HEIGHT.desktop }}>
      <ModelViewer objects={plates} />
    </Box>
  );
};

export default Week15Example;
