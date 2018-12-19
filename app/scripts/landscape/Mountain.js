import OBJLoader from 'three-obj-loader';
import mountain01 from '../../models/mountain/montain01.obj';
import mountain02 from '../../models/mountain/montain02.obj';
import mountain03 from '../../models/mountain/montain03.obj';
import mountain04 from '../../models/mountain/montain04.obj';
import mountain05 from '../../models/mountain/montain05.obj';

const mountainArray = [mountain01, mountain02, mountain03, mountain04, mountain05];

export default class Mountain {

    constructor(scene, loader, camera){
        let material = new THREE.MeshPhongMaterial({color: 0x383838});
        this.position = {x: 10 + (Math.random()-0.5) * 2 * 50, y: 0, z: 10 + (Math.random()) * 200};
        this.scale = 0.02 + 0.06 * Math.random();
        // load a resource
        loader.load(
            // resource URL
             mountainArray[Math.floor(Math.random() * mountainArray.length)],
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
                object.scale.set(this.scale, this.scale, this.scale);
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

    update(position){

    }
}