import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperatorButton from "./OperatorButton";
export const ACTIONS ={
  ADD_DIGIT: 'add-digit',
  CLEAR : 'clear-out',
  REMOVE_DIGIT: 'remove_digit',
  OPERANDS : 'operand',
  EVALUATION: 'evaluate-result'
}
const Int_format = new Intl.NumberFormat("en-IN",{maximumFractionDigits:0})
function formatOperand(operand){
  if(operand==null) return
  const [integer,decimal] = operand.split(".")
  if(decimal==null) return Int_format.format(integer)
  return `${Int_format.format(integer)}.${decimal}`
}
function reducer(state,{type,payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite==true){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit==="0" && state.currentOperand === "0") return state
      if(payload.digit==="." && state.currentOperand.includes(".")) return state
      return{
        ...state,
        currentOperand : `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.REMOVE_DIGIT:
      if(state.currentOperand=="" && state.previousOperand==null && state.operator==null) return state
      if(state.currentOperand==""){
        return{
          ...state,
          previousOperand:null,
          operator:null,
          currentOperand:state.previousOperand,
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.substring(0,state.currentOperand.length-1)
      }
    case ACTIONS.OPERANDS:
      if(state.currentOperand== null && state.previousOperand == null) return state
      if(state.currentOperand==""){
        return{
          ...state,
          operator : payload.operator
        }
      }
      if(state.previousOperand== null){
        return{
          ...state,
          previousOperand: state.currentOperand,
          operator: `${payload.operator}`,
          currentOperand: ""
        }
      }
      return{
        ...state,
        previousOperand: evaluate(state),
        operator : `${payload.operator}`,
        currentOperand: ""
      }
    case ACTIONS.EVALUATION:
      if(state.previousOperand == null|| state.currentOperand == ""|| state.operator ==null){
        return state
      }
      return {
        ...state,
        overwrite: true,
        currentOperand:evaluate(state),
        previousOperand: null,
        operator: null
      }
  }
}
function evaluate({currentOperand,previousOperand,operator}){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let res = ""
  switch(operator){
    case "+":
      res = prev+current
      break
    case "-":
      res= prev-current
      break
    case "÷":
      res = prev/current
      break
    case "*":
      res = prev*current
      break
  }
  return res.toString()
}
function App() {
  const [{currentOperand,previousOperand,operator},dispatch] = useReducer(reducer,{});
  return (
    <div className="calc-container">
      <div className='output'>
        <div className='previousOperand'>
        {formatOperand(previousOperand)} {operator}
        </div>
        <div className='currentOperand'>
          {formatOperand(currentOperand)}
        </div>
      </div>
      <div className="row-1">
      <button className='doubleBreadth' onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=>dispatch({type:ACTIONS.REMOVE_DIGIT})}>DEL</button>
      <OperatorButton operator="÷"dispatch={dispatch}></OperatorButton>
      </div>
      <div className="row-2">
      <DigitButton digit="1" dispatch={dispatch}></DigitButton>
      <DigitButton digit="2" dispatch={dispatch}></DigitButton>
      <DigitButton digit="3" dispatch={dispatch}></DigitButton>
      <OperatorButton operator="*"dispatch={dispatch}></OperatorButton>
      </div>
      <div className="row-3">
      <DigitButton digit="4" dispatch={dispatch}></DigitButton>
      <DigitButton digit="5" dispatch={dispatch}></DigitButton>
      <DigitButton digit="6" dispatch={dispatch}></DigitButton>
      <OperatorButton operator="+"dispatch={dispatch}></OperatorButton>
      </div>
      <div className="row-4">
      <DigitButton digit="7" dispatch={dispatch}></DigitButton>
      <DigitButton digit="8" dispatch={dispatch}></DigitButton>
      <DigitButton digit="9" dispatch={dispatch}></DigitButton>
      <OperatorButton operator="-"dispatch={dispatch}></OperatorButton>
      </div>
      <div className="row-5">
      <DigitButton digit="." dispatch={dispatch}></DigitButton>
      <DigitButton digit="0" dispatch={dispatch}></DigitButton>
      <button className='doubleBreadth' onClick={()=>dispatch({type:ACTIONS.EVALUATION})}>=</button>
      </div>
    </div>
  );
}

export default App;
