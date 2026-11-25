import benchies from '@/assets/catalog/benchy-trio.3mf?url';
import ModelExample from '@/pages/catalog/components/model-example';

const Week20Example = () => (
  <ModelExample url={benchies} editable recolour={{ name: 'benchies', sourceUrl: benchies }} />
);

export default Week20Example;
