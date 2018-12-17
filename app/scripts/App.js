// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats

import floorVert from './shaders/floor_vertex.vert';
import floorFrag from './shaders/floor_fragment.vert';


import SimplexNoise from 'simplex-noise';
import OBJLoader from 'three-obj-loader';
import OrbitControls from 'three-orbit-controls';


import RobotObj from '../models/robot.obj';
import RobotObj2 from '../models/robot02.obj';
import RobotObj2b from '../models/robot02boule.obj';


import RockObj01 from '../models/pierre01.obj';
import RockObj02 from '../models/pierre02.obj';
import RockObj03 from '../models/pierre03.obj';
import RockObj04 from '../models/pierre04.obj';
import RockObj05 from '../models/pierre05.obj';
import RockObj06 from '../models/pierre06.obj';


import mountain01 from '../models/mountain/montain01.obj';
import mountain02 from '../models/mountain/montain02.obj';
import mountain03 from '../models/mountain/montain03.obj';
import mountain04 from '../models/mountain/montain04.obj';
import mountain05 from '../models/mountain/montain05.obj';

import site1 from '../models/sites/1.obj';


import sandTexture from '../A7/normalSand.png';

const rockArray = [RockObj01, RockObj02, RockObj03, RockObj04, RockObj05, RockObj06];
const mountainArray = [mountain01, mountain02, mountain03, mountain04, mountain05];


export default class App {

