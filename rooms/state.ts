import {EntityMap, generateId, nosync} from "colyseus";
import {Player} from "../models/player";
import {Bullet} from "../models/bullet";

export class State {
    players: EntityMap<Player> = {};
    bullets: EntityMap<Bullet> = {};


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
        let id = generateId();
        this.bullets[id] = new Bullet();
        this.bullets[id].player = clientid;
        this.bullets[id].angle = bullet.angle;
        this.bullets[id].x = bullet.x;
        this.bullets[id].y = bullet.y
    }

    updateBullets() {

        // spdX = Math.cos(param.angle/180*Math.PI) * 10;
        // spdY = Math.sin(param.angle/180*Math.PI) * 10;
    }

    static distance(a, b) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }

    update() {


        let keysBullet = Object.keys(this.bullets);

        keysBullet.forEach((keyBullet) => {
            let bullet = this.bullets[keyBullet];
            bullet.x = bullet.x + (bullet.speed * Math.cos((bullet.rotation+ 90) * (Math.PI / 180)));
            bullet.y = bullet.y + (bullet.speed * Math.sin((bullet.rotation + 90) * (Math.PI / 180)));
        });


        keysBullet.forEach((keyBullet) => {
            if (Date.now() - this.bullets[keyBullet].spawnTime > 10000) {
                delete this.bullets[keyBullet];
            }
        });

    }
}