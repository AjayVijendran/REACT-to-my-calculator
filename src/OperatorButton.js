import { ACTIONS } from "./App";

export default function({operator,dispatch}){
    return <button onClick={()=>dispatch({type:ACTIONS.OPERANDS,payload:{operator}})}>{operator}</button>
}