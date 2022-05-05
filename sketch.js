var PLAY = 1;
var TITLO = 2;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, trex_jumping;
var trex_f_running, trex_f_jumping;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var backgroundImg
var score = 0;
var jumpSound, collidedSound, musicaDeTitulo, muicaDeFaze;

var gameOver, restart;

var sunFlowerIMG, sunFlower;

var bowser, bowserIMG;





function preload() {

    jumpSound = loadSound("assets/sounds/jump.wav")
    collidedSound = loadSound("assets/sounds/collided.wav")
    musicaDeTitulo = loadSound("assets/sounds/02 Title.mp3")
    muicaDeFaze = loadSound("assets/sounds/11a Overworld.mp3")

    backgroundImg = loadImage("assets/backgroundImg.png")
    sunAnimation = loadImage("assets/sun.png");

    trex_running = loadAnimation("assets/trex_2.png", "assets/trex_1.png", "assets/trex_3.png");
    trex_collided = loadAnimation("assets/trex_collided.png");
    trex_jumping = loadAnimation("assets/trexJump.png");
    trex_f_jumping = loadAnimation("assets/pulando f.png");
    trex_f_running = loadAnimation("assets/andando f 2.png", "assets/andando f 1.png", "assets/andando f 3.png");
    

    groundImage = loadImage("assets/ground.png");

    cloudImage = loadImage("assets/cloud.png");

    obstacle1 = loadImage("assets/obstacle1.png");
    obstacle2 = loadImage("assets/obstacle2.png");
    obstacle3 = loadImage("assets/obstacle3.png");
    obstacle4 = loadImage("assets/obstacle4.png");
    obstacle5 = loadImage("assets/obstacle5.png");
    obstacle6 = loadImage("assets/obstacle6.png");

    sunFlowerIMG = loadImage("assets/sunFlower.png");

    gameOverImg = loadImage("assets/gameOver.png");
    restartImg = loadImage("assets/restart.png");
   
    bowserIMG = loadImage("assets/bowser.png")
}

function setup() {
    createCanvas(windowWidth,windowHeight)
    sun = createSprite(width - 230, 30, 10, 10);
    sun.addAnimation("sun", sunAnimation);
    sun.scale = 0.2

    trex = createSprite(50, 700 - 70, 20, 50);


    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided);
    trex.addAnimation("jumping", trex_jumping);
    trex.addAnimation("f_running",trex_f_running);
    trex.addAnimation("f_jumping",trex_f_jumping);
    trex.setCollider('circle', 0, 0, 450)
    trex.scale = 0.08
         //trex.debug=true

    invisibleGround = createSprite(width / 2, height - 10, width, 125);
    invisibleGround.shapeColor = "#f4cbaa";

    ground = createSprite(width / 2, height, width, 2);
    ground.addImage("ground", groundImage);
    ground.x = width / 2
    ground.velocityX = -(6 + 3 * score / 100);

    gameOver = createSprite(width / 2, height / 2 - 50);
    gameOver.addImage(gameOverImg);

    restart = createSprite(width / 2, height / 2);
    restart.addImage(restartImg);
    
    

   
    gameOver.scale = 10.0;
    restart.scale = 5.0;
   

    gameOver.visible = false;
    restart.visible = false;
   


    // invisibleGround.visible =false

    cloudsGroup = new Group();
    obstaclesGroup = new Group();
    
    score = 0;

    sunFlower = createSprite(90, 700 - 70, 20, 50);
    sunFlower.visible = false
    sunFlower.addImage(sunFlowerIMG);
}

function draw() {
    //trex.debug = true;
    background(backgroundImg);
    textSize(20);
    fill("black")
    text("Score: " + score, 30, 50);

   
    
    if(!muicaDeFaze.isPlaying()){
        muicaDeFaze.play()
    }
   
   
   
    if (gameState === PLAY) {
        score = score + Math.round(getFrameRate() / 60);
        ground.velocityX = -(6 + 3 * score / 100);
      
        trex.changeAnimation("running", trex_running);

        if ((touches.length>0||keyDown("SPACE")) && trex.y >= height - 120) {
            touches=[]
            jumpSound.play()
            jumpSound.setVolume(0.2)
            trex.velocityY = -10;
           
        }

        if (trex.y <= height - 120){
            trex.changeAnimation("jumping", trex_jumping);
        }

        trex.velocityY = trex.velocityY + 0.8

        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }

        trex.collide(invisibleGround);
        spawnClouds();
        spawnObstacles();

        if (obstaclesGroup.isTouching(trex)) {
            collidedSound.play()
            gameState = END;
        }
    } else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;
        obstacle1.visible = false;
        obstacle2.visible = false;
        obstacle3.visible = false;
        obstacle4.visible = false;
        obstacle5.visible = false;
        obstacle6.visible = false;
        muicaDeFaze.stop()
        obstaclesGroup.destroyEach()
        cloudsGroup.destroyEach()
        
       
        
        ground.velocityX = 0;
        trex.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);

      
        trex.changeAnimation("collided", trex_collided);
       
        
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);

        if (keyDown("SPACE") || touches.length>0) {
            touches=[]
            reset();
        }
        if (keyDown("enter")) {
            reset();

        }
    }

    if(score > 60){
       sunFlower.visible = true
        sunFlower.velocityX =-5
    }

   

    if(sunFlower.isTouching(trex)){
        sunFlower.destroy()
        trex.changeAnimation("f_running",trex_f_running);
        trex.changeAnimation("f_jumping",trex_f_jumping);
    }


    if(score > 1000000){
        bowser = createSprite(1250, 400 - 70, 20, 50); 
        bowser.addImage(bowserIMG);
        bowser.scale = 0.8
        obstaclesGroup.destroyEach()
    }
    

    drawSprites();
}

function spawnClouds() {
   
    if (frameCount % 60 === 0) {
        var cloud = createSprite(width + 20, height - 300, 40, 10);
        cloud.y = Math.round(random(100, 220));
        cloud.addImage(cloudImage);
        cloud.scale = 0.5;
        cloud.velocityX = -3;

       
        cloud.lifetime = width/cloud.velocityX;

      
        cloud.depth = trex.depth;
        trex.depth = trex.depth + 1;

     
        cloudsGroup.add(cloud);
    }

}

function spawnObstacles() {
    if (frameCount % 60 === 0) {
        var obstacle = createSprite(width, height - 95, 20, 30);
        obstacle.setCollider('circle', 0, 0, 45)
          

        obstacle.velocityX = -(6 + 3 * score / 100);

        
        var rand = Math.round(random(1, 2, 3, 4, 5, 6));
        switch (rand) {
            case 1:
                obstacle.addImage(obstacle1);
                break;
            case 2:
                obstacle.addImage(obstacle2);
                break;
            case 3:
                obstacle.addImage(obstacle3);
                break;
            case 4:
                obstacle.addImage(obstacle4);
                break;
            case 5:
                obstacle.addImage(obstacle5);
                break;
            case 6:
                obstacle.addImage(obstacle6);
                break;
            default:
                break;
        }

                  
        obstacle.scale = 0.3;
        obstacle.lifetime = width/obstacle.velocityX;
        obstacle.depth = trex.depth;
        trex.depth += 1;
       
        obstaclesGroup.add(obstacle);
    }

}

function reset() {
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();

    trex.changeAnimation("running", trex_running);

    score = 0;

}

