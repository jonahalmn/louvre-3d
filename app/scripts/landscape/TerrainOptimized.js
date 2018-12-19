import sandTexture from '../../A7/normalSand.png';

export default class Terrain {

    constructor(scene, noise){
        this.time = 0;
        this.noise = noise;
        //this.noise2 = new SimplexNoise(); 

        this.offsetY = 0;
        this.offsetX = 0;

        this.stepY = 0;
        this.stepX = 0;

        this.planeY = 0;
        this.planeX = 0;

        this.planes = [];

        this.planes.push(new Plane(0,0, scene, noise));
        this.planes.push(new Plane(0,100, scene, noise));
        this.planes.push(new Plane(100,0, scene, noise));
        this.planes.push(new Plane(100,100, scene, noise));
        
        this.update();
    }

    getPlanesMesh(){
        let a = [];
        this.planes.forEach((plane) => {
            a.push(plane.mesh);
        });

        return a;
    }

    update(){


        

        this.planes[0].mesh.position.z = this.offsetY * 10 - this.planes[0].position.y;
        this.planes[0].mesh.position.x = -this.offsetX * 10 - this.planes[0].position.x;

        this.planes[1].mesh.position.z = this.offsetY * 10 - this.planes[1].position.y;
        this.planes[1].mesh.position.x = -this.offsetX * 10 - this.planes[1].position.x;

        this.planes[2].mesh.position.z = this.offsetY * 10 - this.planes[2].position.y;
        this.planes[2].mesh.position.x = -this.offsetX * 10 - this.planes[2].position.x;

        this.planes[3].mesh.position.z = this.offsetY * 10 - this.planes[3].position.y;
        this.planes[3].mesh.position.x = -this.offsetX * 10 - this.planes[3].position.x;

        if((-this.offsetY * 10) % 100 < 10 && this.stepY !== 100){
            this.planes.forEach((plane) => {
                //console.log(plane.mesh.position.x);
                //console.log(plane.mesh.position.z);
                if(-plane.mesh.position.z > 100){
                    this.stepY -= 100;
                    plane.position.y -= 200;
                    //plane.mesh.position.z += 100;
                    plane.update();
                    console.log(plane.mesh.position.x);
                    console.log(plane.mesh.position.z);
                }
            });
        }

        if((-this.offsetY * 10) % 100 < -10){
            this.planes.forEach((plane) => {
                //console.log(plane.mesh.position.x);
                //console.log(plane.mesh.position.z);
                if(-plane.mesh.position.z < -100){
                    this.stepY += 100;
                    plane.position.y += 200;
                    //plane.mesh.position.z += 100;
                    plane.update();
                    console.log(plane.mesh.position.x);
                    console.log(plane.mesh.position.z);
                }
            });
        }

        if((-this.offsetX * 10) % 100 > -10){
            this.planes.forEach((plane) => {
                //console.log(plane.mesh.position.x);
                //console.log(plane.mesh.position.z);
                if(plane.mesh.position.x < -100 && plane){
                    this.stepX -= 100;
                    plane.position.x -= 200;
                    //plane.mesh.position.z += 100;
                    plane.update();
                    console.log(plane.mesh.position.x);
                    console.log(plane.mesh.position.z);
                }
            });
        }

        if((-this.offsetX * 10) % 100 > 10){
            this.planes.forEach((plane) => {
                //console.log(plane.mesh.position.x);
                //console.log(plane.mesh.position.z);
                if(plane.mesh.position.x > 100 && plane){
                    this.stepX += 100;
                    plane.position.x += 200;
                    //plane.mesh.position.z += 100;
                    plane.update();
                    console.log(plane.mesh.position.x);
                    console.log(plane.mesh.position.z);
                }
            });
        }

        requestAnimationFrame(this.update.bind(this));
    }


}


class Plane{

    constructor(x, y, scene, noise){

        this.noise = noise;
        this.geometry = new THREE.PlaneBufferGeometry(100, 100, 100, 100);
        this.position = {x:x, y:y};
        this.offset = {x:0, y:0};
        let material = new THREE.MeshPhongMaterial({color: 0xFC6A68, shininess: 0.1});
        this.mesh = new THREE.Mesh( this.geometry, material );
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.x = 0;
        this.mesh.position.z = 0;
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = true;
        scene.add( this.mesh );

        let vertices = this.geometry.attributes.position;
        let count = vertices.count;
        for (let i = 0, j = 0; i < count; i++, j += 3) {
            vertices.array[j+2] = this.noise.noise3D(vertices.array[j] * 0.1 - this.position.x * 0.1,vertices.array[j+1] * 0.1 + this.position.y * 0.1,0) * 1
        }
        this.time++;
        //this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
    }

    update(){

        this.geometry.verticesNeedUpdate = true;
        this.geometry.attributes.position.needsUpdate = true;

        let vertices = this.geometry.attributes.position;
        let count = vertices.count;
        for (let i = 0, j = 0; i < count; i++, j += 3) {
            vertices.array[j+2] = this.noise.noise3D(vertices.array[j] * 0.1 - this.position.x * 0.1,vertices.array[j+1] * 0.1 + this.position.y * 0.1,0) * 1
        }
        console.log('update')
        this.time++;
        //this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
        this.geometry.verticesNeedUpdate = false;
        this.geometry.attributes.position.needsUpdate = false;
    }

}