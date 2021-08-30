import { nanoid } from 'nanoid';
import { createContext, PropsWithChildren } from 'solid-js';
import { createStore } from 'solid-js/store';
import { ITodo } from '../components/Todo/Todo';

// https://todo-apps-server.herokuapp.com/todos

interface TodosState {
  state: 'idle' | 'loading' | 'success' | 'failed';
  todos: ITodo[];
}
interface Actions {
  addTodo?(todo: ITodo): void;
}

const initialState: TodosState = {
  state: 'idle',
  todos: []
}

export const TodosContext = createContext<[TodosState, Actions]>([initialState, {}]);

export const TodosProvider = (props: PropsWithChildren) => {
  const [state, setState] = createStore<TodosState>(initialState);

  const store: [TodosState, Actions] = [
    state,
    {
      addTodo(todo: ITodo) {
        setState('todos', t => [...t, todo]);
      }
    }
  ];

  return (
    <TodosContext.Provider value={store}>
      {props.children}
    </TodosContext.Provider>
  )
}