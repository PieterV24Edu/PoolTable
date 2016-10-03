//1 unit = 1cm

$(document).ready(function () {
    init();
});

var container;

var camera, scene, renderer, loader, textureManager;

var myTextureArray = [];

var cameraControl;

var clock;

var poolTable, ballArray, playBallStart = 75, eightballstart;
var startPosArray;
var collisionArray = [];

var windowHalfX, windowHalfY;

function init() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    container = document.createElement("div");
    document.body.appendChild(container);

    cameraControl = new CameraControl();
    textureManager = new THREE.LoadingManager();
    loader = new THREE.TextureLoader(textureManager);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0000FF);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    //camera.position.y = 210;
    camera.position.x = -200;
    camera.position.y = 100;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    var amLight = new THREE.AmbientLight(0x777777);
    amLight.position.y = 15;

    var light = new THREE.PointLight(0xffffff, 1.5, 500);
    light.position.y = 50;
    light.castShadow = true;

    poolTable = new PoolTable();

    ballArray = [
        new PoolBall(0),
        new PoolBall(1),
        new PoolBall(2),
        new PoolBall(3),
        new PoolBall(4),
        new PoolBall(5),
        new PoolBall(6),
        new PoolBall(7),
        new PoolBall(8),
        new PoolBall(9),
        new PoolBall(10),
        new PoolBall(11),
        new PoolBall(12),
        new PoolBall(13),
        new PoolBall(14),
        new PoolBall(15)
    ];

    playBallStart = new THREE.Vector2(0, 75);
    eightballstart = new THREE.Vector2(0, -87);

    startPosArray = [
        [playBallStart.x, playBallStart.y],
        [0,-75],
        [-3, -81],[3, -81],
        [-6, -87],[eightballstart.x, eightballstart.y],[6, -87],
        [-9, -93],[-3, -93],[3, -93],[9, -93],
        [-12, -99],[-6, -99],[0, -99],[6, -99],[12, -99]
    ];

    for(let i = 0; i < ballArray.length; i++)
    {
        ballArray[i].position.set(startPosArray[i][0],2.85,startPosArray[i][1]);
        ballArray[i].mesh.rotation.z = 0.5*Math.PI;
        ballArray[i].mesh.rotation.y = -0.5*Math.PI;
        if(i >= 1 && i <= 15)
            ballArray[i].Material.map = loader.load("assets/textures/Ball" + i + ".png");
    }

    textureManager.onStart = function () {
        for(let i = 1; i < ballArray; i++)
        {
            ballArray[i].Material.map = loader.load("assets/textures/Ball" + i + ".png");
        }
    };

    for(let i = 0; i < ballArray.length; i++)
    {
        var tempArray = [];
        for(let j = 0 + i; j < ballArray.length; j++)
        {
            tempArray[j] = false;
        }
        collisionArray[i] = tempArray;
    }

    scene.add(amLight);
    scene.add(light);

    scene.add(poolTable.mesh);

    for(let i = 0; i < ballArray.length; i++)
    {
        scene.add(ballArray[i].mesh);
    }

    window.addEventListener('resize', onWindowResize, false);

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

    for(let i = 0; i < ballArray.length; i++)
    {
        ballArray[i].CalcMovement(clockDelta, poolTable.children);
    }

    for(let i = 0; i < ballArray.length; i++)
    {
        for(let j = i + 1; j < ballArray.length; j++)
        {
            if(collisionArray[i][j] == false)
            {
                ballArray[i].BallCollision(ballArray[j]);
            }
            collisionArray[i][j] = ballArray[i].CheckBallCollision(ballArray[j]);
        }
    }

    checkKeys();
    camera.lookAt(new THREE.Vector3(0,0,0));

    renderer.render(scene, camera);
}

function checkKeys() {
    var center = new THREE.Vector3(0,0,0);
    if(cameraControl.GetKey("left") == true)
    {
        var newRot = calcNewRot(camera.position.x, camera.position.z, 0.05, center);
        camera.position.set(newRot.x, camera.position.y, newRot.y);
    }
    if(cameraControl.GetKey("right") == true)
    {
        var newRot = calcNewRot(camera.position.x, camera.position.z, -0.05, center);
        camera.position.set(newRot.x, camera.position.y, newRot.y);
    }
    if(cameraControl.GetKey("up"))
    {
        if(camera.position.y < 200)
            camera.position.y += 5;
    }
    if(cameraControl.GetKey("down"))
    {
        if(camera.position.y > 20)
            camera.position.y += -5;
    }

    if(cameraControl.GetKey("a") && cameraControl.GetKey("d"))
    {
        onClick();
    }
}

function calcNewRot(x,y, rotation, center){
    var center = new THREE.Vector2(center.x,center.y);
    var vector = new THREE.Vector2(x,y);
    vector.rotateAround(center, rotation);
    return vector;
}

function onWindowResize() {
    windowHalfX = window.innerWidth /2;
    windowHalfY = window.innerHeight /2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function  onClick() {
    ballArray[0].SetDirection(0,-1);
    ballArray[0].SetSpeed(200);
}