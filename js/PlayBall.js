class PlayBall extends Ball {
    constructor(name, tableGroup) {
        super(name);

        this.PowerDirection = true;
        this.tableGroup = tableGroup;

        this.CeuLenght = 100;
        this.CeuMaterial = new THREE.MeshLambertMaterial({color: 0x800000});
        this.CeuGeo = new THREE.CylinderGeometry(0.5, 1.5, this.CeuLenght, 32);
        this.CeuMesh = new THREE.Mesh(this.CeuGeo, this.CeuMaterial);

        this.PowerCubeMat = new THREE.MeshLambertMaterial({color: 0xff0000, opacity: 10});
        this.PowerCubeGeo = new THREE.BoxGeometry(2.5, 20, 2.5);
        this.PowerCube = new THREE.Mesh(this.PowerCubeGeo, this.PowerCubeMat);

        this.ceu = new THREE.Object3D();
        this.ceu.add(this.CeuMesh);
        this.ceu.add(this.PowerCube);
        this.ceu.position.set(this.Mesh.position.x, this.Mesh.position.y, this.Mesh.position.z);

        this.CeuMesh.rotation.x = -95 * Math.PI / 180;
        this.CeuMesh.position.z = (Math.cos(5 * Math.PI / 180) * (this.CeuLenght + this.Radius + 10 + this.Radius)) / 2;
        this.CeuMesh.position.y = (Math.sin(5 * Math.PI / 180) * (this.CeuLenght + this.Radius + 10 + this.Radius)) / 2;

        this.PowerCube.position.y = 15;

        this.CeuDirection = new THREE.Vector2(0, -1);

        this.LineMat = new THREE.LineBasicMaterial({color: 0xFFFFFF});
        this.LineGeo = new THREE.Geometry();

        this.Line = new THREE.Line();
    }

    SetVisibility(state)
    {
        this.ceu.visible = state;
    }

    CheckKeys(controller)
    {
        if(this.ceu.visible) {
            var rot = 1 * Math.PI / 180;
            if (controller.GetKey("a")) {
                this.ceu.rotateY(rot);
                this.CeuDirection.rotateAround(new THREE.Vector2(0, 0), -rot);
            }
            if (controller.GetKey("d")) {
                this.ceu.rotateY(-rot);
                this.CeuDirection.rotateAround(new THREE.Vector2(0, 0), rot);
            }
            if(controller.GetKey("space"))
            {
                this.StartMoving(this.CeuDirection, this.PowerCube.scale.y * 300);
            }
        }
    }

    SetPosition(x, z)
    {
        super.SetPosition(x, z);
        this.ceu.position.set(x, this.Mesh.position.y, z);
    }

    CalcFrame(delta, tableGroup)
    {
        super.CalcFrame(delta, tableGroup);
        this.ceu.position.add(this.currentSpeed);
        if(this.ceu.visible) {
            if (this.PowerCube.scale.y <= 0.1 && this.PowerDirection) {
                this.PowerDirection = false;
                this.PowerCube.scale.y = 0.1;
            }
            if (this.PowerCube.scale.y >= 1 && !this.PowerDirection) {
                this.PowerDirection = true;
                this.PowerCube.scale.y = 1;
            }

            if(!this.PowerDirection)
                this.PowerCube.scale.y += 1 * delta;
            if(this.PowerDirection)
                this.PowerCube.scale.y -= 1 * delta;
            this.CalcNewLine();
        }
    }

    StartMoving(direction, speed)
    {
        this.SetDirection(direction.x, direction.y);
        this.speed = speed;
    }

    CalcNewLine()
    {
        this.LineMat = new THREE.LineBasicMaterial(0xFFFFFF);
        this.LineGeo = new THREE.Geometry();

        this.rayCaster.set(this.position, new THREE.Vector3(this.CeuDirection.x, 0, this.CeuDirection.y));
        var intersects = this.rayCaster.intersectObjects(this.tableGroup);
        var distance = intersects[0].distance;

        this.LineGeo = new THREE.Geometry();
        this.LineGeo.vertices.push(new THREE.Vector3().copy(this.position));
        var scaledDirVec = new THREE.Vector2().copy(this.CeuDirection).multiplyScalar(distance);
        this.LineGeo.vertices.push(new THREE.Vector3(scaledDirVec.x, this.position.y, scaledDirVec.y));
        this.Line = new THREE.Line(this.LineGeo, this.LineMat);
    }

    get ceuMesh()
    {
        return this.ceu;
    }
}