import {CSSProperties, useState} from "react";
import { buttonStyle} from "@/styles/styles"

const divStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
}

const activeColor = '#4caf50', inactiveColor = '#c3c6c7';

function TodoFilter({setFilter}:any) {
    const [focus, setFocus] = useState<string>('')
    const handClick = (value: string) => {
        // e.currentTarget.style.backgroundColor = '#4caf50'
        setFocus(value)
        setFilter(value)
    }
  return (
    <div style={divStyle}>
      <button
          style={{...buttonStyle, backgroundColor: focus === 'all' || focus === '' ? `${activeColor}`:`${inactiveColor}`}}
          onClick={() => handClick('all')}>All</button>
      <button
          style={{...buttonStyle, backgroundColor: focus === 'active' ? `${activeColor}`:`${inactiveColor}`}}
          onClick={() => handClick('active')}>Active</button>
      <button
          style={{...buttonStyle, backgroundColor: focus === 'completed' ? `${activeColor}`:`${inactiveColor}`}}
          onClick={() => handClick('completed')}>Completed</button>
    </div>
  );
}

export default TodoFilter;