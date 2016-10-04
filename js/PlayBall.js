class PlayBall extends Ball
{
    constructor(name)
    {
        super(name);
        this.BallGroup = new THREE.Group();
        this.CeuMaterial = new THREE.MeshLambertMaterial({color: 0x800000});
        this.CeuGeo = new THREE.CylinderGeometry(2,2,150,32);
        this.CeuMesh = new THREE.Mesh(this.CeuGeo, this.CeuMaterial);
        this.BallGroup.add(this.Mesh);
        this.BallGroup.add(this.CeuMesh);
    }

    /*get mesh()
    {
        return this.BallGroup;
    }*/
}