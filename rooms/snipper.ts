import {Room} from "colyseus";
import {State} from "./state";

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
        this.setSimulationInterval(() => this.state.update());
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
        if (data.action === "FIRE") {
            this.state.fireBullet(client.sessionId, data);
        } else if (data.action === "MOVE") {
            this.state.movePlayer(client.sessionId, data);
        }

    }


    onDispose() {
        console.log("Dispose StateHandlerRoom");
    }

}