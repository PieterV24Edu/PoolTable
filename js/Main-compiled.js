"use strict";

//1 unit = 1cm

/*$(document).ready(function () {

});*/

var players = [],
    currentPlayer,
    otherPlayer;

var container;

var camera, scene, renderer, loader, textureManager;

var keyboardControl;

var clock;

var poolTable, ballArray, holeArray, playBallStart, eightballstart;
var startPosArray;
var collisionArray = [],
    collisionCount
var ballShot = false;

var windowHalfX, windowHalfY;

function initPlayers() {
    var player1 = document.getElementById("player1Name");
    var player2 = document.getElementById("player2Name");
    players[0] = new Player(player1.value, "player1");
    players[1] = new Player(player2.value, "player2");
    currentPlayer = 0;
    otherPlayer = 1;
    $("#currentPlayer").text("It is " + players[currentPlayer].Name + "'s turn");
    updateScore(0, 0);
    updateScore(1, 0);
    $(".GameOverlay").show();
    $(".loaderElement").hide();
    init();
}

function init() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    container = document.createElement("div");
    document.body.appendChild(container);

    keyboardControl = new Control();
    textureManager = new THREE.LoadingManager();
    loader = new THREE.TextureLoader(textureManager);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xFFFFFF);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 200;
    camera.position.y = 100;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    var amLight = new THREE.AmbientLight(0x777777);
    amLight.position.y = 15;

    var light = new THREE.PointLight(0xffffff, 1.5, 500);
    light.position.y = 50;
    light.castShadow = true;

    poolTable = new PoolTable();

    holeArray = [new Hole(72.5, -147.5, 1), new Hole(-72.5, -147.5, 2), new Hole(72.5, 0, 3), new Hole(-72.5, 0, 4), new Hole(72.5, 147.5, 5), new Hole(-72.5, 147.5, 6)];

    ballArray = [new PlayBall(0, 0, poolTable.children), new PoolBall(1, 1), new PoolBall(2, 1), new PoolBall(3, 1), new PoolBall(4, 1), new PoolBall(5, 1), new PoolBall(6, 1), new PoolBall(7, 1), new PoolBall(8, 8), new PoolBall(9, 2), new PoolBall(10, 2), new PoolBall(11, 2), new PoolBall(12, 2), new PoolBall(13, 2), new PoolBall(14, 2), new PoolBall(15, 2)];

    playBallStart = new THREE.Vector2(0, 75);
    eightballstart = new THREE.Vector2(0, -87);

    startPosArray = [[0, -75], [-3, -81], [3, -81], [-6, -87], [6, -87], [-9, -93], [3, -93], [-3, -93], [9, -93], [-12, -99], [-6, -99], [0, -99], [6, -99], [12, -99]];

    setBallPositions();

    for (var i = 0; i < ballArray.length; i++) {
        //Add Textures
        if (i >= 1 && i <= 15) ballArray[i].Material.map = loader.load("assets/textures/Ball" + i + ".png");

        //Populate collision array
        var tempArray = [];
        for (var j = i + 1; j < ballArray.length; j++) {
            tempArray[j] = false;
        }
        collisionArray[i] = tempArray;
    }

    scene.add(amLight);
    scene.add(light);

    scene.add(poolTable.mesh);

    scene.add(ballArray[0].mesh);
    scene.add(ballArray[0].ceuMesh);
    for (var _i = 1; _i < ballArray.length; _i++) {
        scene.add(ballArray[_i].mesh);
    }

    for (var _i2 = 0; _i2 < holeArray.length; _i2++) {
        scene.add(holeArray[_i2].mesh);
    }

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('onCollision', function () {
        collisionCount++;
    });
    document.addEventListener('onShoot', function () {
        players[currentPlayer].ClearBalls();
        ballShot = true;
        collisionCount = 0;
    });

    textureManager.onLoad = function () {
        animate();
    };
}

function animate() {
    requestAnimationFrame(animate);

    render();
}

function render() {
    var clockDelta = clock.getDelta();
    var player = players[currentPlayer];

    for (var i = 0; i < ballArray.length; i++) {
        if (ballArray[i].inScene) ballArray[i].CalcFrame(clockDelta, poolTable.children);
    }

    for (var _i3 = 0; _i3 < ballArray.length; _i3++) {
        for (var j = _i3 + 1; j < ballArray.length; j++) {
            if (ballArray[_i3].inScene && ballArray[j].inScene) {
                if (collisionArray[_i3][j] == false) {
                    ballArray[_i3].BallCollision(ballArray[j]);
                }
                collisionArray[_i3][j] = ballArray[_i3].CheckBallCollision(ballArray[j]);
            }
        }
    }

    for (var _i4 = 0; _i4 < holeArray.length; _i4++) {
        for (var _j = 0; _j < ballArray.length; _j++) {
            if (ballArray[_j].inScene) {
                var col = holeArray[_i4].CheckBall(ballArray[_j]);
                if (col != null) {
                    console.log(col.name + " was deleted");
                    player.AddBall(col);
                    if (col.Type != 0 && col.Type != 8) {
                        col.inScene = false;
                        scene.remove(col.mesh);
                    } else {
                        col.ResetPos();
                    }
                }
            }
        }
    }

    checkKeys();
    if (checkMovingBalls()) {
        ballArray[0].SetVisibility(false);
    } else {
        if (ballShot == true) {
            applyRules();
            ballShot = false;
        }
        ballArray[0].SetVisibility(true);
        ballArray[0].CheckKeys(keyboardControl);
        scene.remove(ballArray[0].Line);
        ballArray[0].CalcNewLine();
        scene.add(ballArray[0].Line);
    }
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer.render(scene, camera);
}

