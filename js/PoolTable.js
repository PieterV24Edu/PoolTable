class PoolTable
{
    constructor()
    {
        this.tableGroup = new THREE.Group();

        var borderMat = new THREE.MeshLambertMaterial({color: 0x00FF00});
        var holeMat = new THREE.MeshLambertMaterial({color: 0x000000});
        var floorMat = new THREE.MeshLambertMaterial({color: 0x016903});

        var longGeo = new THREE.BoxGeometry(10,8,320);
        var shortGeo = new THREE.BoxGeometry(170, 8, 10);
        var floorGeo = new THREE.BoxGeometry(150, 2, 300);

        var floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.position.y = -1;
        floorMesh.castShadow = true;
        floorMesh.receiveShadow = true;

        var longLeft = new THREE.Mesh(longGeo, borderMat);
        longLeft.position.x = -80;
        longLeft.position.y = 2.5;
        longLeft.receiveShadow = true;
        longLeft.castShadow = true;

        var longRight = new THREE.Mesh(longGeo, borderMat);
        longRight.position.x = 80;
        longRight.position.y = 2.5;
        longRight.receiveShadow = true;
        longRight.castShadow = true;

        var shortFar = new THREE.Mesh(shortGeo, borderMat);
        shortFar.position.z = -155;
        shortFar.position.y = 2.5;
        shortFar.castShadow = true;
        shortFar.receiveShadow = true;

        var shortClose = new THREE.Mesh(shortGeo, borderMat);
        shortClose.position.z = 155;
        shortClose.position.y = 2.5;
        shortClose.castShadow = true;
        shortClose.receiveShadow = true;

        this.tableGroup.add(floorMesh);
        this.tableGroup.add(longLeft);
        this.tableGroup.add(longRight);
        this.tableGroup.add(shortFar);
        this.tableGroup.add(shortClose);
    }

    get mesh()
    {
        return this.tableGroup;
    }

    get children()
    {
        return this.tableGroup.children;
    }
}
