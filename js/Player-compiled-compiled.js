"use strict";

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Player = function () {
    function Player(name, id) {
        _classCallCheck(this, Player);

        this.Name = name;
        this.BallType = 0;
        this.OwnBallsPut = 0;
        this.ID = id;
        this.PuttedBalls = [];
    }

    _createClass(Player, [{
        key: "BallsPut",
        value: function BallsPut(nr) {
            this.OwnBallsPut += nr;
        }
    }, {
        key: "ClearBalls",
        value: function ClearBalls() {
            this.PuttedBalls = [];
        }
    }, {
        key: "Score",
        get: function get() {
            return this.OwnBallsPut;
        }
    }]);

    return Player;
}();

//# sourceMappingURL=Player-compiled.js.map

//# sourceMappingURL=Player-compiled-compiled.js.map