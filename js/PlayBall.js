class PlayBall extends Ball
{
    constructor(name)
    {
        super(name);
        this.CeuLenght = 150;
        this.CeuMaterial = new THREE.MeshLambertMaterial({color: 0x800000});
        this.CeuGeo = new THREE.CylinderGeometry(0.5,1.5,this.CeuLenght,32);
        this.CeuMesh = new THREE.Mesh(this.CeuGeo, this.CeuMaterial);
        this.ceu = new THREE.Object3D();
        this.ceu.add(this.CeuMesh);
        this.ceu.position.set(this.Mesh.position.x, this.Mesh.position.y, this.Mesh.position.z);
    }

    SetPosition(x, z)
    {
        super.SetPosition(x, z);
        this.ceu.position.set(x, this.Mesh.position.y, z);
    }

    CalcMovement(delta, tableGroup)
    {
        super.CalcMovement(delta, tableGroup);
        this.ceu.position.add(this.currentSpeed);
    }

    get ceuMesh()
    {
        return this.ceu;
    }
}