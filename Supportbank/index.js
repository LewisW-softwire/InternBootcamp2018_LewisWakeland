const readline = require('readline-sync');
const moment = require('moment');
const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

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

let accounts = {};

let fileLocation = path.join(__dirname, '/Transactions2014.csv')
if(fs.existsSync(fileLocation)){
    let file = fs.readFileSync(fileLocation);
    let transactionArrays = parse(file);
    let transactions = convertTransactionsToClass(transactionArrays.slice(1));
    addAccounts(transactions, accounts);
    addTransactions(transactions, accounts);
    processTransactions(accounts);
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
        transaction = transactions[i]
        //Add any accounts that appear in the From column and haven't already been added.
        if(!accounts.hasOwnProperty(transaction.from)){
            accounts[transaction.from] = new Account(transaction.from);
        }
        //Add any accounts that appear in the To column and haven't already been added.
        if(!accounts.hasOwnProperty(transaction.to)){
            accounts[transaction.to] = new Account(transaction.to);
        }
    }
}

function addTransactions(transactions, accounts){
    for(let i = 0; i<transactions.length; i++){
        let transaction = transactions[i];
        accounts[transaction.from].transactions.push(transaction);
        accounts[transaction.to].transactions.push(transaction);
    }
}

function processTransactions(accounts){
    for(name in accounts){
        account = accounts[name];
        for(let i = 0; i<account.transactions.length; i++){
            transaction = account.transactions[i];
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