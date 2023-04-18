const http = require('http');
const Koa = require('koa');
const {koaBody} = require('koa-body');
const Ticket = require('./Ticket').default;

const app = new Koa();

const tickets = [];

app.use(koaBody({
    urlencoded: true,
    multipart: true,
}));

app.use((ctx, next) => {
    if (ctx.request.method !== 'OPTIONS') {
      next();
  
      return;
    }
  
    ctx.response.set('Access-Control-Allow-Origin', '*');
  
    ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
  
    ctx.response.status = 204;
});

// middleware отправляет на Front массив Тикетов по URL запросу ?method=allTickets
app.use((ctx, next) => {
    if(ctx.request.method !== 'GET') {
        next();
        return;
    }

    if(ctx.request.query.method === 'allTickets') {
        ctx.response.status = 200;
        ctx.response.set('Access-Control-Allow-Origin', '*');
        ctx.response.body = JSON.stringify(tickets);
    }

    next();
});

// middleware добавляет в массив новый тикет 
app.use((ctx, next) => {
    if (ctx.request.method !== 'POST') {
      next();
      return;
    }
    
    const { name, description } = ctx.request.body;
    ctx.response.set('Access-Control-Allow-Origin', '*');
    const ticket = new Ticket(name, description)
    tickets.push(ticket);
  
    ctx.response.body = 'OK';
  
    next();
});
// middleware удаляет из массива Тикетов 
app.use((ctx, next) => {
    if(ctx.request.method !== 'DELETE' && ctx.request.query.method !== 'ticketById') {
        next();
        return;
    }

    const deletedTicketId = ctx.request.query.id;
    const deletedTicketIndex = tickets.findIndex(el => el.id === deletedTicketId);

    if (deletedTicketIndex >= 0) {
        tickets.splice(deletedTicketIndex, 1);
    }

    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.body = 'OK';
  
    next()
})


const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, (err) => {
    if (err) {
        console.log(err);

        return
    }

    console.log('server is listening to ' + port);
});