    constructor() {

        this.time = 0;

        this.noise = new SimplexNoise();
        OBJLoader(THREE);

        this.game = new Game();

        //let OrbitControl = OrbitControls(THREE);
        this.heading = 0;
        this.headingVector = new THREE.Vector3(Math.cos(this.heading), 0, Math.sin(this.heading));

        this.turnSide = 1;
        this.isRotate = false;


        this.ray = new THREE.Raycaster(new THREE.Vector3(0,10,0), new THREE.Vector3(0,-1,0));
        this.rayH = new THREE.Raycaster(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-1), 0, 100);

        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );

        this.map = new Map(this.container);
        
        this.moving = false;

        this.worldRobotPosition = new THREE.Vector3(0,0,0);
        this.staticRobotPosition = new THREE.Vector3(0,0,0);

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.z = 5;
        this.camera.position.y = 2.5;
        this.camera.lookAt(this.staticRobotPosition);
        this.loader = new THREE.OBJLoader();


        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xffffff, 0.015, 80);

        this.terrain = new Terrain(this.scene, this.noise);
        this.sky = new Sky(this.scene);
        this.robot = new Robot(this.scene, this.loader, this.camera);
        this.robotb = new RobotBall(this.scene, this.loader, this.camera);
        this.elementsManager = new ElementsManager(this.scene, this.loader, this.camera);
        this.rocks = this.elementsManager.rocks;
        this.mountains = this.elementsManager.mountains;
        this.sites = this.elementsManager.sites;
        this.elementGroup = new THREE.Group();

        this.mountains.forEach((mountain) => {

        })

        this.intersect = new THREE.Vector3(0,0,0);
        this.intersectH = new THREE.Vector3(0,0,0);


        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.z = -10;
        directionalLight.position.y = 2.5;
        directionalLight.castShadow = true;
        this.scene.add( directionalLight );

        directionalLight.shadow.mapSize.width = 2048;  // default
        directionalLight.shadow.mapSize.height = 2048; // default
        directionalLight.shadow.camera.near = 0.1;    // default
        directionalLight.shadow.camera.far = 200;     // default



        var light = new THREE.HemisphereLight( 0xffffbb, 0xE8BA60, 0.5 );
        this.scene.add( light );

    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );
        
        this.renderer.shadowMapEnabled = true;
        //this.renderer.shadowMapSoft = true;

        this.game.sites.forEach((site) => {
            this.elementsManager.sites[0].position.x = site.x;
            this.elementsManager.sites[0].position.z = site.y;
        });

        this.map.targetsPos = this.game.sites;

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );
    }

    render() {

        //this.mesh.rotation.x += 0.01;
        //this.mesh.rotation.y += 0.02;
        //this.terrain.uniforms.posY.value+=0.01;

        this.intersect = this.ray.intersectObject(this.terrain.mesh, false, this.intersect);
        if(this.mountains[0].object){
            this.intersectH = this.rayH.intersectObjects(this.elementsManager.getObjectProperty(), true, this.intersectH);
        }
       // console.log(this.intersect);
    

        if(this.isRotate){
            this.heading += this.turnSide *0.1;
        }

        if(this.moving){
            let deltaZ = Math.cos(this.heading) * 0.01;
            let deltaX = Math.sin(this.heading) * 0.01;

            if(this.intersectH[0]){
                if(Math.abs(this.intersectH[0].point.x) - 0.1 <= 0){
                    deltaX = 0;
                }
    
                if(Math.abs(this.intersectH[0].point.z) - 0.1 <= 0){
                    deltaZ = 0;
                }
            }

            this.worldRobotPosition.z += deltaZ;
            this.worldRobotPosition.x += deltaX;
        }

        this.map.position.x = this.worldRobotPosition.x / 30;
        this.map.position.y = this.worldRobotPosition.z / 30;


        this.rocks.forEach((rock) => {
            if(rock.object != null && rock.object != undefined){
                rock.object.position.z = -rock.position.z + this.worldRobotPosition.z * 10;
                rock.object.position.y = this.noise.noise3D(rock.position.x,rock.position.z,0);
                rock.object.position.x = -rock.position.x -this.worldRobotPosition.x *10;
            }
        })

        this.mountains.forEach((rock) => {
            if(rock.object != null && rock.object != undefined){
                rock.object.position.z = -rock.position.z + this.worldRobotPosition.z * 10;
                rock.object.position.y = this.noise.noise3D(rock.position.x,rock.position.z,0);
                rock.object.position.x = -rock.position.x -this.worldRobotPosition.x *10;
            }
        })

        this.sites.forEach((rock) => {
            if(rock.object != null && rock.object != undefined){
                rock.object.position.z = -rock.position.z + this.worldRobotPosition.z * 10;
                rock.object.position.y = this.noise.noise3D(rock.position.x,rock.position.z,0);
                rock.object.position.x = -rock.position.x -this.worldRobotPosition.x *10;
            }
        });
        

        this.camera.position.z = 5;
        this.camera.position.z = 5 * Math.cos(this.heading);
        this.camera.position.x = -5 * Math.sin(this.heading);
        this.terrain.offsetY = this.worldRobotPosition.z;
        this.terrain.offsetX = this.worldRobotPosition.x;
        this.worldRobotPosition.y = this.staticRobotPosition.y = this.noise.noise3D(this.worldRobotPosition.x, this.worldRobotPosition.z, 0) * 1;
        this.camera.position.y = this.noise.noise3D(this.worldRobotPosition.x, this.worldRobotPosition.z - 6, 0) * 0.5 + 2;
        this.camera.lookAt(this.staticRobotPosition);


        if(this.robot.object){
            this.robot.object.position.y =  app.intersect[0].point.y+ 0.25;
        }


        if(this.robotb.object){
            this.robotb.object.position.x = Math.cos(this.time/20) / 4;
            this.robotb.object.position.z = -Math.sin(this.time/20) / 4;
            this.robotb.object.position.y = app.intersect[0].point.y;
        }

        this.rayH.set(new THREE.Vector3(0,0,0), new THREE.Vector3(Math.sin(this.heading),0,-Math.cos(this.heading)));

        this.time++;
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

        var floorTex = THREE.ImageUtils.loadTexture(sandTexture);

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


        let material = new THREE.MeshPhongMaterial({color: 0xFC6A68, shininess: 0.1});
        
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

class ElementsManager {
    
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
            RobotObj2,
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

class Site {

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


class RobotBall {

    constructor(scene, loader, camera){
        let material = new THREE.MeshPhongMaterial({color: 0x383838});
        // load a resource
        loader.load(
            // resource URL
            RobotObj2b,
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


class Mountain {

    constructor(scene, loader, camera){
        let material = new THREE.MeshPhongMaterial({color: 0x383838});
        this.position = {x: 10 + (Math.random()-0.5) * 2 * 50, y: 0, z: 10 + (Math.random()) * 200};
        this.scale = 0.06 * Math.random();
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

class Map {


    constructor(container){
        this.height = 500;
        this.width = 500;
        this.container = container;
        this.canvas = '';
        this.ctx = '';
        this.position = {
            x: 0,
            y: 0
        }

        this.targetsPos = [];

        this.createCanvas();
        this.draw();

    }

    createCanvas(){
        this.canvas = document.createElement('canvas');
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.canvas.style.height = this.height / 2 + 'px';
        this.canvas.style.width = this.width / 2 + 'px';
        this.canvas.style.position = 'fixed';
        this.canvas.style.bottom = '25px';
        this.canvas.style.right = '25px';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    draw(){
        this.background();
        this.myPosition();
        this.targets();

        requestAnimationFrame(this.draw.bind(this));
    }

    background(){
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.height, this.width);
        this.ctx.closePath();
    }

    myPosition(){
        this.ctx.fillStyle = "#000000";
        this.ctx.beginPath();
        this.ctx.arc(this.xToCanvasCoords(this.position.x), this.yToCanvasCoords(this.position.y), 10, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }

    targets(){
        this.targetsPos.forEach((target) => {
            this.ctx.fillStyle = "#ff0000";
            this.ctx.beginPath();
            this.ctx.arc(this.xToCanvasCoords(-target.x / 300), this.yToCanvasCoords(target.y / 300), 10, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
        });
    }

    xToCanvasCoords(i){
        return this.width / 2 + (this.width / 2) * i;
    }

    yToCanvasCoords(i){
        return this.height - this.height * i;
    }


}



class Rock {

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

class Game {

    constructor(){

        this.sites = [];
        this.score = 0;

        this.setArcheologicArea();

    }

    setArcheologicArea(){
        this.sites.push(new THREE.Vector3(300 * Math.random() - 150,30 * Math.random() + 20,0));
    }

}