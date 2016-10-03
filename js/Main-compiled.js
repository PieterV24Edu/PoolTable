'use strict';

//1 unit = 1cm

$(document).ready(function () {
    init();
    animate();
});

var container;

var camera, scene, renderer;

var cameraControl;

var clock;

var poolTable,
    ballArray,
    playBallStart = 75,
    eightballstart;
var startPosArray;
var collisionArray = [];

var windowHalfX, windowHalfY;

function init() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    container = document.createElement("div");
    document.body.appendChild(container);

    cameraControl = new CameraControl();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0000FF);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 210;
    //camera.position.x = -100;
    //camera.position.y = 200;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    var amLight = new THREE.AmbientLight(0x777777);
    amLight.position.y = 15;

    var light = new THREE.PointLight(0xffffff, 1.5, 500);
    light.position.y = 50;
    light.castShadow = true;

    poolTable = new PoolTable();

    ballArray = [new PoolBall(0xFFFFFF, 0), new PoolBall(0xDB7D3E, 1), new PoolBall(0xB350BC, 2), new PoolBall(0x6B8AC9, 3), new PoolBall(0xB1A627, 4), new PoolBall(0x000000, 5), new PoolBall(0x41AE38, 6), new PoolBall(0xD08499, 7), new PoolBall(0x404040, 8), new PoolBall(0x9AA1A1, 9), new PoolBall(0x2E6E89, 10), new PoolBall(0x7E3DB5, 11), new PoolBall(0x2E388D, 12), new PoolBall(0x4F321F, 13), new PoolBall(0x35461B, 14), new PoolBall(0x963430, 15)];

    playBallStart = new THREE.Vector2(0, 75);
    eightballstart = new THREE.Vector2(0, -87);

    startPosArray = [[playBallStart.x, playBallStart.y], [0, -75], [-3, -81], [3, -81], [-6, -87], [eightballstart.x, eightballstart.y], [6, -87], [-9, -93], [-3, -93], [3, -93], [9, -93], [-12, -99], [-6, -99], [0, -99], [6, -99], [12, -99]];

    for (var i = 0; i < ballArray.length; i++) {
        ballArray[i].position.set(startPosArray[i][0], 0, startPosArray[i][1]);
    }

    for (var _i = 0; _i < ballArray.length; _i++) {
        var tempArray = [];
        for (var j = 0 + _i; j < ballArray.length; j++) {
            tempArray[j] = false;
        }
        collisionArray[_i] = tempArray;
    }

    scene.add(amLight);
    scene.add(light);

    scene.add(poolTable.mesh);

    for (var _i2 = 0; _i2 < ballArray.length; _i2++) {
        scene.add(ballArray[_i2].mesh);
    }

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('click', onClick);
}

function animate() {
    requestAnimationFrame(animate);

    render();
}

function render() {
    var clockDelta = clock.getDelta();

    for (var i = 0; i < ballArray.length; i++) {
        ballArray[i].CalcMovement(clockDelta, poolTable.children);
    }

    for (var _i3 = 0; _i3 < ballArray.length; _i3++) {
        for (var j = _i3 + 1; j < ballArray.length; j++) {
            if (collisionArray[_i3][j] == false) {
                ballArray[_i3].BallCollision(ballArray[j]);
            }
            collisionArray[_i3][j] = ballArray[_i3].CheckBallCollision(ballArray[j]);
        }
    }

    //checkKeys();
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer.render(scene, camera);
}

function checkKeys() {
    var center = new THREE.Vector3(0, 0, 0);
    if (cameraControl.GetKey("left") == true) {
        var newRot = calcNewRot(camera.position.x, camera.position.z, 0.05, center);
        camera.position.set(newRot.x, camera.position.y, newRot.y);
    }
    if (cameraControl.GetKey("right") == true) {
        var newRot = calcNewRot(camera.position.x, camera.position.z, -0.05, center);
        camera.position.set(newRot.x, camera.position.y, newRot.y);
    }
    if (cameraControl.GetKey("up") == true) {
        var newPos = calcNewScalarPos(camera.position.x, camera.position.z, 1.5, true);
        camera.position.x = newPos.x;
        camera.position.z = newPos.y;
    }
    if (cameraControl.GetKey("down") == true) {
        var newPos = calcNewScalarPos(camera.position.x, camera.position.z, 1.5, false);
        camera.position.x = newPos.x;
        camera.position.z = newPos.y;
    }
    if (cameraControl.GetKey("plus")) {
        camera.position.y += 5;
    }
    if (cameraControl.GetKey("minus")) {
        camera.position.y += -5;
    }
}

function calcNewRot(x, y, rotation, center) {
    var center = new THREE.Vector2(center.x, center.y);
    var vector = new THREE.Vector2(x, y);
    vector.rotateAround(center, rotation);
    return vector;
}

function calcNewScalarPos(x, z, scalar, moveToward) {
    var vector = new THREE.Vector2(x, z);
    if (moveToward) {
        if (vector.x < 0 && vector.x + scalar < -1 && vector.x != 0) vector.x += scalar;else if (vector.x - scalar > 1 && vector.x != 0) vector.x -= scalar;
        if (vector.y < 0 && vector.y + scalar < -1 && vector.y != 0) vector.y += scalar;else if (vector.y - scalar > 1 && vector.y != 0) vector.y -= scalar;
    } else {
        if (vector.x < 0 && vector.x - scalar < -1 && vector.x != 0) vector.x -= scalar;else if (vector.x + scalar > 1 && vector.x != 0) vector.x += scalar;
        if (vector.y < 0 && vector.y - scalar < -1 && vector.y != 0) vector.y -= scalar;else if (vector.y + scalar > 1 && vector.y != 0) vector.y += scalar;
    }
    return vector;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick() {
    ballArray[0].SetDirection(0, -1);
    ballArray[0].SetSpeed(200);
}

//# sourceMappingURL=Main-compiled.js.map