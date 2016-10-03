"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoolBall = function () {
    function PoolBall(color, name) {
        _classCallCheck(this, PoolBall);

        this.name = name;
        this.Radius = 2.85;
        this.Geometry = new THREE.SphereGeometry(this.Radius, 32, 32);
        this.Material = new THREE.MeshPhongMaterial({ color: color });
        this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
        this.Mesh.position.y = 2.85;

        this.Direction = new THREE.Vector3(0, 0, 0);
        this.Direction.normalize();
        this.speed = 0;
        this.currentSpeed = new THREE.Vector3();
        this.Mesh.castShadow = true;

        this.rayCaster = new THREE.Raycaster();
    }

    _createClass(PoolBall, [{
        key: "CalcMovement",
        value: function CalcMovement(delta, tableGroup) {
            this.UpdateCurrentSpeed(delta);
            if (this.Direction.x > 0) this.CheckColistion(1, 0, 0, tableGroup, delta);else if (this.Direction.x < 0) this.CheckColistion(-1, 0, 0, tableGroup, delta);

            if (this.Direction.z > 0) this.CheckColistion(0, 0, 1, tableGroup, delta);else if (this.Direction.z < 0) this.CheckColistion(0, 0, -1, tableGroup, delta);
            //Move Ball
            this.Mesh.position.add(this.currentSpeed);
            if (this.speed > 0.1) this.speed -= 0.005 * this.speed;else this.speed = 0;
        }
    }, {
        key: "CheckColistion",
        value: function CheckColistion(x, y, z, tGroup, delta) {
            var direction = new THREE.Vector3(x, y, z);
            var directionSpeed = new THREE.Vector3().copy(this.currentSpeed).multiply(direction).toArray().reduce(function (a, b) {
                return a + b;
            }, 0);
            this.rayCaster.set(this.Mesh.position, direction);
            var intersections = this.rayCaster.intersectObjects(tGroup);

            if (intersections.length > 0) {
                var intersection = intersections[0];

                if (intersection.distance < 3 || directionSpeed > intersection.distance) {
                    this.Direction.reflect(intersection.face.normal);
                    this.UpdateCurrentSpeed(delta);
                }
            }
        }
    }, {
        key: "UpdateCurrentSpeed",
        value: function UpdateCurrentSpeed(delta) {
            this.currentSpeed.copy(this.Direction).multiplyScalar(delta * this.speed);
        }
    }, {
        key: "SetDirection",
        value: function SetDirection(x, z) {
            this.Direction.set(x, 0, z);
            this.Direction.normalize();
        }
    }, {
        key: "SetSpeed",
        value: function SetSpeed(speed) {
            this.speed = speed;
        }
    }, {
        key: "CheckBallCollision",
        value: function CheckBallCollision(otherBall) {
            var thisBallPos = new THREE.Vector3().copy(this.mesh.position);
            var otherBallPos = new THREE.Vector3().copy(otherBall.mesh.position);

            var distance = thisBallPos.distanceTo(otherBallPos);

            if (distance < this.Radius + otherBall.Radius) {
                return true;
            }
            return false;
        }
    }, {
        key: "BallCollision",
        value: function BallCollision(otherBall) {
            var thisBallPos = new THREE.Vector3().copy(this.mesh.position);
            var otherBallPos = new THREE.Vector3().copy(otherBall.mesh.position);

            var distance = thisBallPos.distanceTo(otherBallPos);

            if (distance <= this.Radius + otherBall.Radius) {
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
    }, {
        key: "mesh",
        get: function get() {
            return this.Mesh;
        }
    }, {
        key: "position",
        get: function get() {
            return this.Mesh.position;
        }
    }]);

    return PoolBall;
}();

//# sourceMappingURL=PoolBall-compiled.js.map