class Ball
{
    constructor(name, type)
    {
        this.name = name;
        this.Type = type;
        this.inScene = true;
        this.startPos = null;
        this.Radius = 2.85;

        this.Geometry = new THREE.SphereGeometry(this.Radius, 32, 32);
        this.Material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
        this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
        this.Mesh.position.y = 2.85;
        this.Mesh.rotation.z = 0.5*Math.PI;
        this.Mesh.rotation.y = 0.5*Math.PI;

        this.Direction = new THREE.Vector3(0,0,0);
        this.Direction.normalize();
        this.speed = 0;
        this.currentSpeed = new THREE.Vector3();
        this.Mesh.castShadow = true;
        this.Mesh.receiveShadow = true;

        this.rayCaster = new THREE.Raycaster();
        this.CollisionEvent = new Event("onCollision");
    }

    CalcFrame(delta, tableGroup)
    {
        this.UpdateCurrentSpeed(delta);
        if(this.Direction.x > 0)
            this.CheckColistion(1,0,0, tableGroup, delta);
        else if(this.Direction.x < 0)
            this.CheckColistion(-1,0,0, tableGroup, delta);

        if(this.Direction.z > 0)
            this.CheckColistion(0,0,1, tableGroup, delta);
        else if(this.Direction.z < 0)
            this.CheckColistion(0,0,-1, tableGroup, delta);
        //Move Ball
        this.Mesh.position.add(this.currentSpeed);
        this.UpdateRotation();
        if(this.speed > 0.5)
            this.speed -= ((0.35 * delta) * this.speed);
        else
            this.speed = 0;
    }

    CheckColistion(x,y,z, tGroup, delta)
    {
        var direction = new THREE.Vector3(x,y,z);
        var directionSpeed = new THREE.Vector3().copy(this.currentSpeed).multiply(direction).toArray().reduce((a,b) => a + b, 0);
        this.rayCaster.set(this.Mesh.position, direction);
        var intersections = this.rayCaster.intersectObjects(tGroup);

        if(intersections.length > 0)
        {
            var intersection = intersections[0];

            if(intersection.distance < 3 || directionSpeed > intersection.distance) {
                this.Direction.reflect(intersection.face.normal);
                this.UpdateCurrentSpeed(delta);
                document.dispatchEvent(this.CollisionEvent);
            }
        }
    }

    UpdateCurrentSpeed(delta)
    {
        this.currentSpeed.copy(this.Direction).multiplyScalar(delta * this.speed);
    }

    CheckBallCollision(otherBall)
    {
        var thisBallPos = new THREE.Vector3().copy(this.Mesh.position);
        var otherBallPos = new THREE.Vector3().copy(otherBall.Mesh.position);

        var distance = thisBallPos.distanceTo(otherBallPos);

        if(distance < (this.Radius + otherBall.Radius))
        {
            return true;
        }
        return false;
    }

