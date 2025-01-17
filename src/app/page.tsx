"use client"
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import TodoFilter from "@/components/TodoFilter";
import {CSSProperties, useState} from "react";
import {Todo} from "@/types";
import {centerDiv} from "@/styles"

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
    const [filter, setFilter] = useState("")
    const addTodo = (text: string) => {
      const newTodo: Todo = {
          id: Math.random(),
          title: text,
          completed: false
      }
        setTodos([...todos, newTodo])
    }

    const deleteTodo = (id: number) => {
      setTodos(todos.filter(todo => todo.id !== id))
    }

    const toggleTodo = (id: number) => {
      setTodos(todos.map(todo => {
          if (todo.id === id) {
              return {
                  ...todo,
                  completed: !todo.completed
              }
          }
          return todo
      }))
    }

    const getFilteredTodos = ():Array<Todo> => {
        switch (filter) {
            case 'active':
                return todos.filter(todo => !todo.completed)
            case 'completed':
                return todos.filter(todo => todo.completed)
            default:
                return todos
        }
    }

  return (
        <div style={centerDiv}>
          <h1>TodoList</h1>
          <AddTodo addTodo={addTodo}></AddTodo>
          <TodoList todos={getFilteredTodos()} deleteTodo={deleteTodo} toggleTodo={toggleTodo}></TodoList>
          <TodoFilter setFilter={setFilter}></TodoFilter>
        </div>
  );
}