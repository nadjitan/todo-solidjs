import { Component, For } from 'solid-js';

import styles from './Todo.module.css';

export interface ITodo {
  created?: Date;
  updated?: Date;
  title: string;
  description: string;
  actions: { action: string; completed: boolean }[];
}

const Todo: Component<ITodo> = (props) => {

  const { title, description, actions } = props;

  return (
    <div class={styles.todo}>
      <h3 textContent={title} />

      <p textContent={description} />

      <ul>
        <For each={actions}>
          {item =>
            <li textContent={item.action} />
          }
        </For>
      </ul>

      <button class={styles.todoEdit} textContent={'Edit'} />
    </div>
  );
};

export default Todo;
