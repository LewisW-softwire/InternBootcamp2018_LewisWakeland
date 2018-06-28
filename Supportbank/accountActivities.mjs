import Table from 'cli-table';

export default class {
    static printAccountList(accounts){
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
    
    static printAccountDetails(account){
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
};