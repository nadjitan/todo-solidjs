import { Component, useContext, For, Show, createEffect } from 'solid-js';
import { $RAW, createStore, SetStoreFunction, Store } from 'solid-js/store';
import { css } from 'solid-styled-components';

import { ITodo } from '../../Todo/Todo';
import { FormAnimsState } from '../../../App';
import { TodosContext } from '../../../API/TodosContext';

import styles from './FormTodo.module.css';

const FormTodo: Component<{
  formAnims: Store<FormAnimsState>;
  setFormAnims: SetStoreFunction<FormAnimsState>;
}> = (props) => {
  // On/Off UI
  const { formAnims, setFormAnims } = props;

  const [state, { addTodo }] = useContext(TodosContext);

  createEffect(() => {
    formAnims.close
      && setTimeout(() => {
        setFormAnims('open', false);
        setFormAnims('close', false);
      }, 400) // Wait CSS transition duration
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
    addTodo(formData.todo);
    setFormData(initialFormState());
    console.log(state[$RAW].todos);
  }

  return (
    <div
      class={styles.formTodoBG}
      className={formAnims.close && css`
        margin-right: 100%;
        /* MOBILE */
        @media (max-width: 35em) {
          margin-right: 200%;
        }
      `}
    >
      <form id={styles.formTodo} onSubmit={e => submit(e)}>
        <button
          type='reset'
          class={styles.exit}
          value=''
          onClick={e => setFormAnims('close', true)}
          textContent={'X'}
          title='Exit'
        />

        <h3 textContent={'CREATE TODO'} />

        <section>
          <input
            autocomplete='off'
            type='text'
            id='title'
            placeholder=''
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
                    placeholder=''
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
                      textContent={'X'}
                    />
                  </Show>
                </div>
              )
            }}
          </For>

          <button
            id={styles.addAction}
            onClick={e => {
              e.preventDefault();
              setFormData('todo', 'actions', a => [
                ...a,
                { action: '', completed: false }
              ]);
            }}
            textContent={'Add Action +'}
          />
        </section>

        <section>
          <button
            class={styles.createTodo}
            textContent={'CREATE'}
          />
        </section>
      </form>
    </div>
  );
};

export default FormTodo;
