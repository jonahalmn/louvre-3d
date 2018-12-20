import OBJLoader from 'three-obj-loader';
import site1 from '../../models/sites/1.obj';

export default class Site {

    constructor(scene, loader, camera){
        let material = new THREE.MeshPhongMaterial({color: 0x383838});
        this.position = {x: 0, y: 0, z: 0};
        this.scale = 0.006;
        // load a resource
        loader.load(
            // resource URL
            site1,
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
                object.position.z = 100
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
}