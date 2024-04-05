import {FormEvent, useState} from "react";
import { buttonStyle, inputStyle} from "@/styles"

interface AddTodoProps {
    addTodo: (text: string) => void;
}

function AddTodo ({addTodo}:AddTodoProps) {
    const [text, setText] = useState('');
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(text.trim() === '') return;
        addTodo(text.trim());
        setText('');
    }
    return (
        <form onSubmit={onSubmit}>
            <input style={inputStyle}
               type="text"
               placeholder="Add Todo"
               value={text}
                onChange = {(e) => setText(e.target.value)}/>
            <button style={buttonStyle}>+</button>
        </form>
    )
}

export default AddTodo;