    BallCollision(otherBall)
    {
        var thisBallPos = new THREE.Vector3().copy(this.Mesh.position);
        var otherBallPos = new THREE.Vector3().copy(otherBall.Mesh.position);

        var distance = thisBallPos.distanceTo(otherBallPos);

        if(distance <= (this.Radius + otherBall.Radius))
        {
            var thisSpeed = new THREE.Vector3(this.Direction.x * this.speed, 0, this.Direction.z * this.speed);
            var otherSpeed = new THREE.Vector3(otherBall.Direction.x * otherBall.speed, 0, otherBall.Direction.z * otherBall.speed);

            var unitNormal = new THREE.Vector3(otherBallPos.x - thisBallPos.x, 0, otherBallPos.z - thisBallPos.z).normalize();
            var unitTangent = new THREE.Vector3(-unitNormal.z, unitNormal.y, unitNormal.x);

            var thisBallNV = unitNormal.dot(thisSpeed);
            var otherBallNV = unitNormal.dot(otherSpeed);
            var thisBallTV = unitTangent.dot(thisSpeed);
            var otherBallTV = unitTangent.dot(otherSpeed);

            var PthisBallNV = (thisBallNV * (this.Radius - otherBall.Radius) + 2 * otherBall.Radius * otherBallNV) / (this.Radius + otherBall.Radius);
            var PotherBallNV = (otherBallNV * (otherBall.Radius - this.Radius) + 2 * this.Radius * thisBallNV) / (this.Radius + otherBall.Radius);

            var thisBallNVec = new THREE.Vector3().copy(unitNormal).multiplyScalar(PthisBallNV);
            var thisBallTVec = new THREE.Vector3().copy(unitTangent).multiplyScalar(thisBallTV);
            var otherBallNVec = new THREE.Vector3().copy(unitNormal).multiplyScalar(PotherBallNV);
            var otherBallTVec = new THREE.Vector3().copy(unitTangent).multiplyScalar(otherBallTV);

            var thisBallVec = new THREE.Vector3().copy(thisBallNVec).add(thisBallTVec);
            var otherBallVec = new THREE.Vector3().copy(otherBallNVec).add(otherBallTVec);

            var thisBallSpeed = thisBallVec.length();
            var otherBallSpeed = otherBallVec.length();

            this.Direction = thisBallVec.normalize();
            otherBall.Direction = otherBallVec.normalize();

            this.SetSpeed(thisBallSpeed);
            otherBall.SetSpeed(otherBallSpeed);
        }
    }

    UpdateRotation()
    {
        var distance = this.currentSpeed.length();
        var angle = (distance / (2*this.Radius*Math.PI)) * Math.PI;
        var axis = new THREE.Vector3(this.Direction.z, 0, -this.Direction.x);

        var quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(axis, angle);
        var curQuaternion = this.Mesh.quaternion;
        curQuaternion.multiplyQuaternions(quaternion, curQuaternion);
        curQuaternion.normalize();
        this.Mesh.setRotationFromQuaternion(curQuaternion);
    }

    SetPosition(x, z)
    {
        if(this.startPos == null)
            this.startPos = new THREE.Vector2(x, z);
        this.Mesh.position.x = x;
        this.Mesh.position.z = z;
    }

    SetDirection(x, z)
    {
        this.Direction.set(x,0,z);
        this.Direction.normalize();
    }

    SetSpeed(speed)
    {
        this.speed = speed;
    }

    ResetPos()
    {
        if(this.startPos != null) {
            this.SetPosition(this.startPos.x, this.startPos.y);
            this.speed = 0;
            this.Direction = this.Direction.set(0,0,0);
        }
    }

    get mesh()
    {
        return this.Mesh;
    }

    get position()
    {
        return this.Mesh.position;
    }
}

class PoolBall extends Ball
{
    constructor(name, type)
    {
        super(name, type);
    }

    get type()
    {
        return this.Type;
    }
}

class PlayBall extends Ball {
    constructor(name, type, tableGroup) {
        super(name, type);

        this.PowerDirection = true;
        this.tableGroup = tableGroup;

        this.CeuLenght = 100;
        this.CeuMaterial = new THREE.MeshLambertMaterial({color: 0x800000});
        this.CeuGeo = new THREE.CylinderGeometry(0.5, 1.5, this.CeuLenght, 32);
        this.CeuMesh = new THREE.Mesh(this.CeuGeo, this.CeuMaterial);

        this.PowerCubeMat = new THREE.MeshLambertMaterial({color: 0xFFFF00});
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
        this.LineGeo.vertices.push(new THREE.Vector3().copy(this.position));
        this.LineGeo.vertices.push(new THREE.Vector3(0,0,-75));

        this.Line = new THREE.Line(this.LineGeo, this.LineMat);
        this.Line.geometry.dynamic = true;

        this.ShootEvent = new Event('onShoot');
    }

