// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats

import floorVert from './shaders/floor_vertex.vert';
import floorFrag from './shaders/floor_fragment.vert';
import SimplexNoise from 'simplex-noise';

export default class App {

    constructor() {

        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 50 );
        this.camera.position.x = 1;
        this.camera.position.y = 1;
        //var controls = new THREE.OrbitControls( this.camera );

    	this.scene = new THREE.Scene();

        this.terrain = new Terrain(this.scene);

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.x = 1;
        directionalLight.position.z = 1;
        this.scene.add( directionalLight );

    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );
    }

    render() {

        //this.mesh.rotation.x += 0.01;
        //this.mesh.rotation.y += 0.02;

    	this.renderer.render( this.scene, this.camera );
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}

class Terrain {

    constructor(scene){
        this.time = 0;
        this.noise = new SimplexNoise();
        this.noise2 = new SimplexNoise();
        this.geometry = new THREE.PlaneGeometry(50, 50, 150, 150);

        var phongShader = THREE.ShaderLib.phong;

        this.uniforms = THREE.UniformsUtils.merge(
            [phongShader.uniforms,{
            scale: {type: 'f', value: 1.0},
            posY: {type: 'f', value: 0.0}
        }]);
        //let material = new THREE.MeshPhongMaterial();
        let material = new THREE.ShaderMaterial({
            vertexShader: floorVert,
            fragmentShader: floorFrag,
            uniforms: this.uniforms,
            lights:true,
        });
        this.mesh = new THREE.Mesh( this.geometry, material );
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.x = 0;
        this.mesh.position.z = 0;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = false;
        scene.add( this.mesh );
        this.update();
    }

    update(){
        this.geometry.verticesNeedUpdate = true;
        // this.geometry.vertices.forEach(vertex => {
        //     vertex.z = this.noise.noise3D(vertex.x*0.2, vertex.y*0.2 + this.time * 0.01, 0) + 2 * this.noise.noise3D(vertex.x*0.2 + 5, vertex.y*0.2 + 5 + this.time * 0.01, 0);
        // });
        this.uniforms.posY.value += 0.01;
        this.time++;
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
        requestAnimationFrame(this.update.bind(this));
    }


}