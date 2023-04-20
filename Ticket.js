const { v4: uuidv4 } = require('uuid');
const moment = require('moment');;

exports.default = class Ticket {
    constructor(name, description) {
        this.id = uuidv4();
        this.name = name;
        this.description = description;
        this.status = false;
        this.created = moment().format('DD.MM.YY hh:mm');
    }
}