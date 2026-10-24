import { disposeObject } from '@/pages/3d/utils/dispose';
import { PAGE } from '@/pages/3d/utils/page';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Center, type OnCenterCallbackProps, OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mesh, type Object3D, PerspectiveCamera, Vector2, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type ModelViewerProps = { url?: string; objects?: Object3D[] };
type Controls = { target: Vector3; update: () => void };
type Extent = { radius: number; height: number };

const VIEW = new Vector3(0.6, 0.4, 1).normalize();
const MARGIN = 1.1;

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
    const reach = extent.radius + extent.height / 2;
    const vertical = (camera.fov * Math.PI) / 180;
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * (width / height));
    const distance = (reach * MARGIN) / Math.sin(Math.min(vertical, horizontal) / 2);
    camera.position.copy(VIEW).multiplyScalar(distance);
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.lookAt(0, 0, 0);
    camera.clearViewOffset();
    camera.updateMatrixWorld();
    const middle = new Vector3(0, extent.height / 2, 0).project(camera);
    pan.current.set(0, (-middle.y * height) / 2);
    camera.setViewOffset(width, height, pan.current.x, pan.current.y, width, height);
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

const useScenes = (url: string | undefined) => {
  const [scenes, setScenes] = useState<Object3D[]>([]);
  useEffect(() => {
    if (!url) return;
    let active = true;
    let owned: Object3D[] = [];
    new GLTFLoader()
      .loadAsync(url)
      .then((gltf) => {
        if (!active) return gltf.scenes.forEach(disposeObject);
        gltf.scenes.forEach(flatten);
        owned = gltf.scenes;
        setScenes(owned);
      })
      .catch(() => undefined);
    return () => {
      active = false;
      owned.forEach(disposeObject);
      setScenes([]);
    };
  }, [url]);
  return scenes;
};

const ModelViewer = ({ url, objects }: ModelViewerProps) => {
  const { t } = useTranslation(PAGE);
  const loaded = useScenes(url);
  const [plate, setPlate] = useState(0);
  const [extent, setExtent] = useState<Extent>({ radius: 0, height: 0 });
  const plates = objects ?? loaded;
  const current = plates[Math.min(plate, plates.length - 1)];
  const onCentered = useCallback(
    ({ boundingSphere, height }: OnCenterCallbackProps) =>
      setExtent({ radius: boundingSphere.radius, height }),
    [],
  );

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        flat
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={0.9} />
        <directionalLight position={[-5, -3, -5]} intensity={0.35} />
        {current && (
          <Center key={current.uuid} top onCentered={onCentered}>
            <primitive object={current} />
          </Center>
        )}
        <Rig plate={plate} extent={extent} />
        <OrbitControls
          makeDefault
          enableDamping
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
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
            onClick={() => setPlate((value) => value - 1)}
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
            onClick={() => setPlate((value) => value + 1)}
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
