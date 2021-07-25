function smallestCommons(arr) {
  const sort = arr.sort((a, b) => a -b);
  const max = sort[1], min = sort[0];
  let a = 0, b = 0, result = 0;
  while(result === 0){
     a += max;
     let isDivisible  = true;
     // b += min;
     while(b <= a && isDivisible){
       b += min;
       if(b === a){
         for(let i = min; i <= max; i++){
           if(a % i !== 0){
             isDivisible = false
           }
         }
         if(isDivisible){
            result = a;
         }
       }
       
     }
  }
  console.log(result)
  return result;
}


smallestCommons([2, 10]);
