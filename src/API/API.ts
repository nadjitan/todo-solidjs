import axios from "axios";
import { ITodo } from "../components/Todo/Todo";

const API = axios.create({ baseURL: 'https://todo-apps-server.herokuapp.com' });

export const fetchTodos = () => API.get('/todos');

export const createTodo = (newTodo: ITodo) => API.post('/todos', newTodo);

export const updateTodo = (todo: ITodo) => API.patch(`/todos/${todo._id}`, todo);

export const deleteTodo = (todo: ITodo) => API.delete(`/todos/${todo._id}`);