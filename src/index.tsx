import { render } from 'solid-js/web';

import configs from './App.config';
import './index.css';
import App from './App';
import { TodosProvider } from './api/TodosContext';

configs();

render(() => (
  <TodosProvider>
    <App />
  </TodosProvider>
), document.getElementById('root'));
