import { nanoid } from 'nanoid';
import moment from 'moment';
import { Component, For } from 'solid-js';
import { AiFillEdit } from 'solid-icons/ai';

import styles from './Todo.module.css';
import { SetStoreFunction } from 'solid-js/store';
import { FormState } from '../../App';

export interface ITodo {
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
  title: string;
  actions: { action: string; completed: boolean }[];
}

const Todo: Component<{
  todo: ITodo;
  setFormState: SetStoreFunction<FormState>;
}> = (props) => {

  const { title, actions, createdAt } = props.todo;
  const setFormState = props.setFormState;

  return (
    <div class={styles.todo}>
      <h2 textContent={title} />
      <h3
        className='absolute right-5 top-7 w-20 text-xs text-right 
        break-words text-gray-500 pointer-events-none' 
        textContent={moment(createdAt).fromNow(true)} 
      />

      <ul>
        <For each={actions}>
          {item =>
            {
              const id = nanoid();
              return <li>
                      <input id={id} type="checkbox" checked={item.completed} disabled />
                      &nbsp;
                      <label htmlFor={id} textContent={item.action} />
                    </li>
            }
          }
        </For>
      </ul>

      <button 
        class={styles.todoEdit} 
        title='Edit'
        onClick={e => {
          setFormState('todoToUpdate', props.todo);
          setFormState('open', true);
        }}
      >
        <AiFillEdit size='25px' />
      </button>
    </div>
  );
};

export default Todo;
