import moment from 'moment';
import log4js from 'log4js';
import path from 'path';

const logger = log4js.getLogger('index');

export default class{
    static validateTransactions(transactions){
        let valid = true;
        for(var index in transactions){
            let transaction = transactions[index];
            if(!moment(transaction.date, "YYYY-MM-DD").isValid()){
                //logger.error(`Invalid date for transaction on line ${parseInt(index)+2} with date: "${transaction.date}"`); //+2 for titles and 0 indexing
                logger.error(`Dear diary, line ${parseInt(index)+2}! That's not a date! Oh how it burns! Why, ${process.env['USERPROFILE'].split(path.sep)[2]}, why?!?`);
                valid = false;
            }
            if(isNaN(transaction.amount)){
                logger.error(`Dear diary, line ${parseInt(index)+2}! That's not a number! Oh how it burns! Why, ${process.env['USERPROFILE'].split(path.sep)[2]}, why?!?`);
                valid = false;
            }
        }
        return valid;
    }
}