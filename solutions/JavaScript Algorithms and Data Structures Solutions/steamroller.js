function steamrollArray(arr) {
  let result = [];

  function a(arr){
    if(!Array.isArray(arr)){
      result.push(arr)
      return;
    }
    for(let i = 0; i < arr.length; i++){
      a(arr[i]);
    }
  }

  a(arr);
  return result;
}

console.log(steamrollArray([1, [2], [3, [[4]]]]))
