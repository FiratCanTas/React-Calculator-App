import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./style.css"

export const ACTIONS = {

  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

//action degerini direkt destructing yaptim type ve payload i aldim boylece action.type gibi kullanimlara gerek kalmadi 
const reducer = (state, {type, payload})=> {

  switch (type) {
    case ACTIONS.ADD_DIGIT:

      if (state.overwrite) {
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }

      //Mevcut deger(currentOperand) zaten 0 ise daha fazla 0 girilemesin
      if(payload.digit === '0' && state.currentOperand === '0' ) {
        return state
      }
      //Bir sayi degeri icerisinde yalnizca 1 defa '.' kullanilabilsin
      if(payload.digit === '.' && state.currentOperand.includes('.')) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}` 
      }

      case ACTIONS.CHOOSE_OPERATION:
        //Hicbir sayi girisi olmadan islem secilmeye kalkilirsa
        if (!state.currentOperand && !state.previousOperand) {
          return state
        } 

        //Mevcut deger yoksa prev degerin onundeki islem isareti degisebilsin
        if (!state.currentOperand) {
          return{
            ...state,
            operation: payload.operation
          }
        }
        
        //Henuz ilk deger girilecekse ve islem secilecekse
        if (!state.previousOperand) {
          return{
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null
          }
        }
         
        //Eger iki degerde mevcutsa prev deki degerle suanki degeri secili operation ile isleme sok
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }


      case ACTIONS.DELETE_DIGIT:
        //Eger sonuc verilmisse currentOperand ortadan kaldirip degeri tamamen siliyoruz
        if (state.overwrite) {
          return{
            ...state,
            overwrite: false,
            currentOperand:null
          }
        }

        //Hicbir deger yoksa state  i don 
        if (!state.currentOperand) {
          return state
        }

        //1 basamakli sayiysa tamamen ortadan kaldir
        if (state.currentOperand.length === 1) {
          return {
            ...state,
            currentOperand: null
          }
        }

        //Diger ihtimallerde sayinin son basamagini kaldir
        return{
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }

      case ACTIONS.EVALUATE:
        if (!state.operation || !state.currentOperand || !state.previousOperand) {
          return state
        }

        return{
          ...state,
          overwrite: true, //her esittire basilip sonuc getirildiginde currentOperand ustune sonuc degeri gelecek 
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state)
        }
      
      case ACTIONS.CLEAR:
        return {}
        
        
      default:
        return state

  }

}

const evaluate = ({currentOperand, previousOperand, operation})=>{
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) {
    return ' '
  }
  let result = ""

  switch (operation) {
    case '+':
      result = prev + current
      break;
    case '-':
      result = prev - current
      break;
    case '*':
      result = prev * current
      break;
    case '÷':
      result = prev / current
      break;

    default:
      break;
  }

  return result.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0})


const formatOperand = (operand)=>{
  if (!operand) {
    return
  }
  const [integer, decimal] = operand.split('.')

  if (!decimal) {
    return INTEGER_FORMATTER.format(integer)
  }

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  
  const [{ currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
    
      {/* Output Started */}
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      {/* Output Completed */}

      {/* Buttons Started */}
        <button className="span-two" onClick={()=> dispatch({type: ACTIONS.CLEAR})} > AC </button>
        <button onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT})} > DEL </button>
        <OperationButton operation='÷' dispatch={dispatch} />

        <DigitButton digit='1' dispatch={dispatch} />
        <DigitButton digit='2' dispatch={dispatch} />
        <DigitButton digit='3' dispatch={dispatch} />

        <OperationButton operation='*' dispatch={dispatch} />

        <DigitButton digit='4' dispatch={dispatch} />
        <DigitButton digit='5' dispatch={dispatch} />
        <DigitButton digit='6' dispatch={dispatch} />

        <OperationButton operation='+' dispatch={dispatch} />

        <DigitButton digit='7' dispatch={dispatch} />
        <DigitButton digit='8' dispatch={dispatch} />
        <DigitButton digit='9' dispatch={dispatch} />

        <OperationButton operation='-' dispatch={dispatch} />

        <DigitButton digit='.' dispatch={dispatch} />
        <DigitButton digit='0' dispatch={dispatch} />

        <button className='span-two' onClick={()=> dispatch({ type:ACTIONS.EVALUATE })}>=</button>
      {/* Buttons Completed */}
    </div>
  );
}

export default App;