function checkKeys() {
    var center = new THREE.Vector3(0, 0, 0);
    if (keyboardControl.GetKey("left") == true) {
        var newRot = calcNewRot(camera.position.x, camera.position.z, 0.05, center);
        camera.position.set(newRot.x, camera.position.y, newRot.y);
    }
    if (keyboardControl.GetKey("right") == true) {
        var newRot = calcNewRot(camera.position.x, camera.position.z, -0.05, center);
        camera.position.set(newRot.x, camera.position.y, newRot.y);
    }
    if (keyboardControl.GetKey("up")) {
        if (camera.position.y < 200) camera.position.y += 5;
    }
    if (keyboardControl.GetKey("down")) {
        if (camera.position.y > 20) camera.position.y += -5;
    }
}

function calcNewRot(x, y, rotation, center) {
    var center = new THREE.Vector2(center.x, center.y);
    var vector = new THREE.Vector2(x, y);
    vector.rotateAround(center, rotation);
    return vector;
}

function checkMovingBalls() {
    for (var i = 0; i < ballArray.length; i++) {
        if (ballArray[i].speed > 0 && ballArray[i].inScene) return true;
    }
    return false;
}

function setBallPositions() {
    var fullCornerSet = false;
    var halfCornerSet = false;
    var indexArray = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12];
    var ballIndexArray = [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];

    ballArray[0].SetPosition(playBallStart.x, playBallStart.y);
    ballArray[1].SetPosition(startPosArray[0][0], startPosArray[0][1]);
    ballArray[8].SetPosition(eightballstart.x, eightballstart.y);

    while (indexArray.length > 0 && ballIndexArray.length > 0) {
        //Select random ball
        var ranBallIndex = Math.floor(Math.random() * ballIndexArray.length);
        var ballIndex = ballIndexArray[ranBallIndex];
        if (ballArray[ballIndex].type == 1 && !fullCornerSet) {
            ballArray[ballIndex].SetPosition(startPosArray[9][0], startPosArray[9][1]);
            fullCornerSet = true;
        } else if (ballArray[ballIndex].type == 2 && !halfCornerSet) {
            ballArray[ballIndex].SetPosition(startPosArray[13][0], startPosArray[13][1]);
            halfCornerSet = true;
        } else {
            var ranPosIndex = Math.floor(Math.random() * indexArray.length);
            var posIndex = indexArray[ranPosIndex];
            indexArray.splice(ranPosIndex, 1);

            ballArray[ballIndex].SetPosition(startPosArray[posIndex][0], startPosArray[posIndex][1]);
        }
        ballIndexArray.splice(ranBallIndex, 1);
    }
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function applyRules() {
    var player = players[currentPlayer];
    var otherPlay = players[otherPlayer];
    var ownPut = false;
    var otherPut = false;
    var balls = player.PuttedBalls;
    if (balls.length > 0) {
        if (player.BallType == 0) {
            for (var i = 0; i < balls.length; i++) {
                switch (balls[i].Type) {
                    case 1:
                        player.BallType = 1;
                        otherPlay.BallType = 2;
                        break;
                    case 2:
                        player.BallType = 2;
                        otherPlay.BallType = 1;
                        break;
                }
                if (balls[i].Type != 0 && balls[i].Type != 8) break;
            }
        }
        if (player.BallType != 0) {
            for (var _i5 = 0; _i5 < balls.length; _i5++) {
                switch (balls[_i5].Type) {
                    case 0:
                        switchPlayer();
                        break;
                    case 8:
                        if (player.Score >= 7) {
                            balls[_i5].ResetPos();
                            switchPlayer();
                        } else alert(player.Name + " Wins");

                        break;
                    case 1:
                        if (player.BallType == 1) {
                            updateScore(currentPlayer, 1);
                            ownPut = true;
                        } else if (otherPlay.BallType == 1) {
                            updateScore(otherPlayer, 1);
                            otherPut = true;
                        }
                        break;
                    case 2:
                        if (player.BallType == 2) {
                            updateScore(currentPlayer, 1);
                            ownPut = true;
                        } else if (otherPlay.BallType == 2) {
                            updateScore(otherPlayer, 1);
                            otherPut = true;
                        }
                        break;
                }
            }
        }
    }
    if (otherPut && !ownPut || !ownPut) switchPlayer();
    if (collisionCount == 0 && balls.length == 0) switchPlayer();
}

function switchPlayer() {
    if (currentPlayer == 0) {
        currentPlayer = 1;
        otherPlayer = 0;
    } else if (currentPlayer == 1) {
        currentPlayer = 0;
        otherPlayer = 1;
    }
    $("#currentPlayer").text("It is " + players[currentPlayer].Name + "'s turn");
}

function updateScore(playerNr, score) {
    var player = players[playerNr];
    player.BallsPut(score);
    var playerText = document.getElementById(player.ID);
    $(playerText).text(player.Name + ": " + player.Score + "/7");
    $("#BallAssign").text(players[0].Name + ": " + TypeToString(players[0].BallType) + " " + players[1].Name + ": " + TypeToString(players[1].BallType));
}

function TypeToString(nr) {
    if (nr == 1) return "Whole";else if (nr == 2) return "Half";else return "";
}

//# sourceMappingURL=Main-compiled.js.map