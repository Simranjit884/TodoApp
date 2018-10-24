import React from 'react';

const App=(props)=>{
  return (
    <div>
    <h1>{props.value}</h1>
    <button onClick={props.OnIncrement}>+</button>
    <button onClick={props.OnDecrement}>-</button>
    </div>
    );
};
export default App;
