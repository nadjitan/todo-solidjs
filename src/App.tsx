import { Component, createSignal, For, lazy, useContext, Show } from 'solid-js';
import { createStore } from 'solid-js/store';

import { TodosContext } from './API/TodosContext';
import FormTodo from './components/Forms/Todo/FormTodo';
const Todo = lazy(() => import('./components/Todo/Todo'));

import styles from './App.module.css';

export interface FormAnimsState {
  open: boolean;
  close: boolean;
}

const App: Component = () => {
  const [state] = useContext(TodosContext);
  const [formAnims, setFormAnims] = createStore<FormAnimsState>({} as FormAnimsState);

  return (
    <>
      <div class={styles.App}>
        <For each={state.todos}>
          {item =>
            <Todo title={item.title} actions={item.actions} />
          }
        </For>
      </div>

      <Show when={formAnims.open}>
        <FormTodo formAnims={formAnims} setFormAnims={setFormAnims} />
      </Show>

      <div id={styles.addTodoBG}>
        <button id={styles.addTodo} onClick={e => {
          formAnims.open
            ? setFormAnims('close', true)
            : setFormAnims('open', true);
        }}>

        </button>
      </div>
    </>
  );
};

export default App;
