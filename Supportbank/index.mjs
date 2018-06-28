'use strict'

import accountsParser from "./accountsParser.mjs";
//import readline from './node_modules/readline-sync';
//import readline from 'readline-sync';
import readline from 'readline-sync';
//const readline = require('readline-sync');
//const moment = require('moment');
import moment from 'moment';
//const fs = require('fs');
import fs from 'fs';
//const path = require('path');
import path from 'path';
//const parse = require('csv-parse/lib/sync');
import parse from 'csv-parse/lib/sync';
//const Table = require('cli-table');
import Table from 'cli-table';

class Account {
    constructor(name){
        this.name = name;
        this.transactions = [];
        this.balance = 0;
    }
}
class Transaction {
    constructor(date, from, to, narrative, amount){
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }
}

//Main program

let accounts = {};

let __dirname = path.resolve(path.dirname(''));
let fileLocation = path.join(__dirname, '/Transactions2014.csv')
//Only continue if the file is found
if(fs.existsSync(fileLocation)){
    let file = fs.readFileSync(fileLocation);
    let [transactions, accounts] = accountsParser.parseCSV(file);
    //let transactionArrays = parse(file);
    //let transactions = convertTransactionsToClass(transactionArrays.slice(1));
    //addAccounts(transactions, accounts);
    addTransactions(transactions, accounts);
    processTransactions(accounts);
    promptCommand(accounts);
}

function convertTransactionsToClass(transactionArrays){
    let transactions = [];
    transactionArrays.forEach(transaction => (transactions.push(new Transaction(
        transaction[0],
        transaction[1],
        transaction[2],
        transaction[3],
        transaction[4]))));
    return transactions;
}

function addAccounts(transactions, accounts){
    for (let i = 0; i<transactions.length; i++) {
        let transaction = transactions[i]
        //Add any accounts that appear in the From column and haven't already been added.
        if(!accounts.hasOwnProperty(transaction.from)){
            accounts[transaction.from] = new Account(transaction.from);
        }
        //Add any accounts that appear in the To column and haven't already been added.
        if(!accounts.hasOwnProperty(transaction.to)){
            accounts[transaction.to] = new Account(transaction.to);
        }
    }
    return accounts;
}

function addTransactions(transactions, accounts){
    for(let i = 0; i<transactions.length; i++){
        let transaction = transactions[i];
        accounts[transaction.from].transactions.push(transaction);
        accounts[transaction.to].transactions.push(transaction);
    }
}

function processTransactions(accounts){
    for(var name in accounts){
        let account = accounts[name];
        for(let i = 0; i<account.transactions.length; i++){
            let transaction = account.transactions[i];
            //Add or remove money from account based on transactions,
            //Values are stored as integers to avoid floating point precision issues.
            if(transaction.from === name){
                account.balance -= Math.round(parseFloat(transaction.amount)*100);
            }else if(transaction.to === name){
                account.balance += Math.round(parseFloat(transaction.amount)*100);
            }
        }
    }
}

function promptCommand(accounts){
    
    let response = readline.question("Please enter a command:");
    if(response === "List All"){
        printAccountList(accounts);
    }else if(response.startsWith("List ")){
        printAccountDetails(accounts[response.slice(5)]);
    }else{
        console.log(`Invalid command, Valid commands are:
List All: Displays the name of each person, and the total amount they owe, or are owed.
List [Account]: Displays all information about an account.`);
    }
}

function printAccountList(accounts){
    //Make a table so the output looks prettier
    let accTable = new Table({head: ["Name", "Balance"]});
    let details = [];
    //Put the relevent details into a seperate array so they can be easily added to the table
    for(var name in accounts){
        details.push([name, accounts[name].balance/100]); //Balance stored in pence
    }
    accTable.push.apply(accTable, details);
    console.log(accTable.toString());
}

function printAccountDetails(account){
    //Make a table so the output looks prettier
    let transTable = new Table({head: ["Date", "From", "To", "Narrative", "Ammount"]});
    let details = [];
    //Put the details into a seperate array so they can be easily added to the table
    for (var t in account.transactions){
        let transaction = account.transactions[t];
        details.push([transaction.date, transaction.from, transaction.to, transaction.narrative, transaction.amount]);
    }
    transTable.push.apply(transTable, details);
    console.log(transTable.toString());
}