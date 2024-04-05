"use client"
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import TodoFilter from "@/components/TodoFilter";
import {CSSProperties, useState} from "react";
import {Todo} from "@/types";
// import styles from  "@/app/Home.module.css"

const fatherDiv: CSSProperties  = {
    position: 'relative',
    height: '300px',
    width: '300px',
    border: '1px solid black'
}

const currentDiv: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '500px',
    border: '1px solid grey',
    padding: '10px'
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  return (
        <div style={currentDiv}>
          <h1>TodoList</h1>
          <AddTodo></AddTodo>
          <TodoList></TodoList>
          <TodoFilter></TodoFilter>
        </div>
  );
}