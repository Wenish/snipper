export class Player {
    public spawnIndex ;
    public buildingName : string;
    public x :number;
    public y :number;


    constructor(){
        this.spawnIndex=-1;
        this.buildingName="Nothing";
        this.x=Math.floor(Math.random() * 300);
        this.y=Math.floor(Math.random() * 300);
    }


}