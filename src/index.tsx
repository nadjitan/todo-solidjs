import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { TodosProvider } from './API/TodosContext';

render(() => (
  <TodosProvider>
    <App />
  </TodosProvider>
), document.getElementById('root'));
