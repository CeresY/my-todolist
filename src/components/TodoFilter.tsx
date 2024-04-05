import {CSSProperties} from "react";
import { buttonStyle} from "@/styles"

const divStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
}

function TodoFilter({setFilter}:any) {
  return (
    <div style={divStyle}>
      <button style={{...buttonStyle, backgroundColor: '#2196f3'}} onClick={() => setFilter()}>All</button>
      <button style={buttonStyle} onClick={() => setFilter('active')}>Active</button>
      <button style={{...buttonStyle, backgroundColor: '#c3c6c7'}} onClick={() => setFilter('completed')}>Completed</button>
    </div>
  );
}

export default TodoFilter;