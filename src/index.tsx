import { render } from 'solid-js/web';

import configs from './Configs';
import './index.css';
import App from './App';
import { TodosProvider } from './api/TodosContext';

configs();

render(() => (
  <TodosProvider>
    <App />
  </TodosProvider>
), document.getElementById('root'));
