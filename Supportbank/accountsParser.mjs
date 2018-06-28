import parse from 'csv-parse/lib/sync';

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

export default class {
    static parseCSV(file){
        let transactionArrays = parse(file);
        let transactions = convertTransactionsToClass(transactionArrays.slice(1));
        let accounts = addAccounts(transactions, []);
        addTransactions(transactions, accounts);
        processTransactions(accounts);
        return [transactions, accounts];
    }
};

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