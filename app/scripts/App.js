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

import Terrain from './landscape/TerrainOptimized.js';
import Sky from './landscape/Sky.js';
import Mountain from './landscape/Mountain';
import Robot from './landscape/Robot';
import RobotBall from './landscape/RobotBall';
import Rock from './landscape/Rock';
import Site from './landscape/Site';

import ElementsManager from './managers/ElementsManager.js';
import Game from './managers/Game';

import Map from './ui/Map';

//const rockArray = [RockObj01, RockObj02, RockObj03, RockObj04, RockObj05, RockObj06];
//const mountainArray = [mountain01, mountain02, mountain03, mountain04, mountain05];


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

        this.intersect = this.ray.intersectObjects(this.terrain.getPlanesMesh(), false, this.intersect);
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
        this.map.heading = this.heading;


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