    SetVisibility(state)
    {
        this.ceu.visible = state;
        this.Line.visible = state;
    }

    CheckKeys(controller)
    {
        if(this.ceu.visible) {
            var rot = (parseInt($("#Display").text())/10) * Math.PI / 180;
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
                document.dispatchEvent(this.ShootEvent);
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

        this.LineGeo.vertices.push(new THREE.Vector3().copy(this.position));
        var scaledDirVec = new THREE.Vector2().copy(this.CeuDirection).multiplyScalar(distance);
        this.LineGeo.vertices.push(new THREE.Vector3().copy(this.position).add(new THREE.Vector3(scaledDirVec.x, 0, scaledDirVec.y)));
        this.Line = new THREE.Line(this.LineGeo, this.LineMat);
        this.Line.geometry.verticesNeedUpdate = true;
    }

    get ceuMesh()
    {
        return this.ceu;
    }
}

class Hole
{
    constructor(x, z, name)
    {
        this.name = name;
        this.Radius = 5;
        //this.HoleMat = new THREE.MeshLambertMaterial({color: 0xFF0000, });
        this.HoleMat = new THREE.MeshDepthMaterial({wireframe: true});
        this.HoleGeo = new THREE.SphereGeometry(this.Radius, 10, 10);
        this.HoleMesh = new THREE.Mesh(this.HoleGeo, this.HoleMat);
        this.HoleMesh.receiveShadow = true;
        this.HoleMesh.castShadow = true;

        this.HoleMesh.position.set(x, 0, z);
    }

    CheckBall(ball)
    {
        var distance = this.HoleMesh.position.distanceTo(ball.position);
        if(distance < ball.Radius + this.Radius)
        {
            return ball;
        }
        return null;
    }

    get mesh()
    {
        return this.HoleMesh;
    }
}

class Player
{
    constructor(name, id)
    {
        this.Name = name;
        this.BallType = 0;
        this.OwnBallsPut = 0;
        this.ID = id;
        this.PuttedBalls = [];
    }

    BallsPut(nr)
    {
        this.OwnBallsPut += nr;
    }

    AddBall(ball)
    {
        this.PuttedBalls.push(ball);
    }

    ClearBalls()
    {
        this.PuttedBalls = [];
    }

    get Score()
    {
        return this.OwnBallsPut;
    }
}

class Control
{
    constructor()
    {
        var self = this;
        this.keyList = {};
        $(document).keydown((e)=>{self.OnKeyDown(e)});
        $(document).keyup((e)=>{self.OnKeyUp(e)});
        $(document).scroll(function (e) {
            e.preventDefault();

        });

        //ColorChange CameraRotPad
        $(".cameraRotPad").mouseenter(function () {
            $(this).css("background-color", "#AAAAFF");
        });
        $(".cameraRotPad").mouseleave(function () {
            $(this).css("background-color", "#0000FF");
        });

        //ColorChange CeuRotPad
        $(".ceuRotPad").mouseenter(function () {
            $(this).css("background-color", "#FFAAAA");
        });
        $(".ceuRotPad").mouseleave(function () {
            $(this).css("background-color", "#FF0000");
        });

        //ColorChange CeuRotPad
        $(".ceuRotSpeedPad").mouseenter(function () {
            $(this).css("background-color", "#AACCAA");
        });
        $(".ceuRotSpeedPad").mouseleave(function () {
            $(this).css("background-color", "#00CC00");
        });

        //ColorChange CameraHeightPad
        $(".cameraHeightPad").mouseenter(function () {
            $(this).css("background-color", "#AAFFAA");
        });
        $(".cameraHeightPad").mouseleave(function () {
            $(this).css("background-color", "#00FF00");
        });

        //ColorChange shootbutton
        $("#shootButton").mouseenter(function () {
            $(this).css("background-color", "#FFAAAA");
        });
        $("#shootButton").mouseleave(function () {
            $(this).css("background-color", "#FF0000");
        });

        //ShootButton
        $("#shootButton").on("touchstart mousedown", function () {
            $(this).css("background-color", "#990000");
            self.SetKey("space", true);
        });
        $("#shootButton").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#FF0000");
            self.SetKey("space", false);
        });

