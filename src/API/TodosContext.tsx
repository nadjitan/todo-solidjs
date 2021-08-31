import { createContext, PropsWithChildren } from 'solid-js';
import { createStore, SetStoreFunction } from 'solid-js/store';
import { ITodo } from '../components/Todo/Todo';
import * as api from '../api/API';

interface TodosState {
  state: 'idle' | 'loading' | 'success' | 'failed' | 
         'fetchFailed' | 'creating' | 'updating' | 'deleting';
  todos: ITodo[];
}
interface Actions {
  getTodos?(): void;
  createTodo?(todo: ITodo): void;
  updateTodo?(todo: ITodo): void;
  deleteTodo?(todo: ITodo, next?: () => void): void;
}

const initialState: TodosState = {
  state: 'idle',
  todos: []
}

const logError = (error: any, stateSetter: SetStoreFunction<TodosState>) => {
  console.log('%c[ERROR]%c' + error.message, 'color: red');
  stateSetter('state', 'failed');
}

export const TodosContext = createContext<[TodosState, Actions]>([initialState, {}]);

export const TodosProvider = (props: PropsWithChildren) => {
  const [state, setState] = createStore<TodosState>(initialState);

  const store: [TodosState, Actions] = [
    state,
    {
      async getTodos() {
        try {
          setState('state', 'loading');

          const response = await api.fetchTodos();

          setState('todos', response.data);
          setState('state', 'success');
        } catch (error) {
          if (error.message === 'Request aborted') {
            console.log('%c[ATTENTION]%c' + error.message, 'color: yellow');
          }
          else {
            setState('state', 'fetchFailed');
            console.log('%c[ERROR]%c' + error.message, 'color: red');
          }
        }
      },
      async createTodo(todo: ITodo) {
        try {
          setState('state', 'creating');

          await api.createTodo(todo);

          setState('todos', todos => [...todos, todo]);
          setState('state', 'success');
        } catch (error) {
          logError(error, setState);
        }
      },
      async updateTodo(todo: ITodo) {
        try {
          setState('state', 'updating');

          await api.updateTodo(todo);

          setState('todos', todos => todos.map(
            obj => todos.find(o => o._id === obj._id) || obj
          ));
          setState('state', 'success');
        } catch (error) {
          logError(error, setState);
        }
      },
      async deleteTodo(todo: ITodo, next?: () => void) {
        try {
          setState('state', 'deleting');

          await api.deleteTodo(todo);

          setState('todos', ts => [...ts.filter(t => t._id !== todo._id)]);
          next();
          setState('state', 'success');
        } catch (error) {
          logError(error, setState);
        }
      }
    }
  ];

  return (
    <TodosContext.Provider value={store}>
      {props.children}
    </TodosContext.Provider>
  )
}