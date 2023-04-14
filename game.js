// SELECT CANVAS ELEMENT
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

// AGREGAR BORDE AL LIENZO
cvs.style.border = "0px solid #0ff";

// HAGA LÍNEA GRUESA AL DIBUJAR EN LONA
ctx.lineWidth = 3;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
let LIFE = 3; // EL JUGADOR TIENE 3 VIDAS
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

// CREAR LA PALA
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx :5
}

// DIBUJAR PALETAS
function drawPaddle(){
    ctx.fillStyle = "#FE7700";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    ctx.strokeStyle = "#020400 ";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROLA LA PALETA
document.addEventListener("keydown", function(event){
   if(event.keyCode == 37){
       leftArrow = true;
   }else if(event.keyCode == 39){
       rightArrow = true;
   }
});
document.addEventListener("keyup", function(event){
   if(event.keyCode == 37){
       leftArrow = false;
   }else if(event.keyCode == 39){
       rightArrow = false;
   }
});

// MOVER PALETA
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

// CREA LA PELOTA
const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 4,
    dx : 3 * (Math.random() * 2 - 1),
    dy : -3
}

// DIBUJAR LA PELOTA
function drawBall(){
    ctx.beginPath();
    
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#F1190B";
    ctx.fill();
    
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    
    ctx.closePath();
}

// MOVER LA PELOTA
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// DETECCIÓN DE COLISIÓN DE BOLAS Y PAREDES
function ballWallCollision(){
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx = - ball.dx;
        WALL_HIT.play();
    }
    
    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
        WALL_HIT.play();
    }
    
    if(ball.y + ball.radius > cvs.height){
        LIFE--; // LOSE LIFE
        LIFE_LOST.play();
        resetBall();
    }
}

// RESTABLECER LA PELOTA
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

// COLISIÓN DE PELOTA Y PALETA
function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
        
        // REPRODUCIR SONIDO
        PADDLE_HIT.play();
        
            // COMPROBAR DONDE LA PELOTA TOCA LA PALETA
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        
        // NORMALIZAR LOS VALORES
        collidePoint = collidePoint / (paddle.width/2);
        
        // CALCULAR EL ÁNGULO DE LA PELOTA
        let angle = collidePoint * Math.PI/3;
            
            
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// CREA LOS LADRILLOS
const brick = {
    row : 1,
    column : 19,
    width : 55,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop : 40,
    fillColor : "#66F10B",
    strokeColor : "#000000"
}

let bricks = [];

function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

// dibujar los ladrillos
function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // si el ladrillo no esta roto
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// ball brick collision
function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // si el ladrillo no esta roto
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false; // el ladrillo esta roto
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}

// mostrar estadísticas del juego
function showGameStats(text, textX, textY, img, imgX, imgY){
    // draw text
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    
    // dibujar imagen
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// FUNCIÓN DE DIBUJO
function draw(){
    drawPaddle();
    
    drawBall();
    
    drawBricks();
    
// MOSTRAR PUNTAJE
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
// MOSTRAR VIDAS
    showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width-55, 5); 
    // SHOW LEVEL
    showGameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2 - 30, 5);
}

// juego terminado
function gameOver(){
    if(LIFE <= 0){
        showYouLose();
        GAME_OVER = true;
    }
}

// elevar a mismo nivel
function levelUp(){
    let isLevelDone = true;
    
// comprobar si todos los ladrillos están rotos
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    
    if(isLevelDone){
        WIN.play();
        
        if(LEVEL >= MAX_LEVEL){
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        LEVEL++;
    }
}

// ACTUALIZAR LA FUNCIÓN DEL JUEGO
function update(){
    movePaddle();
    
    moveBall();
    
    ballWallCollision();
    
    ballPaddleCollision();
    
    ballBrickCollision();
    
    gameOver();
    
    levelUp();
}

// GAME LOOP
function loop(){
  // LIMPIAR EL LIENZO
    ctx.drawImage(BG_IMG, 0, 0);
    
    draw();
    
    update();
    
    if(! GAME_OVER){
        requestAnimationFrame(loop);
    }
}
loop();


// SELECCIONE EL ELEMENTO DE SONIDO
const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
// CAMBIAR SONIDO DE IMAGEN_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";
    
    soundElement.setAttribute("src", SOUND_IMG);
    
// MUTE Y UNMUTE SONIDOS
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

// MOSTRAR JUEGO TERMINADO MENSAJE
/* SELECCIONAR ELEMENTOS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// HAGA CLIC EN EL BOTÓN DE JUGAR DE NUEVO
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

//DEMUESTRA QUE GANAS
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// DEMUESTRA QUE PIERDES
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}
