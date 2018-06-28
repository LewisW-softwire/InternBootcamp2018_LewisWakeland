'use strict'

import accountsParser from "./accountsParser.mjs";
import accountActivities from "./accountActivities.mjs";
import readline from 'readline-sync';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

//Main program

let __dirname = path.resolve(path.dirname(''));
let fileLocation = path.join(__dirname, '/Transactions2014.csv')
//Only continue if the file is found
if(fs.existsSync(fileLocation)){
    let file = fs.readFileSync(fileLocation);
    let [transactions, accounts] = accountsParser.parseCSV(file);
    promptCommand(accounts);
}

function promptCommand(accounts){
    
    let response = readline.question("Please enter a command:");
    if(response === "List All"){
        accountActivities.printAccountList(accounts);
    }else if(response.startsWith("List ")){
        accountActivities.printAccountDetails(accounts[response.slice(5)]);
    }else{
        console.log(`Invalid command, Valid commands are:
List All: Displays the name of each person, and the total amount they owe, or are owed.
List [Account]: Displays all information about an account.`);
    }
}

