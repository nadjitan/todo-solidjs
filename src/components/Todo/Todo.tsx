import type { Component } from 'solid-js';

import styles from './Todo.module.css';

export interface ITodo {
  title: string;
  description: string;
  todos: string[];
}

const Todo: Component = () => {
  return (
    <div class={styles.todo}>
      <h3>TODO TITLE</h3>
      <p>description</p>
      <ul>
        <li>Todo 1</li>
        <li>Todo 2</li>
        <li>Todo 3</li>
      </ul>
      <button class={styles.todoEdit}>Edit</button>
    </div>
  );
};

export default Todo;
