import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/*import App from './components/App';
//import counter from './reducers/index';
//import {createStore} from 'redux';


const store=createStore(counter);

const render=()=>{
ReactDOM.render(
    <App 
    value={store.getState()} 
    OnIncrement={()=>store.dispatch({type:'INCREMENT'})}
    OnDecrement={()=>store.dispatch({type:'DECREMENT'})}
    />,
     document.getElementById('root'));
}
store.subscribe(render);
render();
*/
import expect from 'expect';
import deepFreeze from 'deep-freeze';
import {createStore} from 'redux';
import {combineReducers} from 'redux';
/*
const addCounter=(list)=>{
    return [...list, 0];
}

const testAddCounter=()=>{
    const listbefore=[];
    const listAfter=[0];
    deepFreeze(listbefore);
    expect(
        addCounter(listbefore)
    ).toEqual(listAfter);
};

const removecounter=(list,index)=>{
    return [...list.slice(0,index),...list.slice(index+1)];
}
const testRemovecounter=()=>{
    const listbefore=[0,10,20];
    const listAfter=[0,20];
    deepFreeze(listbefore);
        expect(
            removecounter(listbefore,1)
        ).toEqual(listAfter);
};

const incrementcounter=(list,index)=>{
     return [...list.slice(0,index),list[index]+1,...list.slice(index+1)];
}
const testIncrementcounter=()=>{
    const listbefore=[0,10,20];
    const listafter=[0,11,20];
    deepFreeze(listbefore);
    expect(
        incrementcounter(listbefore,1)
    ).toEqual(listafter);
}
testIncrementcounter();*/

const todo=(state,action)=>{
    switch(action.type){
        case 'ADD_TODO':
        return {
            id:action.id,
            text:action.text,
            completed:false
        };
        case 'TOGGLE_TODO':
        if(state.id!==action.id)
                return state;

            return {
                ...state,
                completed:!state.completed
            };
        default:
        return state;
        }
    };

const todos=(state=[],action)=>{
    switch(action.type){
        case 'ADD_TODO':
        return [
            ...state,
            todo(undefined,action)
        ];
        case 'TOGGLE_TODO':
        return state.map(t=>todo(t,action));
        default:
        return state;
    }
}

const testtodoapp=()=>{
const statebefore=[];
const action={
    id:0,
    type:'ADD_TODO',
    text:'Learn Redux'
};
const stateafter=[
    {
        id:0,
        text:'Learn Redux',
        completed:false
    }
];
deepFreeze(statebefore);
expect(
    todos(statebefore,action)
).toEqual(stateafter);
}

const toggleToDo=()=>{
    const stateBefore=[{
        id:0,
        text:'Learn Redux',
        completed:false
    },
    {
        id:1,
        text:'Learn Node',
        completed:false
    }
];  
    const action={
        type:'TOGGLE_TODO',
        id:0,
    };
    const stateAfter=[{
        id:0,
        text:'Learn Redux',
        completed:true
    },
    {
        id:1,
        text:'Learn Node',
        completed:false
    }
];
deepFreeze(stateBefore);
expect(
    todos(stateBefore,action)
).toEqual(stateAfter);
}
testtodoapp();
toggleToDo();
console.log("all test passed");

const visibilityFilter=(state='SHOW_ALL',action)=>{
    switch(action.type){
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
          return state;
    }
};
//This is an alternative method for combineReducers.
/*
const todoApp=(state={},action)=>{
    return {
        todos:todos(state.todos,action),
        visibilityFilter:visibilityFilter(state.visibilityFilter,action)
    };
};
*/
const todoApp=combineReducers({
    todos,
    visibilityFilter
});

const store=createStore(todoApp);

const FilterLink=({filter,children,currentFilter})=>{
    if(filter===currentFilter){
        return <span> {children}</span>;
    }
    return (
        <a href='#'
            onClick={e=>{
                e.preventDefault();
                store.dispatch({
                    type:'SET_VISIBILITY_FILTER',
                    filter
                });
            }}
        >
        {children}
        </a>
    );
};

const getVisibleTodos=(todos,filter)=>{
    switch(filter){
        case 'SHOW_ALL':
        return todos;
        case 'SHOW_ACTIVE':
        return todos.filter(
            t=>!t.completed
            );
        case 'SHOW_COMPLETED':
        return todos.filter(
            t=>t.completed
        );
    };
};

let nextTodoId=0;
class TodoApp extends Component{
    render(){
        const {todos,visibilityFilter}=this.props;
        const visibleTodos=getVisibleTodos(
            todos,
            visibilityFilter
        );
        return (
        <div>
                <input ref={node=>{
                    this.input=node;
                }} />
                <button onClick={()=>{
                    store.dispatch({
                        type:'ADD_TODO',
                        text:this.input.value,
                        id:nextTodoId++
                    });
                    this.input.value='';
                }}>
                Add Todo
                </button>
            <ul>
                {visibleTodos.map(todo=>
                        <li key={todo.id}
                            onClick={()=>{
                                store.dispatch({
                                    type:'TOGGLE_TODO',
                                    id:todo.id
                                });
                            }}
                            style={{textDecoration:todo.completed?'line-through':'none'}}>
                        {todo.text}
                        </li>
                    )}
            </ul>
            <p>
                Show:
                {' '}
                <FilterLink
                    filter='SHOW_ALL'
                    currentFilter={visibilityFilter}
                >
                All
                </FilterLink>
                {' '}
                <FilterLink
                    filter='SHOW_ACTIVE'
                    currentFilter={visibilityFilter}
                >
                Active
                </FilterLink>
                {' '}
                <FilterLink
                    filter='SHOW_COMPLETED'
                    currentFilter={visibilityFilter}
                >
                completed
                </FilterLink>
            </p>
        </div>
        );
    }
}

const render=()=>{
    ReactDOM.render(
        <TodoApp
        todos={store.getState().todos} 
        visibilityFilter={store.getState().visibilityFilter}
        />,
        document.getElementById('root')
    );
};
store.subscribe(render);
render();
/*console.log(store.getState());
store.dispatch({
    type:'ADD_TODO',
    id:0,
    text:'Learn Redux'
});
console.log(store.getState());
store.dispatch({
    type:'SET_VISIBILITY_FILTER',
    filter:'SHOW_COMPLETED'
});
console.log(store.getState());
*/