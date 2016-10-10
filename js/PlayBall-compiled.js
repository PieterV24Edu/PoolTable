"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlayBall = function (_Ball) {
    _inherits(PlayBall, _Ball);

    function PlayBall(name, type, tableGroup) {
        _classCallCheck(this, PlayBall);

        var _this = _possibleConstructorReturn(this, (PlayBall.__proto__ || Object.getPrototypeOf(PlayBall)).call(this, name, type));

        _this.PowerDirection = true;
        _this.tableGroup = tableGroup;

        _this.CeuLenght = 100;
        _this.CeuMaterial = new THREE.MeshLambertMaterial({ color: 0x800000 });
        _this.CeuGeo = new THREE.CylinderGeometry(0.5, 1.5, _this.CeuLenght, 32);
        _this.CeuMesh = new THREE.Mesh(_this.CeuGeo, _this.CeuMaterial);

        _this.PowerCubeMat = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
        _this.PowerCubeGeo = new THREE.BoxGeometry(2.5, 20, 2.5);
        _this.PowerCube = new THREE.Mesh(_this.PowerCubeGeo, _this.PowerCubeMat);

        _this.ceu = new THREE.Object3D();
        _this.ceu.add(_this.CeuMesh);
        _this.ceu.add(_this.PowerCube);
        _this.ceu.position.set(_this.Mesh.position.x, _this.Mesh.position.y, _this.Mesh.position.z);

        _this.CeuMesh.rotation.x = -95 * Math.PI / 180;
        _this.CeuMesh.position.z = Math.cos(5 * Math.PI / 180) * (_this.CeuLenght + _this.Radius + 10 + _this.Radius) / 2;
        _this.CeuMesh.position.y = Math.sin(5 * Math.PI / 180) * (_this.CeuLenght + _this.Radius + 10 + _this.Radius) / 2;

        _this.PowerCube.position.y = 15;

        _this.CeuDirection = new THREE.Vector2(0, -1);

        _this.LineMat = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        _this.LineGeo = new THREE.Geometry();
        _this.LineGeo.vertices.push(new THREE.Vector3().copy(_this.position));
        _this.LineGeo.vertices.push(new THREE.Vector3(0, 0, -75));

        _this.Line = new THREE.Line(_this.LineGeo, _this.LineMat);
        _this.Line.geometry.dynamic = true;

        _this.ShootEvent = new Event('onShoot');
        return _this;
    }

    _createClass(PlayBall, [{
        key: "SetVisibility",
        value: function SetVisibility(state) {
            this.ceu.visible = state;
            this.Line.visible = state;
        }
    }, {
        key: "CheckKeys",
        value: function CheckKeys(controller) {
            if (this.ceu.visible) {
                var rot = parseInt($("#Display").text()) / 10 * Math.PI / 180;
                if (controller.GetKey("a")) {
                    this.ceu.rotateY(rot);
                    this.CeuDirection.rotateAround(new THREE.Vector2(0, 0), -rot);
                }
                if (controller.GetKey("d")) {
                    this.ceu.rotateY(-rot);
                    this.CeuDirection.rotateAround(new THREE.Vector2(0, 0), rot);
                }
                if (controller.GetKey("space")) {
                    this.StartMoving(this.CeuDirection, this.PowerCube.scale.y * 300);
                    document.dispatchEvent(this.ShootEvent);
                }
            }
        }
    }, {
        key: "SetPosition",
        value: function SetPosition(x, z) {
            _get(PlayBall.prototype.__proto__ || Object.getPrototypeOf(PlayBall.prototype), "SetPosition", this).call(this, x, z);
            this.ceu.position.set(x, this.Mesh.position.y, z);
        }
    }, {
        key: "CalcFrame",
        value: function CalcFrame(delta, tableGroup) {
            _get(PlayBall.prototype.__proto__ || Object.getPrototypeOf(PlayBall.prototype), "CalcFrame", this).call(this, delta, tableGroup);
            this.ceu.position.add(this.currentSpeed);
            if (this.ceu.visible) {
                if (this.PowerCube.scale.y <= 0.1 && this.PowerDirection) {
                    this.PowerDirection = false;
                    this.PowerCube.scale.y = 0.1;
                }
                if (this.PowerCube.scale.y >= 1 && !this.PowerDirection) {
                    this.PowerDirection = true;
                    this.PowerCube.scale.y = 1;
                }

                if (!this.PowerDirection) this.PowerCube.scale.y += 1 * delta;
                if (this.PowerDirection) this.PowerCube.scale.y -= 1 * delta;
            }
        }
    }, {
        key: "StartMoving",
        value: function StartMoving(direction, speed) {
            this.SetDirection(direction.x, direction.y);
            this.speed = speed;
        }
    }, {
        key: "CalcNewLine",
        value: function CalcNewLine() {
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
    }, {
        key: "ceuMesh",
        get: function get() {
            return this.ceu;
        }
    }]);

    return PlayBall;
}(Ball);

//# sourceMappingURL=PlayBall-compiled.js.map