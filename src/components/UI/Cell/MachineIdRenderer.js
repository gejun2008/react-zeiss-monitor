import React from 'react';
import { Link } from "react-router-dom";


const MachineIdRenderer = (props) => {
    const id = props.value;

    return (
        <div key={id}>
          <Link to={`/machines/${id}`}>{id}</Link>
        </div>
    )
}

export default MachineIdRenderer;