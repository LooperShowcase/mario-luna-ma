kaboom({
    global:true,
    fullscreen:true, 
    clearColor:[0,0.5,1,1],
    debug:true,
    scale:2,
});
loadRoot("./sprites/")
loadSprite('block','block.png')
loadSprite('mario','mario.png')
loadSprite('coin','coin.png')
loadSprite('goomba','evil_mushroom.png')
loadSprite('pipe','pipe_up.png')
loadSprite('surprise','surprise.png')
loadSprite('unboxed','unboxed.png')
loadSprite('mushroom','mushroom.png')
loadSprite('cloud','cloud.png')
loadSprite('dino','dino.png')
loadSprite('castle','castle.png')
loadSound("gameSound","gameSound.mp3");
loadSound("jumpSound","jumpSound.mp3");
scene("over",(score)=>{
    add([
        text("Game Over!\n\nScore: "+ score+"\nPress R To Restart",32),
        origin("center"),
        pos(width()/2,height()/2),
    ]);
    keyDown("r",()=>{
        go("begin")
    });
});

scene("begin",()=>{
    add([
        text("Welcome To super Mario Bros",30),
        origin ("center"),
        pos(width()/2,height()/2-100)
    ]);
    const btn=add([rect(90,70),
        origin("center"),
        pos(width()/2,height()/2)]);
    add([
        text("start",14),
        origin("center"),
        pos(width()/2,height()/2),
        color(0.1,0.1,0.1),
    ]);

    btn.action(()=>{
        if(btn.isHovered()){
         btn.color=rgb(0.5,0.5,0.5)
         if(mouseIsClicked()){
           go("game");
           }
        }
        else{
            btn.color=rgb(1,1,1);
        }
    });
});

scene("win",(score)=>{
    add([text("You Win!!\n\nScore:"+score+"\nPress N ",30),origin ("center"),
    pos(width()/2,height()/2)])
    keyDown("n",()=>{
        go("begin")
    });
})
scene("game",()=>{
    layers(["bg","obj","ui"], "obj")
    play("gameSound");
    const key={
        width:20,
        height:20,
        $:[sprite("coin"),"coin"],
        "=":[sprite("block"),solid()],
        "&":[sprite("pipe"),solid()],
        "?":[sprite("surprise"),solid(),"surprise-coin"],
        "!":[sprite("surprise"),solid(),"surprise-mushroom"],
        "x":[sprite("unboxed"),solid()],
        "m":[sprite("mushroom"),body(),"mushroom"],
        "^":[sprite("goomba"),body(),solid(),"goomba"],
        "c":[sprite("cloud")],
        "d":[sprite("dino"),body(),solid(),"dino"],
        "a":[sprite("castle","castle")],
    };


    const map=[
     "                                                                                                                  " ,
     "                                                                                                                  " ,
     "                                                                                                                  " ,
     "                           c                c                            c                                        " ,
     "                                                     c                                                            " ,
     "                                                                                 c                                " ,
     "         c                                                                                 c           c          " ,
     "                          c    c                                                                     c   c        " ,
     "      c  c                                                 $ $ $                                                  " ,
     "                                     c                     $ $ $                                                  " ,
     "                                                  ===== ============                     ==!!==                   " ,
     "                                               ===                           ?==!=!==                             " ,
     "               $                            $===                                                            a      " ,
     "      $      !===!=                       ===                                            ========                 " ,
     "      &               $ $ $ $          ===                           !==!==! &                                    " ,
     "              ^        ^     $ $ $ $   d          &                 d             &     $$$$                      " ,
     "=======================================================   ========================================================" ,
     "=======================================================   ========================================================" ,
     "=======================================================   ========================================================" ,
     "=======================================================   ========================================================" ,
     "=======================================================   ========================================================" ,
     "=======================================================   ========================================================" ,
     "=======================================================   ========================================================" ,
     "=======================================================   ========================================================" ,
    ]
    const gameLevel=addLevel(map,key);
    const jumpForce=360;
    let score=0;
    const player =add([sprite("mario"),
    solid(),
    pos(30,0),
    body(),
    origin("bot"),
    big(jumpForce)])
    const speed =120;
    let isJumping=false;
    keyDown("right",()=> {
        player.move(speed,0);
    });
    const scoreLable= add([
        text("SCORE\n"+score),
        origin("center"),
        pos(30,190),
        layer("ui"),
        {
            value:score,
        }
    ])
    keyDown("left",()=> {
        if(player.pos.x>10){
            player.move(-speed,0);
        }
    });
    keyPress("space",()=> {
        if(player.grounded()){
            isJumping=true;
            player.jump(jumpForce);
            play("jumpSound");
        }
    });
    keyDown("r",()=>{
        go("game")
    });
    player.on("headbump",(obj) => {
        if (obj.is("surprise-coin")){
            gameLevel.spawn("$",obj.gridPos.sub(0,1));
            destroy(obj);
            gameLevel.spawn("x",obj.gridPos);
        }
        if (obj.is("surprise-mushroom")){
            gameLevel.spawn("m",obj.gridPos.sub(0,1));
            destroy(obj);
            gameLevel.spawn("x",obj.gridPos);
        }
     });
     player.collides("coin", (x) => {  
     destroy(x);
     scoreLable.value+=100;
     scoreLable.text="SCORE\n"+scoreLable.value;
     });
     player.collides("mushroom", (x) => {  
     destroy(x);
     player.biggify(10);
     scoreLable.value+=1000;
     scoreLable.text="SCORE\n"+scoreLable.value;
     });
     action ("mushroom",(x)=> {
        x.move(20,0);
     });
     action ("goomba",(x)=> {
        x.move(-20,0);
     });
     player.collides("goomba", (x) => {  
     if (isJumping){
        destroy(x);
        scoreLable.value+=200;
        scoreLable.text="SCORE\n"+scoreLable.value;
     }
     else{
        destroy(player);
        go("over",scoreLable.value);
     }
     });
     action ("dino",(x)=> {
        x.move(-20,0);
    });
     player.collides("dino", (x) => {  
        if (isJumping){
           destroy(x);
           scoreLable.value+=300;
           scoreLable.text="SCORE\n"+scoreLable.value;
        }
        else{
           destroy(player);
           go("over",scoreLable.value);
        }
        });
     player.action(()=>{
        if(player.pos.x >=2207.881640000001)
        {
            go("win",scoreLable.value);
        }
        camPos(player.pos);
        scoreLable.pos.x=player.pos.x-320;
        if (player.grounded()){
            isJumping=false;
        }
        else{
            isJumping=true;
        }
        if(player.pos.y >= height()){
            go("over",scoreLable.value);
        }
     });
    });
start ("begin");