        //Dpad1
        $("#dPad1").on("touchstart mousedown", function () {
            $(this).css("background-color", "#000099");
            self.SetKey("a", true);
        });
        $("#dPad1").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#0000FF");
            self.SetKey("a", false);
        });

        //Dpad2
        $("#dPad2").on("touchstart mousedown", function () {
            $(this).css("background-color", "#000099");
            self.SetKey("d", true);
        });
        $("#dPad2").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#0000FF");
            self.SetKey("d", false);

        });

        //Dpad3
        $("#dPad3").on("touchstart mousedown", function () {
            $(this).css("background-color", "#990000");
            self.SetKey("left", true);
        });
        $("#dPad3").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#FF0000");
            self.SetKey("left", false);
        });

        //Dpad4
        $("#dPad4").on("touchstart mousedown", function () {
            $(this).css("background-color", "#990000");
            self.SetKey("right", true);
        });
        $("#dPad4").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#FF0000");
            self.SetKey("right", false);
        });

        //Dpad5
        $("#dPad5").on("touchstart mousedown", function () {
            $(this).css("background-color", "#009900");
            self.SetKey("up", true);
        });
        $("#dPad5").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#00FF00");
            self.SetKey("up", false);
        });

        //Dpad6
        $("#dPad6").on("touchstart mousedown", function () {
            $(this).css("background-color", "#009900");
            self.SetKey("down", true);
        });
        $("#dPad6").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#00FF00");
            self.SetKey("down", false);
        });

        //Dpad 7
        $("#dPad7").on("touchstart mousedown", function () {
            $(this).css("background-color", "#007700");
            self.ChangeValue(false);
        });
        $("#dPad7").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#00CC00");
        });

        //Dpad 8
        $("#dPad8").on("touchstart mousedown", function () {
            $(this).css("background-color", "#007700");
            self.ChangeValue(true);
        });
        $("#dPad8").on("touchend mouseup mouseleave", function () {
            $(this).css("background-color", "#00CC00");
        });
    }

    OnKeyDown(e)
    {
        this.SetKey(this.KeyNormalizer(e.keyCode), true);
    }

    OnKeyUp(e)
    {
        this.SetKey(this.KeyNormalizer(e.keyCode), false);
    }

    SetKey(key, isPressed)
    {
        //only take valid outputs from keyNormalizer
        if(key != null)
        {
            this.keyList[key] = isPressed;
        }
    }

    GetKey(key)
    {
        return this.keyList[key];
    }

    KeyNormalizer(key)
    {
        switch(key)
        {
            //In case of space
            case 32:
                return "space";
            //In case of up
            case 38:
                return "up";
            //In case of left
            case 37:
                return "left";
            //In case of right
            case 39:
                return "right";
            //In case of down
            case 40:
                return "down";
            //In case of
            case 65:
                return "a";
            //In case of d
            case 68:
                return "d";
            //In case of q
            case 81:
                this.ChangeValue(false);
                break;
            //In case of e
            case 69:
                this.ChangeValue(true);
                break;
            //In case none of the above return null
            default:
                return null;
        }
    }

    ChangeValue(increment)
    {
        var $Display = $("#Display");
        var currentValue = $Display.text();
        if(increment && currentValue < 20)
        {
            currentValue = parseInt(currentValue) + 1;
        }
        else if(!increment && currentValue > 1)
        {
            currentValue = parseInt(currentValue) - 1;
        }
        $Display.text(currentValue);
    }
}

class PoolTable
{
    constructor()
    {
        this.tableGroup = new THREE.Group();

        var borderMat = new THREE.MeshLambertMaterial({color: 0x00FF00});
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

