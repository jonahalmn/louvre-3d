// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats

import floorVert from './shaders/floor_vertex.vert';
import floorFrag from './shaders/floor_fragment.vert';
import SimplexNoise from 'simplex-noise';
import OBJLoader from 'three-obj-loader';
import RobotObj from '../models/robot.obj';
import RockObj01 from '../models/pierre01.obj';
import RockObj02 from '../models/pierre02.obj';
import RockObj03 from '../models/pierre03.obj';
import RockObj04 from '../models/pierre04.obj';
import RockObj05 from '../models/pierre05.obj';
import RockObj06 from '../models/pierre06.obj';
import OrbitControls from 'three-orbit-controls';

export default class App {

    constructor() {
        this.noise = new SimplexNoise();
        OBJLoader(THREE);
        //let OrbitControl = OrbitControls(THREE);
        this.heading = 0;
        this.turnSide = 1;
        this.isRotate = false;

        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );
        
        this.moving = false;

        this.worldRobotPosition = new THREE.Vector3(0,0,0);
        this.staticRobotPosition = new THREE.Vector3(0,0,0);

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.z = 5;
        this.camera.position.y = 2.5;
        this.camera.lookAt(this.staticRobotPosition);
        this.loader = new THREE.OBJLoader();
        //this.control = new THREE.OrbitControls(this.camera);
        //var controls = new OrbitControl( this.camera );

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xffffff, 0.015, 40);

        this.terrain = new Terrain(this.scene, this.noise);
        this.sky = new Sky(this.scene);
        this.robot = new Robot(this.scene, this.loader, this.camera);
        this.rocks = [];
        //this.rock = new Rock(this.scene, this.loader, this.camera);

        for (let i = 0; i < 10; i++) {
            //onst element = array[i];
            this.rocks.push(new Rock(this.scene, this.loader, this.camera));
        }

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
        directionalLight.position.x = 2;
        directionalLight.position.y = 2;
        directionalLight.castShadow = true;
        this.scene.add( directionalLight );

        directionalLight.shadow.mapSize.width = 2048;  // default
        directionalLight.shadow.mapSize.height = 2048; // default
        directionalLight.shadow.camera.near = 0;    // default
        directionalLight.shadow.camera.far = 20;     // default



        var light = new THREE.HemisphereLight( 0xffffbb, 0xE8BA60, 0.5 );
        this.scene.add( light );

    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );
        
        this.renderer.shadowMapEnabled = true;
        //this.renderer.shadowMapSoft = true;

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );
    }

    render() {

        //this.mesh.rotation.x += 0.01;
        //this.mesh.rotation.y += 0.02;
        //this.terrain.uniforms.posY.value+=0.01;
    

        if(this.isRotate){
            this.heading += this.turnSide *0.1;
        }

        if(this.moving){
            let deltaZ = Math.cos(this.heading) * 0.01;
            let deltaX = Math.sin(this.heading) * 0.01;
            this.worldRobotPosition.z += deltaZ;
            this.worldRobotPosition.x += deltaX;
        }


        this.rocks.forEach((rock) => {
            if(rock.object != null && rock.object != undefined){
                rock.object.position.z = -rock.position.z + this.worldRobotPosition.z * 10;
                rock.object.position.y = this.noise.noise3D(rock.position.x,rock.position.z,0);
                rock.object.position.x = -rock.position.x -this.worldRobotPosition.x *10;
            }
        })
        

        this.camera.position.z = 5;
        this.camera.position.z = 5 * Math.cos(this.heading);
        this.camera.position.x = -5 * Math.sin(this.heading);
        this.terrain.offsetY = this.worldRobotPosition.z;
        this.terrain.offsetX = this.worldRobotPosition.x;
        this.worldRobotPosition.y = this.staticRobotPosition.y = this.noise.noise3D(this.worldRobotPosition.x, this.worldRobotPosition.z, 0) * 1;
        this.camera.position.y = this.noise.noise3D(this.worldRobotPosition.x, this.worldRobotPosition.z - 6, 0) * 0.5 + 2;
        this.camera.lookAt(this.staticRobotPosition);
        if(this.robot.object){
            this.robot.object.position.y = this.worldRobotPosition.y + 0.25;
        }
    	this.renderer.render( this.scene, this.camera );
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    startMove(){
        this.moving = true;
    }

    stopMove(){
        this.moving = false;
    }

    startTurn(side = 1){
        this.turnSide = side;
        this.isRotate = true;
    }

    stopTurn(){
        this.isRotate = false;
    }
}

