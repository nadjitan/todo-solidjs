import moment from 'moment';
import { Component, For } from 'solid-js';
import { AiFillEdit } from 'solid-icons/ai';
import { FaSolidCheck } from 'solid-icons/fa';

import { $RAW, SetStoreFunction } from 'solid-js/store';
import { FormState } from '../../App';

/**
 * Todo model
 * @property createdAt
 * @property updatedAt
 * @property _id
 * @property title
 * @property actions
 */
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

  const todo: ITodo = props.todo[$RAW];
  const setFormState = props.setFormState;

  return (
    <div 
      className='bg-white relative grid content-start 
      gap-y-3 rounded-lg shadow-md p-5 h-64 w-72'
    >
      <h2 
        title={todo.title} 
        className='overflow-hidden whitespace-nowrap overflow-ellipsis
        font-bold text-lg w-5/6'
        textContent={todo.title} 
      />
      
      <h3
        className='absolute right-5 top-7 w-20 text-xs text-right 
        break-words text-gray-500 pointer-events-none' 
        textContent={moment(todo.createdAt).fromNow(true)} 
      />

      <ul className='overflow-auto h-36 list-none'>
        <For each={todo.actions}>
          {item =>
            <li className='grid' style={{ "grid-template-columns": '0.1fr 1fr' }}>
              {
                item.completed
                ? <div className='w-4 h-4 rounded-sm border-2 border-black relative mt-1' >
                    <FaSolidCheck 
                      className='absolute' 
                      style={{ bottom: '0.2px', left: '2px' }}
                      fill='green'
                      size='17' 
                      stroke='white' 
                      stroke-width='60px'
                    />
                  </div>
                : <div className='w-4 h-4 rounded-sm border-2 border-black mt-1' />
              }
              {item.action}
            </li>
          }
        </For>
      </ul>

      <button 
        className='absolute right-5 bottom-4' 
        title='Edit'
        onClick={e => {
          console.log(todo);
          
          setFormState('todoToUpdate', todo);
          setFormState('open', true);
        }}
      >
        <AiFillEdit size='25px' title='Edit' />
      </button>
    </div>
  );
};

export default Todo;
