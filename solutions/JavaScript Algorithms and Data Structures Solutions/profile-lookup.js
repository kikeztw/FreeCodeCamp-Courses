// Setup
var contacts = [
    {
        "firstName": "Akira",
        "lastName": "Laine",
        "number": "0543236543",
        "likes": ["Pizza", "Coding", "Brownie Points"]
    },
    {
        "firstName": "Harry",
        "lastName": "Potter",
        "number": "0994372684",
        "likes": ["Hogwarts", "Magic", "Hagrid"]
    },
    {
        "firstName": "Sherlock",
        "lastName": "Holmes",
        "number": "0487345643",
        "likes": ["Intriguing Cases", "Violin"]
    },
    {
        "firstName": "Kristian",
        "lastName": "Vos",
        "number": "unknown",
        "likes": ["JavaScript", "Gaming", "Foxes"]
    }
];


function lookUpProfile(name, prop){
    // Only change code below this line
    let result = contacts.filter(e => e.firstName === name).map(e => {
        if(e.firstName === name && e[prop]){
            return e[prop];
        }
        if(!e[prop]){
            return 'No such property'
        }
    })

    return result.length ? result[0] : 'No such contact';
// Only change code above this line
}

console.log(lookUpProfile("Akira", "address"));