class Terrain {

    constructor(scene, noise){
        this.time = 0;
        this.noise = noise;
        //this.noise2 = new SimplexNoise();
        this.geometry = new THREE.PlaneBufferGeometry(100, 100, 200, 200);

        this.offsetY = 0;
        this.offsetX = 0;

        var phongShader = THREE.ShaderLib.phong;
        var lambertShader = THREE.ShaderLib.lambert;

        this.uniforms = THREE.UniformsUtils.merge(
            [phongShader.uniforms,{
            scale: {type: 'f', value: 1.0},
            posY: {type: 'f', value: 0.0},
            posX: {type: 'f', value: 0.0},
            diffuse: { value: new THREE.Color(0xE8BA60) },
            topColor:    { type: "c", value: new THREE.Color( 0x0077ff ) },
            bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
            offset:      { type: "f", value: 33 },
            exponent:    { type: "f", value: 0.6 }
        }]);


        let material = new THREE.MeshPhongMaterial({color: 0xE8BA60});
        // let material = new THREE.ShaderMaterial({
        //     vertexShader: floorVert,
        //     fragmentShader: phongShader.fragmentShader,
        //     uniforms: this.uniforms,
        //     lights:true,
        //     fog: true,
        // });
        this.mesh = new THREE.Mesh( this.geometry, material );
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.x = 0;
        this.mesh.position.z = 0;
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = true;
        scene.add( this.mesh );
        this.update();
    }

    update(){
        this.geometry.verticesNeedUpdate = true;
        this.geometry.attributes.position.needsUpdate = true;

        let vertices = this.geometry.attributes.position;
        let count = vertices.count;
        for (let i = 0, j = 0; i < count; i++, j += 3) {
            vertices.array[j+2] = this.noise.noise3D(vertices.array[j] * 0.1 + this.offsetX,vertices.array[j+1] * 0.1 + this.offsetY,0) * 1
        }
        // this.geometry.vertices.forEach(vertex => {
        //     vertex.z = this.noise.noise3D(vertex.x*0.2, vertex.y*0.2 + this.time * 0.01, 0) + 2 * this.noise.noise3D(vertex.x*0.2 + 5, vertex.y*0.2 + 5 + this.time * 0.01, 0);
        // });
        //this.uniforms.posY.value += 0;
        this.time++;
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();

        requestAnimationFrame(this.update.bind(this));
    }


}

class Sky {

    constructor(scene){
        this.geometry = new THREE.SphereBufferGeometry(70, 32,32);
        this.material = new THREE.MeshBasicMaterial({color: 0xBDEBFF, side: THREE.BackSide, fog: false});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.mesh);
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = false;
    }

}

class Robot {

    constructor(scene, loader, camera){
        let material = new THREE.MeshPhongMaterial({color: 0x383838});
        // load a resource
        loader.load(
            // resource URL
            RobotObj,
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
                object.scale.set(0.001,0.001,0.001);
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

class Rock {

    constructor(scene, loader, camera){
        let material = new THREE.MeshPhongMaterial({color: 0x383838});
        this.position = {x: 15 * Math.random(), y: 0, z: 15 * Math.random()};
        this.scale = 0.003;
        // load a resource
        loader.load(
            // resource URL
            RockObj04,
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