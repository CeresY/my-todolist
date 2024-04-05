import {CSSProperties, useRef, useState} from "react";
import { buttonStyle} from "@/styles"

const divStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
}


function TodoFilter({setFilter}:any) {
    const bt1 = useRef(null);
    const bt2 = useRef(null);
    const bt3 = useRef(null);
    const style1: CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#c3c6c7'
    }
    //     backgroundColor: '#4caf50',
    const handClick = (value?: string) => {
        // e.currentTarget.style.backgroundColor = '#4caf50'
        const bt1Obj:any = bt1.current!;
        const bt2Obj:any = bt2.current!;
        const bt3Obj:any = bt3.current!;

        bt1Obj.style.backgroundColor = '#c3c6c7'
        bt2Obj.style.backgroundColor = '#c3c6c7'
        bt3Obj.style.backgroundColor = '#c3c6c7'
        if (value === 'active') {
            setFilter(value)
            bt2Obj.style.backgroundColor = '#4caf50'
        } else if (value === 'completed') {
            setFilter(value)
            bt3Obj.style.backgroundColor = '#4caf50'
        } else {
            setFilter()
            bt1Obj.style.backgroundColor = '#4caf50'
        }
    }
  return (
    <div style={divStyle}>
      <button ref={bt1}
          style={style1}
          onClick={() => handClick()}>All</button>
      <button ref={bt2}
          style={style1}
          onClick={() => handClick('active')}>Active</button>
      <button ref={bt3}
          style={style1}
          onClick={() => handClick('completed')}>Completed</button>
    </div>
  );
}

export default TodoFilter;