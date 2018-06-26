
for(var i = 1; i<=1000; i++){
    let output = [];
    if(i%3 === 0){ //Simple appending of words
        output.push('Fizz');
    }
    if(i%5 === 0){
        output.push('Buzz');
    }
    if(i%7 === 0){
        output.push('Bang');
    }
    if(i%11 === 0){ //Bong replaces any previous items
        output = ['Bong'];
    }
    if(i%13 === 0){ //Fezz goes immediately in front of the first item beginning with a B, and is printed even when Bong is present
        for(let j = 0; j<output.length; j++){
            if(output[j].charAt(0).toUpperCase() === 'B'){
                output.splice(j, 0, 'Fezz');
                break;
            }
            if(j === output.length-1){
                output.push('Fezz');
                break;
            }
        }
    }
    if(i%17 === 0){ //Reverse the order of the words
        output.reverse();
    }
    if(output.length === 0){
        output.push(i).toString();
    }
    console.log(`${i}: ${output.join("")}`);
}