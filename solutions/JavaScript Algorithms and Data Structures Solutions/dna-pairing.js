const pair = {
  A: 'T',
  T: 'A',
  C: 'G',
  G: 'C'
};

function pairElement(str) {
  return str.split('').map(e => [e, pair[e.toUpperCase()]]);
}

console.log(pairElement("GCG"));
