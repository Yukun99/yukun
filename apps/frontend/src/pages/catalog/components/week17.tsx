import benchy from '@/assets/catalog/benchy-colour.3mf?url';
import ModelExample from '@/pages/catalog/components/model-example';

const Week17Example = () => (
  <ModelExample url={benchy} recolour={{ name: 'benchy', sourceUrl: benchy }} />
);

export default Week17Example;
