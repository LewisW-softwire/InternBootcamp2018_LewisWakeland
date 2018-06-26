const readline = require('readline-sync');

console.log('How many values should be printed:');
let iterations = readline.prompt();

//Define basic rules
var rules = {3: 'Fizz',
             5: 'Buzz',
             7: 'Bang'}

//Add command line arguments to rules
for(let i = 2; i<process.argv.length; i+=2){
    rules[process.argv[i]] = process.argv[i+1]; //Numbers in even arguments, strings in odd arguments
}

for(var i = 1; i<=iterations; i++){
    let output = [];

    for(num in rules){ // All simple appending rules
        if(i%num === 0){
            output.push(rules[num]);
        }
    }

    if(i%11 === 0){ //Bong replaces any previous items
        output = ['Bong'];
    }
    if(i%13 === 0){ //Fezz goes immediately in front of the first item beginning with a B, and is printed even when Bong is present
        let fezzLocation = getFezzLocation(output);
        output.splice(fezzLocation, 0, 'Fezz');
        
    }
    if(i%17 === 0){ //Reverse the order of the words
        output.reverse();
    }
    if(output.length === 0){
        output.push(i).toString();
    }
    console.log(`${i}: ${output.join("")}`);
}

//Returns the location of 'Fezz' within an array based on the following rule:
//Fezz goes immediately in front of the first thing beginning with B, or at the end if there are none.
function getFezzLocation(output){
    for(let j = 0; j<output.length; j++){
        var fezzLocation;
        if(output[j].charAt(0).toUpperCase() === 'B'){
            fezzLocation = j;
            break;
        }
    }
    if (fezzLocation === undefined){ //Add Fezz after the last item if no item starts with B
        fezzLocation === output.length;
    }
    return fezzLocation;
}