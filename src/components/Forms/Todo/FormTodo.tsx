import { Component, useContext, For, Show, createEffect } from 'solid-js';
import { $RAW, createStore, SetStoreFunction, Store } from 'solid-js/store';
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

  const [state, { createTodo, updateTodo, deleteTodo }] = useContext(TodosContext);

  createEffect(() => {
    formState.close
      && setTimeout(() => {
        setFormState('open', false);
        setFormState('close', false);
      }, 400) // Wait form CSS transition duration
  });

  const initialFormState = (): { todo: ITodo } => ({
    todo: {
      title: '',
      actions: [{ action: '', completed: false }]
    }
  })
  const [formData, setFormData] = createStore(initialFormState());

  const submit = (e: Event) => {
    e.preventDefault();
    createTodo(formData.todo);
    setFormData(initialFormState());
    console.log(state[$RAW].todos);
  }

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
          type='reset'
          class={styles.exit}
          value=''
          onClick={e => {
            setFormState('close', true);
            setFormState('todoToUpdate', null);
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
            id='title'
            placeholder=' '
            value={formData.todo.title}
            onKeyUp={(e: any) => setFormData('todo', 'title', e.target.value)}
            required
          />
          <label htmlFor='title' textContent={'Title'} />
        </section>

        <section id={styles.containerActions}>
          <For each={formData.todo.actions}>
            {(item, index) => {
              return (
                <div class={styles.action}>
                  <input
                    autocomplete='off'
                    type='text'
                    id='todo'
                    placeholder=' '
                    value={formData.todo.actions[index()].action}
                    onKeyUp={(e: any) => {
                      setFormData('todo', 'actions', index(), { action: e.target.value });
                    }}
                    required
                  />
                  <label textContent={'Action'} />

                  <Show when={formData.todo.actions.length !== 1} >
                    <button
                      class={styles.deleteAction}
                      onClick={(e: any) => {
                        e.preventDefault();
                        setFormData('todo', 'actions', a => [
                          ...a.slice(0, index()),
                          ...a.slice(index() + 1)
                        ]);
                      }}
                      className='grid place-items-center'
                    ><IoClose size='20px'/></button>
                  </Show>
                </div>
              )
            }}
          </For>

          {
            formState.todoToUpdate === null &&
              <button
                id={styles.addAction}
                onClick={e => {
                  e.preventDefault();
                  setFormData('todo', 'actions', a => [
                    ...a,
                    { action: '', completed: false }
                  ]);
                }}
                className='inline-flex text-sm'
              >
                <AiOutlinePlus className='self-center' size='17px' /> ADD ACTION
              </button>
          }
        </section>

        <section>
          {
            formState.todoToUpdate === null
              ? <button
                  class={styles.createTodo}
                  className={state.state === 'creating' && 'pointer-events-none'}
                >
                  {
                    state.state === 'creating' 
                      ? <img 
                          src={loading} 
                          className='w-8 h-5 mt-1 pr-2' 
                        />
                      : 'CREATE'
                  }
                </button>
              : <>
                  <button
                    className='mt-3'
                    class={styles.updateTodo}
                    onClick={e => {
        
                    }}
                  >
                    UPDATE
                  </button>
                  <button
                    className={`mt-3 ${state.state === 'deleting' && 'pointer-events-none'}`}
                    class={styles.deleteTodo}
                    onClick={e => {
                      e.preventDefault();

                      deleteTodo(formState.todoToUpdate, () => {
                        setFormState('close', true);
                        setFormState('todoToUpdate', null);
                      });
                    }}
                  >
                    {
                      state.state === 'deleting' 
                        ? <img 
                            src={loading} 
                            className='w-8 h-5 mt-1 pr-2' 
                          />
                        : 'DELETE'
                    }
                  </button>
                </>
          }
        </section>
      </form>

      <div
        className='pointer-events-auto z-0 sm:w-1/2 lg:w-3/4 h-full'
        onClick={e => {
          setFormState('close', true);
          setFormState('todoToUpdate', null);
        }}
      />
    </div>
  );
};

export default FormTodo;
