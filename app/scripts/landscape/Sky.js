export default class Sky {

    constructor(scene){
        this.geometry = new THREE.SphereBufferGeometry(60, 32,32);
        this.material = new THREE.MeshBasicMaterial({color: 0xBDEBFF, side: THREE.BackSide, fog: false});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.mesh);
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = false;
    }

}