"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlayBall = function (_Ball) {
    _inherits(PlayBall, _Ball);

    function PlayBall(name) {
        _classCallCheck(this, PlayBall);

        var _this = _possibleConstructorReturn(this, (PlayBall.__proto__ || Object.getPrototypeOf(PlayBall)).call(this, name));

        _this.CeuLenght = 150;
        _this.CeuMaterial = new THREE.MeshLambertMaterial({ color: 0x800000 });
        _this.CeuGeo = new THREE.CylinderGeometry(0.5, 1.5, _this.CeuLenght, 32);
        _this.CeuMesh = new THREE.Mesh(_this.CeuGeo, _this.CeuMaterial);
        _this.ceu = new THREE.Object3D();
        _this.ceu.add(_this.CeuMesh);
        _this.ceu.position.set(_this.Mesh.position.x, _this.Mesh.position.y, _this.Mesh.position.z);
        return _this;
    }

    _createClass(PlayBall, [{
        key: "SetPosition",
        value: function SetPosition(x, z) {
            _get(PlayBall.prototype.__proto__ || Object.getPrototypeOf(PlayBall.prototype), "SetPosition", this).call(this, x, z);
            this.ceu.position.set(x, this.Mesh.position.y, z);
        }
    }, {
        key: "CalcMovement",
        value: function CalcMovement(delta, tableGroup) {
            _get(PlayBall.prototype.__proto__ || Object.getPrototypeOf(PlayBall.prototype), "CalcMovement", this).call(this, delta, tableGroup);
            this.ceu.position.add(this.currentSpeed);
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