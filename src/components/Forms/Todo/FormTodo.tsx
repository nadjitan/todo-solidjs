import { Component, useContext, For, Setter, Accessor, Show, createSignal, createEffect } from 'solid-js';

import styles from './FormTodo.module.css';

import { ITodo } from '../../Todo/Todo';
import { TodosContext } from '../../../API/TodosContext';
import { $RAW, createStore } from 'solid-js/store';

const FormTodo: Component<{
  showForm?: Accessor<boolean>;
  setShowForm?: Setter<boolean>;
  closeForm?: Accessor<boolean>;
  setCloseForm?: Setter<boolean>;
}> = (props) => {
  // On/Off UI
  const { showForm, setShowForm, closeForm, setCloseForm } = props;

  const [state, { addTodo }] = useContext(TodosContext);

  createEffect(() => {
    closeForm()
      && setTimeout(() => {
        setShowForm(false);
        setCloseForm(false);
      }, 600)
  });

  const initialFormState = () => ({
    todo: {
      title: '',
      description: '',
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
      style={closeForm() && { 'margin-right': '100%' }}
    >
      <form id={styles.formTodo} onSubmit={e => submit(e)}>
        <button
          type='reset'
          class={styles.exit}
          onClick={e => setCloseForm(true)}
          textContent={'X'}
        />

        <h3 textContent={'CREATE TODO'} />

        <section>
          <input
            type='text'
            id='title'
            value={formData.todo.title}
            placeholder=''
            onChange={(e: any) => setFormData('todo', 'title', e.target.value)}
          />
          <label htmlFor='title' textContent={'Title'} />
        </section>

        <section>
          <input
            type='text'
            id='description'
            value={formData.todo.description}
            placeholder=''
            onChange={(e: any) => setFormData('todo', 'description', e.target.value)}
          />
          <label htmlFor='description' textContent={'Description'} />
        </section>

        <section id={styles.containerActions}>
          <For each={formData.todo.actions}>
            {(item, index) => {
              const { action } = item;
              return (
                <div class={styles.action}>
                  <input
                    type='text'
                    id='todo'
                    value={action}
                    placeholder=''
                    onChange={(e: any) => {
                      setFormData('todo', 'actions', index(), { action: e.target.value });
                    }}
                  />
                  <label textContent={'Todo'} />

                  <Show when={formData.todo.actions.length !== 1} >
                    <button
                      class={styles.deleteAction}
                      onClick={(e: any) => {
                        e.preventDefault();
                        setFormData('todo', 'actions', a => [
                          ...a.slice(0, index()),
                          ...a.slice(index() + 1)
                        ] as any);
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
              ] as any);
            }}
            textContent={'Add Todo +'}
          />
        </section>

        <section>
          <button class={styles.createTodo} textContent={'CREATE'} />
        </section>
      </form>
    </div>
  );
};

export default FormTodo;
