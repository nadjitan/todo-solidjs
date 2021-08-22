import { Component, createSignal, For, lazy, useContext, Show } from 'solid-js';

import styles from './App.module.css';
import { TodosContext } from './API/TodosContext';

import FormTodo from './components/Forms/Todo/FormTodo';
const Todo = lazy(() => import('./components/Todo/Todo'));

const App: Component = () => {
  const [state] = useContext(TodosContext);
  const [showForm, setShowForm] = createSignal(false);
  const [closeForm, setCloseForm] = createSignal(false);

  return (
    <>
      <div class={styles.App}>
        <For each={state.todos}>
          {item =>
            <Todo title={item.title} description={item.description} actions={item.actions} />
          }
        </For>
      </div>

      <Show when={showForm()}>
        <FormTodo showForm={showForm} setShowForm={setShowForm} closeForm={closeForm} setCloseForm={setCloseForm} />
      </Show>

      <div id={styles.addTodoBG}>
        <button id={styles.addTodo} onClick={e => {
          showForm() === true
            ? setCloseForm(true)
            : setShowForm(true);

        }}>

        </button>
      </div>
    </>
  );
};

export default App;
