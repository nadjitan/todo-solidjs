import { Component, createEffect, createSignal, useContext } from 'solid-js';

import styles from './FormTodo.module.css';
import { ITodo } from '../../Todo/Todo';
import { TodosContext } from '../../../API/TodosContext';
import { $RAW } from 'solid-js/store';

const FormTodo: Component = () => {
  const [state, { addTodo }] = useContext(TodosContext);

  const [data, setData] = createSignal<ITodo>({
    title: '',
    description: '',
    todos: [''],
  });

  createEffect(() => console.log(state[$RAW]));

  const submit = (e: Event) => {
    e.preventDefault();
    
    addTodo(data());
    console.log(state[$RAW].todos);
  }

  return (
    <form class={styles.formTodo} onSubmit={(e) => submit(e)}>
      <button type='reset' class={styles.exit}>X</button>

      <h3>CREATE TODO</h3>

      <section>
        <input
          type='text'
          name='title'
          id='title'
          value={data().title}
          placeholder=''
          onChange={(e: any) => setData({ ...data(), title: e.target.value })}
        />
        <label htmlFor='title'>Title</label>
      </section>

      <section>
        <input
          type='text'
          name='description'
          id='description'
          value={data().description}
          placeholder=''
          onChange={(e: any) => setData({ ...data(), description: e.target.value })}
        />
        <label htmlFor='description'>Description</label>
      </section>

      <section>
        <input
          type='text'
          name='todo'
          id='todo'
          value={data().todos[0]}
          placeholder=''
          onChange={(e: any) => setData({ ...data(), todos: e.target.value })}
        />
        <label>Todo</label>
      </section>

      <section>
        <button class={styles.createTodo}>CREATE</button>
      </section>
    </form>
  );
};

export default FormTodo;
