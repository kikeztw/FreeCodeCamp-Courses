function telephoneCheck(str) {
  const test = str.match(/^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/)
  return Boolean(test && test.length > 0);
}

console.log(telephoneCheck("555-5555"));