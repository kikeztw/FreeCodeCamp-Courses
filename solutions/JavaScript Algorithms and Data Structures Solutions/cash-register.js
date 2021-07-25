const currencyAmount = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1,
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
 'ONE HUNDRED': 100 
}

const getAmountInCid = (cid) => {
  return Number(cid.map(x => x[1]).reduce((store, current) => store + current).toFixed(2));
}

function checkCashRegister(price, cash, cid) {
  let data = {
    change: [],
    status: '',
  };
  let cashToReturn = (cash - price);
  const amountInCid = getAmountInCid(cid);

  if(cashToReturn > amountInCid){
    return {
      status: 'INSUFFICIENT_FUNDS',
      change: []
    }
  }

  if(cashToReturn === amountInCid){
    return {
      status: 'CLOSED',
      change: cid
    }
  }

  cid.reverse().forEach(element => {
    const currency = element[0];
    let value = element[1];
    if(currencyAmount[currency] < cashToReturn && cashToReturn > 0){
      let result = 0;
      while(value > 0 && currencyAmount[currency] <= cashToReturn){
        cashToReturn -= currencyAmount[currency];
        cashToReturn = cashToReturn.toFixed(2);
        value -= currencyAmount[currency];
        result += currencyAmount[currency];
      }
      if(result > 0){
        data.change.push([currency, result])
      }
    }
  });

  if (cashToReturn > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  data.status = 'OPEN'
  return data;
}

console.log(
  checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])
);

      // console.log(`pass currency: ${currency} and value: ${currentValue} to return: ${cashToReturn}`);
