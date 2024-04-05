import {CSSProperties} from "react";

export const buttonStyle:CSSProperties = {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '8px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px'
}

export const inputStyle:CSSProperties = {
    width: '80%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px'
}

export const centerDiv: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '500px',
    border: '1px solid grey',
    padding: '10px'
}