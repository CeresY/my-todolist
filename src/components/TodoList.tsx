import {Todo} from "@/types";
import TodoItem from "@/components/TodoItem";

interface TodoListProps {
    todos: Array<Todo>;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}
function TodoList({todos, toggleTodo, deleteTodo}:TodoListProps) {
  return (
    <div style={{margin: "0 0 1rem 2rem"}}>
      <ul>
          {
              todos.map((todo) => (
                  <TodoItem
                      key={todo.id}
                      todo={todo}
                      toggleTodo={toggleTodo}
                      deleteTodo={deleteTodo}></TodoItem>
              ))
          }
      </ul>
    </div>
  );
}

export default TodoList;