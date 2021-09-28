import { Component, For, lazy, useContext, Show, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { AiOutlinePlus } from 'solid-icons/ai';
import loadingIcon from './assets/Dual Ring-1.7s-200px.svg';

import { ITodo } from './components/Todo/Todo';
import { TodosContext } from './api/TodosContext';
import FormTodo from './components/Forms/Todo/FormTodo';
const Todo = lazy(() => import('./components/Todo/Todo'));

export interface FormState {
  // Open/Close is seperate so I can wait for the closing animation 
  // before removing the FormTodo component in the view.
  open: boolean;
  close: boolean;
  /**
   * When edit button is pressed this is where we store a Todo object.
   */
  todoToUpdate: null | ITodo;
}

const loadingComponent = (msg: string) => 
<div className='grid place-items-center col-span-2 mt-60'>
  <img src={loadingIcon} className='w-28 h-28' />
  <p>{msg}</p>
</div>;

const App: Component = () => {
  const [todosState, { fetchTodos }] = useContext(TodosContext);

  const [formState, setFormState] = createStore<FormState>({
    open: false,
    close: false,
    todoToUpdate: null
  });

  createEffect(() => {
    fetchTodos();
  });

  return (
    <>
      <div 
        className='grid auto-rows-max gap-12 sm:grid-cols-1 md:grid-cols-2
        lg:grid-cols-3 pt-20 pb-20'
      >
        {
          (todosState.state === 'loading') 
          ? loadingComponent('Fetching...')
          : (todosState.state === 'fetchFailed') 
              ? <p className='col-span-2 text-center mt-60' textContent='Unable to get todos :(' />
          : (todosState.todos.length === 0) 
              ? <p className='col-span-2 text-center mt-60'>No todos...<br />Create one now!</p>
              : <For each={todosState.todos} fallback={loadingComponent('Building...')} >
                  {todo => <Todo todo={todo} setFormState={setFormState} />}
                </For>
        }
      </div>

      <Show when={formState.open && todosState.state !== 'loading'}>
        <FormTodo formState={formState} setFormState={setFormState} />
      </Show>

      <Show when={todosState.state !== 'loading'}>
        <div
          className='absolute grid pointer-events-none w-full h-full'
        >
          <button 
            className='bg-gray-800 sticky grid place-self-end place-items-center
            pointer-events-auto rounded-full shadow-2xl md:bottom-14 md:right-14
            bottom-8 right-8 w-16 h-16' 

            title='Create todo' 
            onClick={e => {
              setFormState('todoToUpdate', null);
              
              formState.open
              ? setFormState('close', true)
              : setFormState('open', true);
            }}
          >
            <AiOutlinePlus fill='white' size='35px' />
          </button>
        </div>
      </Show>
    </>
  );
};

export default App;
