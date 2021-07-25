function rot13(str) {
  let result = '';
  let letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

  str.split('').forEach(c => {
    let currentLetterIndex = letters.indexOf(c);
    if(currentLetterIndex !== -1 ){
      // console.log(c, currentLetterIndex + 13, letters.length)
      let indextToFind = currentLetterIndex + 13 >=  letters.length ? 13 - (25 - currentLetterIndex + 1)  : currentLetterIndex + 13;
      result += letters[indextToFind]
      // console.log(`${c} - ${currentLetterIndex}  -`, letters[indextToFind])
    }else{
      result += c;
    }
  
  })

  return result;
}

rot13("SERR PBQR PNZC");
