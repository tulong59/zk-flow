import { useEffect } from 'react';

export const App = () => {
  useEffect(() => {
    window.location.href = 'https://tulong59.github.io/zk-flow/';
  }, []);

  return <h1>REDIRECTING</h1>;
};
