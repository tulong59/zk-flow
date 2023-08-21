import { useEffect } from 'react';

export const App = () => {
  useEffect(() => {
    window.location.href = 'https://zk-flow.com/search';
  }, []);

  return <h1>REDIRECTING</h1>;
};
