import * as path from 'path';
import * as express from 'express';
import * as serveIndex from 'serve-index';
import { createServer } from 'http';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';

// Import demo room handlers

import { StateHandlerRoom } from "./rooms/snipper";


const port = Number(process.env.PORT || 2567);
const app = express();

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  server: createServer(app)
});


// Register StateHandlerRoom as "state_handler"
gameServer.register("state_handler", StateHandlerRoom);



app.use('/', express.static(path.join(__dirname, "static")));
app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))

// (optional) attach web monitoring panel
app.use('/colyseus', monitor(gameServer));

gameServer.onShutdown(function(){
  console.log(`game server is going down.`);
});

gameServer.listen(port,"192.168.10.83");
console.log(`Listening on http://localhost:${ port }`);
