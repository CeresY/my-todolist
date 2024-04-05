import {CSSProperties, useState} from "react";
import { buttonStyle} from "@/styles"

const divStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
}


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
          style={{...buttonStyle, backgroundColor: focus === 'all' || focus === '' ? '#4caf50':'#c3c6c7'}}
          onClick={() => handClick('all')}>All</button>
      <button
          style={{...buttonStyle, backgroundColor: focus === 'active' ? '#4caf50':'#c3c6c7'}}
          onClick={() => handClick('active')}>Active</button>
      <button
          style={{...buttonStyle, backgroundColor: focus === 'completed' ? '#4caf50':'#c3c6c7'}}
          onClick={() => handClick('completed')}>Completed</button>
    </div>
  );
}

export default TodoFilter;