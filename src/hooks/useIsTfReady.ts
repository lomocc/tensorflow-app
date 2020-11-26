import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';

// const BACKEND_TO_USE = "rn-webgl";
// const BACKEND_TO_USE = 'webgl';
const BACKEND_TO_USE = 'cpu';

export default function useIsTfReady(): boolean {
  const [isTfReady, setIsTfReady] = useState(false);
  useEffect(() => {
    (async () => {
      await tf.setBackend(BACKEND_TO_USE);
      await tf.ready();
      setIsTfReady(true);
    })();
  }, []);
  return isTfReady;
}
