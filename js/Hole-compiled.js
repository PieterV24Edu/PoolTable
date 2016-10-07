"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hole = function () {
    function Hole(x, z, name) {
        _classCallCheck(this, Hole);

        this.name = name;
        this.Radius = 5;
        this.OnFoulEvent = new Event("onFoul");
        //this.HoleMat = new THREE.MeshLambertMaterial({color: 0xFF0000, });
        this.HoleMat = new THREE.MeshDepthMaterial({ wireframe: true });
        this.HoleGeo = new THREE.SphereGeometry(this.Radius, 10, 10);
        this.HoleMesh = new THREE.Mesh(this.HoleGeo, this.HoleMat);
        this.HoleMesh.receiveShadow = true;
        this.HoleMesh.castShadow = true;

        this.HoleMesh.position.set(x, 0, z);
    }

    _createClass(Hole, [{
        key: "CheckBall",
        value: function CheckBall(ball) {
            var distance = this.HoleMesh.position.distanceTo(ball.position);
            if (distance < ball.Radius + this.Radius) {
                if (ball.name == 8 || ball.name == 0) {
                    ball.ResetPos();
                    document.dispatchEvent(this.OnFoulEvent);
                    return null;
                } else ball.inScene = false;
                return ball;
            }
            return null;
        }
    }, {
        key: "mesh",
        get: function get() {
            return this.HoleMesh;
        }
    }]);

    return Hole;
}();

//# sourceMappingURL=Hole-compiled.js.map