import {Room, EntityMap, Client, nosync, generateId} from "colyseus";
//import { ACTIONS } from '../constants/constants';
var Victor = require('victor');


export class State {
    players: EntityMap<Player> = {};
    bullet: EntityMap<Bullet> = {};


    @nosync
    something = "This attribute won't be sent to the client-side";

    createPlayer(id: string, spwanIndex, buildingNam) {
        this.players[id] = new Player();
        this.players[id].spawnIndex = spwanIndex;
        this.players[id].buildingName = buildingNam;


    }

    removePlayer(id: string) {
        delete this.players[id];
    }

    movePlayer(id: string, movement: any) {
        if (movement.x) {
            this.players[id].x = movement.x;
        } else if (movement.y) {
            this.players[id].y = movement.y;
        }
    }

    fireBullet(clientid, bullet) {
        let id=generateId();
        this.bullet[id] = new Bullet();
        this.bullet[id].player = clientid;
        this.bullet[id].angle=bullet.angle;
        this.bullet[id].x=bullet.x;
        this.bullet[id].y=bullet.y
    }
    updateBullets(){
        
        // spdX = Math.cos(param.angle/180*Math.PI) * 10;
        // spdY = Math.sin(param.angle/180*Math.PI) * 10;
    }

    static distance(a, b) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }

    update(){


        for (let bullet in this.bullet ){

            let self=this.bullet[bullet];
            console.log(bullet);

            const dst = State.distance(self, this.players[self.player]);
            console.log("dst :: ",dst);
            let speed = (dst < 20) ? 0 : Math.min(dst / 15, 4);
            console.log("speed :: ",speed);

            self.x-= (Math.cos(self.angle));
            self.y-= (Math.cos(self.angle));
            if (self.x > 1000 || self.y > 1000 ){
                delete this.bullet[bullet]
            }
        }
        // entity.x -= (Math.cos(entity.angle)) * entity.speed;
        // entity.y -= (Math.sin(entity.angle)) * entity.speed;
    }
}

export class Player {
    spawnIndex = -1;
    buildingName = "Nothing";
    x = Math.floor(Math.random()*300);
    y = Math.floor(Math.random()*300);

}

export class Bullet {
    angle = 0;
    x = 0.0;
    y = 0.0;
    player = "abc"

}

export class StateHandlerRoom extends Room<State> {
    spwanningIndex = {
        "BUILDING_0": {'available': true, "index": 0},
        "BUILDING_1": {'available': true, "index": 1},
        "BUILDING_2": {'available': true, "index": 2},
        "BUILDING_3": {'available': true, "index": 3},
        "BUILDING_4": {'available': true, "index": 4},
    };

    onInit(options) {
        console.log("StateHandlerRoom created!", options);

        this.setState(new State());
        //this.setSimulationInterval(() => this.state.update());
    }
    onJoin(client) {

        let i = 0;
        for (let [key, value] of Object.entries(this.spwanningIndex)) {
            if (value.available) {
                this.state.createPlayer(client.sessionId, value.index, key);
                this.spwanningIndex[key].available = false;
                break
            }
            i++;
        }
    }

    onLeave(client) {
        let buildingName = this.state.players[client.sessionId].buildingName;
        this.spwanningIndex[buildingName].available = true;
        this.state.removePlayer(client.sessionId);
    }

    onMessage(client, data) {
        console.log("StateHandlerRoom received message from", client.sessionId, ":", data);
        if (data.action==="FIRE") {
            this.state.fireBullet(client.sessionId,data);
        } else if (data.action==="MOVE") {
            this.state.movePlayer(client.sessionId, data);
        }

    }


    onDispose() {
        console.log("Dispose StateHandlerRoom");
    }

}