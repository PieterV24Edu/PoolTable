"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlayBall = function (_Ball) {
    _inherits(PlayBall, _Ball);

    function PlayBall(name) {
        _classCallCheck(this, PlayBall);

        var _this = _possibleConstructorReturn(this, (PlayBall.__proto__ || Object.getPrototypeOf(PlayBall)).call(this, name));

        _this.BallGroup = new THREE.Group();
        _this.CeuMaterial = new THREE.MeshLambertMaterial({ color: 0x800000 });
        _this.CeuGeo = new THREE.CylinderGeometry(2, 2, 150, 32);
        _this.CeuMesh = new THREE.Mesh(_this.CeuGeo, _this.CeuMaterial);
        _this.BallGroup.add(_this.Mesh);
        _this.BallGroup.add(_this.CeuMesh);
        return _this;
    }

    /*get mesh()
    {
        return this.BallGroup;
    }*/


    return PlayBall;
}(Ball);

//# sourceMappingURL=PlayBall-compiled.js.map