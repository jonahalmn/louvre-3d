export default class Game {

    constructor(){

        this.sites = [];
        this.score = 0;

        this.setArcheologicArea();

    }

    setArcheologicArea(){
        this.sites.push(new THREE.Vector3(300 * Math.random() - 150,60 * Math.random() + 60,0));
    }

}