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
let fileName = promptFileName();
let fileLocation = path.join(__dirname, fileName);
//Only continue if the file is found
if(fs.existsSync(fileLocation)){
    logger.info(`Dear diary, ooh, they're feeding me a file. It's called ${fileName} - that sounds tasty, I can't wait!`);
    let file = fs.readFileSync(fileLocation);
    var [transactions, accounts] = parseFile(fileLocation, fileName, file);
    if(validateData.validateTransactions(transactions)){
        console.log("File loaded");
        let requestedOperation = promptCommand(accounts);
        requestedOperation(); 
    }else{
        logger.error("Dear diary, I die. :-(");
        console.log("Transaction data not valid, see log file for details.");
    }
}else{
    logger.error(`File "${fileLocation}" not found, exiting.`);
}

function promptFileName(){
    let fileName = "";
    let command = readline.question("Enter a command: ");
    while (!command.startsWith("Import File")){
        console.log('Invalid command. Valid commands: "Import File"');
        command = readline.question("Enter a command: ");
    }
    fileName = command.slice(12);
    return fileName;
}

function promptCommand(accounts){
    
    let response = readline.question("Please enter a command:");
    if(response === "List All"){
        return () => accountActivities.printAccountList(accounts);
    }else if(response.startsWith("List ")){
        return () => accountActivities.printAccountDetails(accounts[response.slice(5)]);
    }else{
        console.log(`Invalid command, Valid commands are:
List All: Displays the name of each person, and the total amount they owe, or are owed.
List [Account]: Displays all information about an account.`);
    }
}

function parseFile(fileLocation, fileName, file){
    let fileExtension = fileName.split(".")[1];
    logger.info(`Dear diary, a ${fileExtension} file. How exciting!`);
    switch (fileExtension){
        case "csv":
            var [transactions, accounts] = accountsParser.parseCSV(file);
            break;
        case "json":
            var [transactions, accounts] = accountsParser.parseJSON(file);
            break;
        //case "xml":
        //    var [transactions, accounts] = accountsParser.parseXML(file);
        //    break;
        default:
            console.log(`File type '${fileExtension}' not supported.`);
            logger.error(`File "${fileLocation}" not a supported file type, exiting.`);
            process.exit(10);
    }
    return [transactions, accounts];
}

