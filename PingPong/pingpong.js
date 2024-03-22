// Initialize variables
var scene, camera, renderer;
var ball, paddle, aiPaddle;
var paddleHeight = 20;
var paddleWidth = 100;
var ballRadius = 10;
var ballDirection = new THREE.Vector2(1, 1).normalize();
var speed = 5;
var aiSpeed = 4;

// Initialize the scene
function init() {
    // Create the scene
    scene = new THREE.Scene();

    // Create the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;

    // Create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add ambient light
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Create the player's paddle
    var paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, 10);
    var paddleMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle.position.y = -150;
    scene.add(paddle);

    // Create the AI's paddle
    aiPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    aiPaddle.position.y = 150;
    scene.add(aiPaddle);

    // Create the ball
    var ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
    var ballMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    // Start the game loop
    animate();

    // Add mouse event listeners
    document.addEventListener('mousemove', onMouseMove, false);
}

// Mouse move event handler
function onMouseMove(event) {
    var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    var mouseY = - (event.clientY / window.innerHeight) * 2 + 1;
    var vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    paddle.position.x = pos.x;
}

// Game loop
function animate() {
    requestAnimationFrame(animate);

    // Move the ball
    ball.position.x += ballDirection.x * speed;
    ball.position.y += ballDirection.y * speed;

    // Ball collision with walls
    if (ball.position.x > (window.innerWidth / 2) - ballRadius || ball.position.x < -(window.innerWidth / 2) + ballRadius) {
        ballDirection.x *= -1;
    }
    if (ball.position.y > (window.innerHeight / 2) - ballRadius || ball.position.y < -(window.innerHeight / 2) + ballRadius) {
        ballDirection.y *= -1;
    }

    // Ball collision with player's paddle
    if (ball.position.x > paddle.position.x - paddleWidth / 2 &&
        ball.position.x < paddle.position.x + paddleWidth / 2 &&
        ball.position.y > paddle.position.y - paddleHeight / 2 &&
        ball.position.y < paddle.position.y + paddleHeight / 2) {
        ballDirection.y *= -1;
    }

    // Ball collision with AI's paddle
    if (ball.position.x > aiPaddle.position.x - paddleWidth / 2 &&
        ball.position.x < aiPaddle.position.x + paddleWidth / 2 &&
        ball.position.y > aiPaddle.position.y - paddleHeight / 2 &&
        ball.position.y < aiPaddle.position.y + paddleHeight / 2) {
        ballDirection.y *= -1;
    }

    // AI movement
    if (ball.position.y > aiPaddle.position.y) {
        aiPaddle.position.x += aiSpeed;
    } else {
        aiPaddle.position.x -= aiSpeed;
    }

    renderer.render(scene, camera);
}

// Initialize the game
init();