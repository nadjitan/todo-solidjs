import type { Component } from 'solid-js';

import styles from './App.module.css';
import FormTodo from './components/Forms/Todo/FormTodo';
import Todo from './components/Todo/Todo';

const App: Component = () => {
  return (
    <>
      <div class={styles.App}>
        <Todo />
        <Todo />
        <Todo />
        <Todo />
        <Todo />
        <Todo />
        <Todo />
      </div>

      <div class={styles.stickyForm}>
        <FormTodo />
      </div>

      <div class={styles.stickyButton}>
        <button id={styles.addTodo}>

        </button>
      </div>
    </>
  );
};

export default App;
