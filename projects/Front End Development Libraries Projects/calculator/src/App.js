import { useCallback, useState } from "react"

const Display = ({
  formula,
  display
}) => (
  <div className="display-container">
    <div className="display-formula">
      {formula}
    </div>
    <div id="display" className="display-result"> 
      {display}
    </div>
  </div>
)

const CalculatorButtons = ({
  evaluate,
  operators,
  numbers,
  decimal,
  initialize
}) => {
  return(
    <div className="calculator-buttons">
      <div id="clear" className="item item-1 reset-button" onClick={initialize}>AC</div>
      <div
        id="divide"
        className="item item-2 operator-color"
        onClick={operators}>
         /
      </div>
      <div 
        id="multiply"
        className="item item-3 operator-color"
        onClick={operators}>
          X
      </div>
      <div 
        id="seven"
        onClick={numbers}
        className="item item-4 number-color">7</div>
      <div 
        id="eight"
        onClick={numbers}
        className="item item-5 number-color">8</div>
      <div 
        id="nine"
        onClick={numbers}
        className="item item-6 number-color">9</div>
      <div 
        id="subtract"
        className="item item-7 operator-color"
        onClick={operators}>
        -
      </div>
      <div 
        id="four"
        onClick={numbers}
        className="item item-8 number-color">4</div>
      <div
        id="five"
        onClick={numbers}
        className="item item-9 number-color">5</div>
      <div 
        id="six"
        onClick={numbers}
        className="item item-10 number-color">6</div>
      <div 
        id="add"
        className="item item-11 operator-color" 
        onClick={operators}>
          +
      </div>
      <div 
        id="one"
        onClick={numbers}
        className="item item-12 number-color">1</div>
      <div 
        id="two"
        onClick={numbers}
        className="item item-13 number-color">2</div>
      <div 
        id="three"
        onClick={numbers}
        className="item item-14 number-color">3</div>
      <div 
        id="equals"
        className="item item-15 equal-operator" 
        onClick={evaluate}>
          =
      </div>
      <div 
        id="zero"
        onClick={numbers}
        className="item item-16 number-color" >0</div>
      <div 
        id="decimal"
        className="item item-17 number-color"
        onClick={decimal}>.</div>
    </div>
  )
}

const endsWithOperator = /[x+/-]$/;
const endsWithNegativeSign = /\d[x/+‑]{1}‑$/;
const isOperator = /[x/+‑]/;



const App = () => {
  const [currentValue, setCurrentValue] = useState('0');
  const [prevVal, setPrevVal] = useState('0');
  const [formula, setFormula] = useState('');
  const [evaluated, setEvaluated] = useState(false);

  const maxDigitWarning = useCallback(() => {
    setCurrentValue('Digit Limit Met');
    setPrevVal(currentValue);
    setTimeout(() => {
      setCurrentValue(
        prevVal
      )
    }, 1000);
  }, [currentValue, prevVal]);


  const handleValue = useCallback(() => {
    if(currentValue.includes('Limit')){
      return;
    }
    let expression = formula;
    while (endsWithOperator.test(expression)) {
      expression = expression.slice(0, -1);
    }
    expression = expression
        .replace(/x/g, '*')
        .replace(/‑/g, '-')
        .replace('--', '+0+0+0+0+0+0+');
    // eslint-disable-next-line no-eval
    const answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
    setCurrentValue(answer.toString());
    setFormula(
      expression
      .replace(/\*/g, '⋅')
      .replace(/-/g, '‑')
      .replace('+0+0+0+0+0+0+', '‑-')
      .replace(/(x|\/|\+)‑/, '$1-')
      .replace(/^‑/, '-') +
      '=' +
      answer
    )
    setPrevVal(answer);
    setEvaluated(true);

  }, [currentValue, formula, ]);

  const handleOperators = useCallback((e) => {
    if(currentValue.includes('Limit')){
      return;
    }
    const value = e.target.innerText.toLowerCase();
    setCurrentValue(value);
    setEvaluated(false);
    if(evaluated){
      setFormula(prevVal + value);
    }else if (!endsWithOperator.test(formula)) {
      setFormula(formula + value);
      setPrevVal(formula);
    } else if(!endsWithNegativeSign.test(formula)){
      console.log(formula);
      console.log(prevVal);
      setFormula(
        (value === '-' ? formula : prevVal) + value
      )
    }else if(value !== '-'.toUpperCase()){
      setFormula(
        prevVal + value
      )
    }

  }, [currentValue, formula, prevVal, evaluated]);

  const handleDecimal = useCallback(() => {
    console.log(currentValue)
    if(evaluated === true){
      setCurrentValue('0.');
      formula('0.');
      setEvaluated(false);
    }else if (
      !currentValue.includes('.') && 
      !currentValue.includes('Limit')
  ){
      setEvaluated(false);
      if(currentValue.length > 21){
        maxDigitWarning();
      }else if (
        endsWithOperator.test(formula) || 
        (currentValue === '0' && formula === '')
      ){
        setCurrentValue('0.');
        setFormula(formula + '0.');
      }else{
        setCurrentValue(
          formula.match(
            /(-?\d+\.?\d*)$/
          )[0] + '.'
        );
        setFormula(
          formula + '.'
        )
      }
    }
  }, [evaluated, maxDigitWarning, formula, currentValue]);

  const handleNumbers = useCallback((e) => {
    if(currentValue.includes('Limit')){
      return;
    }
    const value = e.target.innerText;
    setEvaluated(false);
    if(currentValue.length > 21){
      handleDecimal();
    }else if (evaluated){
      setCurrentValue(value);
      setFormula(value !== '0' ? value : '')
    }else{
      setCurrentValue(
        currentValue === '0' || isOperator.test(currentValue)
              ? value
              : currentValue + value,
      )
      setFormula(
        currentValue === '0' && value === '0'
              ? formula === ''
                ? value
                : formula
              : /([^.0-9]0|^0)$/.test(formula)
              ? formula.slice(0, -1) + value
              : formula + value
      )
    }
  }, [currentValue, formula, evaluated, handleDecimal]);

  const initialize = useCallback(() => {
    setCurrentValue('0');
    setPrevVal('0');
    setFormula('');
    setEvaluated(false);
  }, []);

  return(
    <div className="container">
      <div className="calculator">
        <Display
          formula={formula.replace(/x/g, '⋅')}
          display={currentValue}
        />
        <CalculatorButtons
          evaluate={handleValue}
          operators={handleOperators}
          numbers={handleNumbers}
          decimal={handleDecimal}
          initialize={initialize}
        />
      </div>
    </div>
  )
}


export default App;
