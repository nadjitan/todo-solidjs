import { Component, For, lazy, useContext, Show, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { AiOutlinePlus } from 'solid-icons/ai';

import { TodosContext } from './api/TodosContext';
import FormTodo from './components/Forms/Todo/FormTodo';
const Todo = lazy(() => import('./components/Todo/Todo'));

import styles from './App.module.css';
import loadingIcon from './assets/Dual Ring-1.7s-200px.svg';
import { ITodo } from './components/Todo/Todo';

export interface FormState {
  /**
   * Open/Close is seperate so I can wait for the closing animation 
   * before removing the FormTodo component in the view.
   */
  open: boolean;
  close: boolean;
  todoToUpdate: null | ITodo;
}

const App: Component = () => {
  const [state, { getTodos }] = useContext(TodosContext);

  const [formState, setFormState] = createStore<FormState>({
    open: false,
    close: false,
    todoToUpdate: null
  });

  createEffect(() => {
    getTodos();
  });

  return (
    <>
      <div class={styles.App}>
        {
          state.state === 'loading'
            ? <img 
                src={loadingIcon} 
                className='w-28 h-28 col-span-2 mt-60' 
              />
            : (state.todos.length === 0)
              ? <p className='col-span-2 text-center mt-60'>No todos...<br />Create one now!</p>
              : <For each={state.todos}>
                  {item =>
                    <Todo todo={item} setFormState={setFormState} />
                  }
                </For>
        }
        {
          (state.state === 'fetchFailed')
          && <p className='col-span-2 text-center mt-60' textContent='Unable to get todos :(' />
        }
      </div>

      <Show when={formState.open}>
        <FormTodo formState={formState} setFormState={setFormState} />
      </Show>

      <div id={styles.addTodoBG}>
        <button id={styles.addTodo} onClick={e => {
          setFormState('todoToUpdate', null);
          
          formState.open
            ? setFormState('close', true)
            : setFormState('open', true);
        }}>
          <AiOutlinePlus fill='white' size='35px' />
        </button>
      </div>
    </>
  );
};

export default App;
