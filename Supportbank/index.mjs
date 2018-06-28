'use strict'

import accountsParser from "./accountsParser.mjs";
import accountActivities from "./accountActivities.mjs";
import validateData from "./validateData.mjs";
import readline from 'readline-sync';
import fs from 'fs';
import path from 'path';
import log4js from 'log4js';
import moment from 'moment';

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});
const logger = log4js.getLogger('index');

//-----Main program-----
logger.info(`Dear diary, the user started running me at ${moment.now()}. They seem nice, I think we'll get along.`);
let __dirname = path.resolve(path.dirname(''));
let fileName = '/Transactions2014.csv';
let fileLocation = path.join(__dirname, fileName);
//Only continue if the file is found
if(fs.existsSync(fileLocation)){
    logger.info(`Dear diary, ooh, she's feeding me a file. It's called ${fileName} - that sounds tasty, I can't wait!`);
    let file = fs.readFileSync(fileLocation);
    let [transactions, accounts] = accountsParser.parseCSV(file);
    if(validateData.validateTransactions(transactions)){
        promptCommand(accounts);
    }else{
        logger.error("Dear diary, I die. :-(");
        console.log("Transaction data not valid, see log file for details.");
    }
}else{
    logger.error(`File "${fileLocation}" not found, exiting.`);
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

