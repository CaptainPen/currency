import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.scss';
import './scss/Head.scss'
import './scss/Exchange.scss'
import './scss/Convert.scss'
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);


