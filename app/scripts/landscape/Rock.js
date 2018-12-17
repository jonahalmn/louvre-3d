import OBJLoader from 'three-obj-loader';
import RockObj01 from '../../models/pierre01.obj';
import RockObj02 from '../../models/pierre02.obj';
import RockObj03 from '../../models/pierre03.obj';
import RockObj04 from '../../models/pierre04.obj';
import RockObj05 from '../../models/pierre05.obj';
import RockObj06 from '../../models/pierre06.obj';

const rockArray = [RockObj01, RockObj02, RockObj03, RockObj04, RockObj05, RockObj06];



export default class Rock {

    constructor(scene, loader, camera){
        let material = new THREE.MeshPhongMaterial({color: 0x383838});
        this.position = {x: 200 * 2 * (Math.random()-0.5), y: 0, z: 200 * Math.random()};
        this.scale = 0.009 * Math.random();
        // load a resource
        loader.load(
            // resource URL
            rockArray[Math.floor(rockArray.length * Math.random())],
            // called when resource is loaded
            ( object ) => {
                object.traverse( function ( child ) {

                    if ( child instanceof THREE.Mesh ) {
                        
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = false;
                        //camera.lookAt(child);
                    }
            
                } );
                //camera.lookAt(object);
                //object.position.set(this.position.x, this.position.y, this.position.z);
                object.position.z = this.position.z;
                object.scale.set(this.scale,this.scale,this.scale);
                scene.add( object );
                this.object = object;
                //camera.lookAt(object);
                

            },
            // called when loading is in progresses
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened' );

            }
        );
    }

    update(){
        //object.position.x = this.position.x;
        //object.position.y = this.position.y;
        //object.position.z = this.position.z;
    }

}