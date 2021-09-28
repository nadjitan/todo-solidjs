import { createContext, PropsWithChildren } from 'solid-js';
import { createStore, SetStoreFunction } from 'solid-js/store';
import { AxiosResponse } from 'axios';

import { ITodo } from '../components/Todo/Todo';
import * as api from '../api/API';

/**
 * Holds the current state of Todos
 * 
 * @property state - idle | loading | failed | fetchFailed | creating | updating | deleting
 * @property todos - A list of ITodo
 */
interface TodosState {
  state: 'idle' | 'loading' | 'failed' | 'fetchFailed' |
         'creating' | 'updating' | 'deleting';
  todos: ITodo[];
}

/**
 * Actions for interacting with the db
 * 
 * @property getTodos
 * @property createTodo
 * @property updateTodo
 * @property deleteTodo
 */
interface Actions {
  /**
   * Fetch all Todos from the db.
   */
  fetchTodos?(): void;

  /**
   * Save a Todo to the db.
   * 
   * @param {ITodo} todo Todo object
   * @param {VoidFunction} [next] Callback to execute once todo is created.
   * @returns void
   */
  createTodo?(todo: ITodo, next?: () => void): void;

  /**
   * Update a Todo in the db.
   * 
   * @param {ITodo} todo Todo object
   * @param {VoidFunction} [next] Callback to execute once todo is updated.
   * @returns void
   */
  updateTodo?(todo: ITodo, next?: () => void): void;

  /**
   * Delete a Todo in the db.
   * 
   * @param {ITodo} todo Todo object
   * @param {VoidFunction} [next] Callback to execute once todo is deleted.
   * @returns void
   */
  deleteTodo?(todo: ITodo, next?: () => void): void;
}

const initialState: TodosState = {
  state: 'idle',
  todos: []
}

/**
 * Console log an error and set state to failed
 * 
 * @param {Error} error Object that have the error message.
 * @param {SetStoreFunction<TodosState>} stateSetter Todo state setter.
 * @returns void
 */
const logError = (error: Error, stateSetter: SetStoreFunction<TodosState>) => {
  console.log('%c[ERROR]%c' + error.message, 'color: red');
  stateSetter('state', 'failed');
}

export const TodosContext = createContext<[TodosState, Actions]>([initialState, {}]);

export const TodosProvider = (props: PropsWithChildren) => {
  const [state, setState] = createStore<TodosState>(initialState);

  const store: [TodosState, Actions] = [
    state,
    {
      async fetchTodos() {
        setState('state', 'loading');

        await api.fetchTodos()
        .then((response: AxiosResponse<ITodo[]>) => {
          setState('todos', response.data);
          setState('state', 'idle');
        })
        .catch((onrejected) => {
          if (onrejected.message === 'Request aborted') {
            // console.log('%c[ATTENTION]%c' + onrejected.message, 'color: yellow');
          }
          else {
            setState('state', 'fetchFailed');
            // console.log('%c[ERROR]%c' + onrejected.message, 'color: red');
          }
        });
      },
      
      async createTodo(todo: ITodo, next?: () => void) {
        setState('state', 'creating');

        await api.createTodo(todo)
        .then((response: AxiosResponse<ITodo>) => {
          setState('todos', todos => [...todos, response.data]);

          next();

          setState('state', 'idle');
        })
        .catch((onrejected) => onrejected && logError(onrejected, setState));
      },

      async updateTodo(todo: ITodo, next?: () => void) {
        setState('state', 'updating');

        await api.updateTodo(todo)
        .then(() => {
          setState('todos', todos => todos.map(
            t => t._id === todo._id ? todo : t
          ))
          
          next();

          setState('state', 'idle');
        })
        .catch((onrejected) => onrejected && logError(onrejected, setState));
      },

      async deleteTodo(todo: ITodo, next?: () => void) {
        setState('state', 'deleting');

        await api.deleteTodo(todo)
        .then(() => {
          setState('todos', ts => [...ts.filter(t => t._id !== todo._id)]);

          next();
          
          setState('state', 'idle');
        })
        .catch((onrejected) => onrejected && logError(onrejected, setState));
      }
    }
  ];

  return (
    <TodosContext.Provider value={store}>
      {props.children}
    </TodosContext.Provider>
  )
}