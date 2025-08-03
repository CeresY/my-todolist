import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import TodoFilter from "@/components/TodoFilter";
import { CSSProperties } from "react";
import { Todo } from "@/types";
import { headingStyle } from "@/styles/styles";

interface TodoViewProps {
  addTodo: (text: string) => void;
  getFilteredTodos: () => Todo[];
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  setFilter: (filter: string) => void;
}

export default function TodoView({
  addTodo,
  getFilteredTodos,
  deleteTodo,
  toggleTodo,
  setFilter
}: TodoViewProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      <h1 style={headingStyle}>TodoList</h1>
      <AddTodo addTodo={addTodo} />
      <div style={{
        flex: 1,
        overflowY: 'auto',
        maxHeight: 'calc(100% - 120px)'
      }}>
        <TodoList 
          todos={getFilteredTodos()} 
          deleteTodo={deleteTodo} 
          toggleTodo={toggleTodo} 
        />
      </div>
      <TodoFilter setFilter={setFilter} />
    </div>
  );
}