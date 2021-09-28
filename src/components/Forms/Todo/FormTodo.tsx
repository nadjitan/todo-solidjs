import { Component, useContext, For, Show, createEffect } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';
import { css } from 'solid-styled-components';
import { AiOutlinePlus } from 'solid-icons/ai';
import { IoClose } from 'solid-icons/io';

import { ITodo } from '../../Todo/Todo';
import { FormState } from '../../../App';
import { TodosContext } from '../../../api/TodosContext';

import styles from './FormTodo.module.css';
import loading from '../../../assets/three-dots.svg';

const FormTodo: Component<{
  formState: Store<FormState>;
  setFormState: SetStoreFunction<FormState>;
}> = (props) => {

  const { formState, setFormState } = props; // On/Off UI

  const [todosState, { createTodo, updateTodo, deleteTodo }] = useContext(TodosContext);

  const initialFormState = (): { todo: ITodo } => ({
    todo: {
      title: '',
      actions: [{ action: '', completed: false }]
    }
  })
  const [formData, setFormData] = createStore(initialFormState());


  createEffect(() => {
    formState.close && setTimeout(() => {
      setFormState('open', false);
      setFormState('close', false);
      setFormState('todoToUpdate', null);
    }, 400) // Wait form CSS transition duration

    formState.todoToUpdate !== null && setFormData('todo', formState.todoToUpdate);
  });

  
  const submit = (e: Event) => {
    e.preventDefault();
    
    createTodo(formData.todo, () => setFormData(initialFormState()));
  };

  return (
    <div
      class={styles.formTodoBG}
      className={formState.close && css`
        margin-right: 200vw;
      `}
    >
      <form id={styles.formTodo} onSubmit={e => submit(e)}>
        <button
          title='Exit'
          className='absolute top-5 right-7'
          value=''
          onClick={e => {
            e.preventDefault();
            setFormState('close', true);
          }}
        >
          <IoClose size='30px' />
        </button>

        {
          formState.todoToUpdate === null
          ? <h3 textContent={'CREATE TODO'} />
          : <h3 textContent={'UPDATE TODO'} />
        }

        <section>
          <input
            autocomplete='off'
            type='text'
            maxLength='20'
            id='title'
            placeholder=' '
            value={formData.todo.title}
            onKeyUp={(e: any) => setFormData('todo', 'title', e.target.value)}
            required
          />
          <label htmlFor='title' textContent={'Title'} />
        </section>

        <section className='gap-y-4'>
          <For each={formData.todo.actions}
          >
            {(item, index) => {
              return (
                <div 
                  className='grid gap-1 items-center' 
                  style={formState.todoToUpdate !== null && { 'grid-template-columns': '0.15fr 1fr'}}
                >
                  {
                    formState.todoToUpdate !== null &&
                      <div className='w-10 h-10'>
                        <input 
                          title='Check'
                          className='cursor-pointer w-full h-full'
                          type='checkbox' 
                          checked={formData.todo.actions[index()].completed} 
                          onClick={e => 
                            setFormData(
                              'todo', 'actions', index(), 'completed', 
                              !formData.todo.actions[index()].completed
                          )}
                        />
                      </div>
                  }
                  <div className='grid relative'>
                    <input
                      autocomplete='off'
                      type='text'
                      maxLength='56'
                      id='todo'
                      placeholder=' '
                      value={formData.todo.actions[index()].action}
                      onKeyUp={(e: any) => 
                        setFormData('todo', 'actions', index(), 'action', e.target.value)
                      }
                      required
                    />
                    <label textContent={'Action'} />

                    <Show when={formData.todo.actions.length !== 1}>
                      <button
                        class={styles.deleteAction}
                        onClick={(e: any) => {
                          e.preventDefault();

                          setFormData('todo', 'actions', acts => [
                            ...acts.slice(0, index()),
                              ...acts.slice(index() + 1)
                          ])
                        }}
                        className='grid place-items-center'
                      ><IoClose size='20px'/></button>
                    </Show>
                  </div>
                </div>
              )
            }}
          </For>

          <Show when={formData.todo.actions.length <= 19}>
            <button
              onClick={e => {e.preventDefault();
                formData.todo.actions.length <= 19 &&
                setFormData('todo', 'actions', a => [
                  ...a,
                  { action: '', completed: false }
                ])
              }}
              className='inline-flex text-sm bg-transparent
                        place-self-center w-auto'
            >
              <AiOutlinePlus className='self-center' size='17px'/> 
              ADD ACTION
            </button>
          </Show>
        </section>

        <section>
          {
            formState.todoToUpdate === null
              ? <button
                  class={styles.createTodo}
                  className={todosState.state === 'creating' && 'pointer-events-none'}
                >
                  {
                    todosState.state === 'creating' 
                    ? <img src={loading} className='w-8 h-5 mt-1 pr-2' />
                    : 'CREATE'
                  }
                </button>
              : <>
                  <button
                    className='mt-3'
                    class={styles.updateTodo}
                    onClick={e => {e.preventDefault();
                      updateTodo(formData.todo, () => setFormState('close', true));
                    }}
                  >
                    {
                      todosState.state === 'updating' 
                      ? <img src={loading} className='w-8 h-5 mt-1 pr-2' />
                      : 'UPDATE'
                    }
                  </button>

                  <button
                    className={`mt-3 ${todosState.state === 'deleting' && 'pointer-events-none'}`}
                    class={styles.deleteTodo}
                    onClick={e => {e.preventDefault();
                      deleteTodo(formState.todoToUpdate, () => setFormState('close', true));
                    }}
                  >
                    {
                      todosState.state === 'deleting' 
                      ? <img src={loading} className='w-8 h-5 mt-1 pr-2' />
                      : 'DELETE'
                    }
                  </button>
                </>
          }
        </section>
      </form>

      <div
        className='pointer-events-auto z-0 sm:w-1/2 lg:w-3/4 h-full'
        onClick={e => setFormState('close', true)}
      />
    </div>
  );
};

export default FormTodo;
