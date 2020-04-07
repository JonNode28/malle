import React, { useEffect, useState } from 'react'
import service from '../service';
import s from './styles.pcss';

type Props = {
  config: MalleModelConfig
}

type MalleModelConfig = {
  id: string,
  name: string,
  description?: string,
  properties: Array<MallePropertyConfig>
};

type MallePropertyConfig = {
  id: string,
  name: string,
  description: string,
  type: string,
  validations: Array<MalleValidationConfig>
};

type MalleValidationConfig = {
  errorMessage: string,
  options: any
};

function ListRenderer({ config }: Props): any {

  const [ skip, setSkip ] = useState(0);
  const [ take, setTake ] = useState(10);
  const [ items, setItems ] = useState<Array<any>>([]);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const listResult = await service.list(config.id);
      setItems(listResult.items);
      setLoading(false);
    })()
  }, [ ]);

  return (
    <div className={s['list-renderer']}>
      <h1>{config.name}</h1>
      <p>{config.description}</p>
      {loading && <div>loading...</div>}
      {items.map(item => (
        <div>item</div>
      ))}
    </div>
  );
}

export default ListRenderer;
