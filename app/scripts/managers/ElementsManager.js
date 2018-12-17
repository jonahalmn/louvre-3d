import Mountain from '../landscape/Mountain';
import Rock from '../landscape/Rock';
import Site from '../landscape/Site';

export default class ElementsManager {
    
    constructor(scene, loader, camera){
        this.scene = scene;
        this.loader = loader;
        this.camera = camera;
        this.mountains = [];
        this.rocks = [];
        this.sites = []
        this.createObjects();
    }

    createObjects(){
        for (let i = 0; i < 100; i++) {
            //onst element = array[i];
            this.rocks.push(new Rock(this.scene, this.loader, this.camera));
        }


        for (let i = 0; i < 10; i++) {
            //onst element = array[i];
            this.mountains.push(new Mountain(this.scene, this.loader, this.camera));
        }

        for (let i = 0; i < 1; i++) {
            //onst element = array[i];
            this.sites.push(new Site(this.scene, this.loader, this.camera));
        }
    }

    getObjectProperty(){
        let array = [];

        this.mountains.forEach((mountain) => {
            if(mountain.object!= null && mountain.object != undefined){
                array.push(mountain.object.children[0]);
                //console.log('mountobj');
            }
        })

        this.rocks.forEach((rock) => {
            if(rock.object!= null && rock.object != undefined){
                array.push(rock.object.children[0]);
            }
        }); 

        this.sites.forEach((site) => {
            if(site.object!= null && site.object != undefined){
                array.push(site.object.children[0]);
            }
        }); 

        return array;

    }



}