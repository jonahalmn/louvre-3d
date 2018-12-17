import sandTexture from '../../A7/normalSand.png';

export default class Terrain {

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