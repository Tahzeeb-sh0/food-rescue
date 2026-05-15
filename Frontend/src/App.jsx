import React from 'react';

import Layout from './components/layout/Layout';
import Router from './routes/Router';

const App = () => {
  return (
    <div className="min-w-0 w-full overflow-x-clip">
      <Router />
    </div>
  );
};

export default App;
