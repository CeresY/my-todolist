import {Todo} from "@/types";
import { buttonStyle} from "@/styles/styles"

interface TodoItemProps {
  todo: Todo,
  toggleTodo: (id: number) => void,
  deleteTodo: (id: number) => void
}

function TodoItem({todo, toggleTodo, deleteTodo}: TodoItemProps) {
  return (
      <li style={{textDecoration: todo.completed ? 'line-through' : 'none', marginBottom: '10px'}}>
        {todo.title}
        <button style={{...buttonStyle, padding:'3px'}} onClick={() => toggleTodo(todo.id)}>完成</button>
        <button style={{...buttonStyle, padding:'3px'}} onClick={() => deleteTodo(todo.id)}>删除</button>
      </li>
  );
}

export default TodoItem;