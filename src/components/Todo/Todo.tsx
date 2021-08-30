import { Component, For } from 'solid-js';

import styles from './Todo.module.css';

export interface ITodo {
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  actions: { action: string; completed: boolean }[];
}

const Todo: Component<ITodo> = (props) => {

  const { title, actions } = props;

  return (
    <div class={styles.todo}>
      <h3 textContent={title} />

      <ul>
        <For each={actions}>
          {item =>
            <li>
              <input id={item.action} type="checkbox" checked={item.completed} />
              &nbsp;
              <label htmlFor={item.action} textContent={item.action} />
            </li>
          }
        </For>
      </ul>

      <button class={styles.todoEdit} textContent={'Edit'} />
    </div>
  );
};

export default Todo;
