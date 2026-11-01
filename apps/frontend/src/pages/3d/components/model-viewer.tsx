import {
  BUTTON_SIZE,
  ICON_GRADIENT_ID,
  ICON_SCALE,
  IconGradient,
} from '@/common/components/buttons/round-icon-button';
import ColourMapping from '@/pages/3d/components/colour-mapping';
import { type Extent, placeCamera } from '@/pages/3d/utils/camera';
import { disposeObject } from '@/pages/3d/utils/dispose';
import { PAGE } from '@/pages/3d/utils/page';
import { AMBIENT, DIRECTIONAL } from '@/pages/3d/utils/scene';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Center, type OnCenterCallbackProps, OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mesh, type Object3D, PerspectiveCamera, Vector2, type Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type ModelViewerProps = {
  url?: string;
  objects?: Object3D[];
  loading?: boolean;
  plate?: number;
  onPlateChange?: (plate: number) => void;
  recolour?: { name: string; sourceUrl?: string };
};
const SPINNER_DELAY = 500;

type Controls = { target: Vector3; update: () => void };

const flatten = (object: Object3D) =>
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    [child.material].flat().forEach((material) => {
      material.flatShading = true;
      material.needsUpdate = true;
    });
  });

// orbit target stays at the origin (the plate centre under the model); panning only shifts the view
const Rig = ({ plate, extent }: { plate: number; extent: Extent }) => {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as Controls | null;
  const gl = useThree((state) => state.gl);
  const { width, height } = useThree((state) => state.size);
  const pan = useRef(new Vector2());

  useLayoutEffect(() => {
    if (!extent.radius || !(camera instanceof PerspectiveCamera)) return;
    pan.current.copy(placeCamera(camera, extent, width, height));
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [plate, extent, camera, controls, width, height]);

  useEffect(() => {
    const element = gl.domElement;
    const move = (event: PointerEvent) => {
      if (!(event.buttons & 2) || !(camera instanceof PerspectiveCamera)) return;
      pan.current.x -= event.movementX;
      pan.current.y -= event.movementY;
      camera.setViewOffset(width, height, pan.current.x, pan.current.y, width, height);
    };
    element.addEventListener('pointermove', move);
    return () => element.removeEventListener('pointermove', move);
  }, [gl, camera, width, height]);

  return null;
};

// extent state lives inside the canvas so the camera is placed in the same commit as the model
const Stage = ({ object, plate }: { object: Object3D; plate: number }) => {
  const [extent, setExtent] = useState<Extent>({ radius: 0, height: 0 });
  const onCentered = useCallback(
    ({ boundingSphere, height }: OnCenterCallbackProps) =>
      setExtent({ radius: boundingSphere.radius, height }),
    [],
  );

  return (
    <>
      <Center key={object.uuid} top onCentered={onCentered}>
        <primitive object={object} />
      </Center>
      <Rig plate={plate} extent={extent} />
    </>
  );
};

const useScenes = (url: string | undefined) => {
  const [scenes, setScenes] = useState<Object3D[]>([]);
  const [loading, setLoading] = useState(!!url);
  useEffect(() => {
    if (!url) return setLoading(false);
    let active = true;
    setLoading(true);
    let owned: Object3D[] = [];
    new GLTFLoader()
      .loadAsync(url)
      .then((gltf) => {
        if (!active) return gltf.scenes.forEach(disposeObject);
        gltf.scenes.forEach(flatten);
        owned = gltf.scenes;
        setScenes(owned);
      })
      .catch(() => undefined)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
      owned.forEach(disposeObject);
      setScenes([]);
    };
  }, [url]);
  return { scenes, loading };
};

const ModelViewer = ({
  url,
  objects,
  loading = false,
  plate: plateProp,
  onPlateChange,
  recolour,
}: ModelViewerProps) => {
  const { t } = useTranslation(PAGE);
  const { scenes: loaded, loading: scenesLoading } = useScenes(url);
  const [innerPlate, setInnerPlate] = useState(0);
  const plate = plateProp ?? innerPlate;
  const setPlate = (value: number) => {
    if (plateProp === undefined) setInnerPlate(value);
    onPlateChange?.(value);
  };
  const plates = objects ?? loaded;
  const current = plates[Math.min(plate, plates.length - 1)];
  const busy = (objects ? loading : scenesLoading) && !current;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!busy) return setShow(false);
    const timer = setTimeout(() => setShow(true), SPINNER_DELAY);
    return () => clearTimeout(timer);
  }, [busy]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        flat
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
      >
        <ambientLight intensity={AMBIENT} />
        {DIRECTIONAL.map(({ position, intensity }) => (
          <directionalLight key={position.join()} position={position} intensity={intensity} />
        ))}
        {current && <Stage object={current} plate={plate} />}
        <OrbitControls
          makeDefault
          enableDamping
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
      {show && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <IconGradient />
          <CircularProgress
            size={BUTTON_SIZE * ICON_SCALE}
            sx={{ [`& .${circularProgressClasses.circle}`]: { stroke: `url(#${ICON_GRADIENT_ID})` } }}
          />
        </Box>
      )}
      {recolour && plates.length > 0 && (
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <ColourMapping plates={plates} name={recolour.name} sourceUrl={recolour.sourceUrl} />
        </Box>
      )}
      {plates.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            px: 1,
          }}
        >
          <IconButton
            aria-label={t('previousPlate')}
            disabled={plate === 0}
            onClick={() => setPlate(plate - 1)}
            sx={{ pointerEvents: 'auto' }}
          >
            <ChevronLeft />
          </IconButton>
          <Typography
            variant='caption'
            sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' }}
          >
            {t('plate', { number: plate + 1, total: plates.length })}
          </Typography>
          <IconButton
            aria-label={t('nextPlate')}
            disabled={plate >= plates.length - 1}
            onClick={() => setPlate(plate + 1)}
            sx={{ pointerEvents: 'auto' }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ModelViewer;
