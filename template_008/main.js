
var assets = [
    "images/title.png",// タイトル
];

function gameStart(){
    var scene = new Scene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========
    
    scene.backgroundColor = "gray";

    // ボス
    var boss = new Sprite(32, 32);
    boss.backgroundColor = "black";
    boss.x = scene.width/4;
    boss.y = scene.height * 0.2;
    scene.addChild(boss);

    boss.tl.moveBy(200, 0, 64);
    boss.tl.moveBy(-200, 0, 64);
    boss.tl.loop();

    // 弾グループ
    var shotGroup = new Group();
    scene.addChild(shotGroup);

    // マガジンに弾丸を用意しておく
    var bullets = [];
    for(let i=0; i<30; i++){

        // 弾スプライト
        var bullet = new Sprite(2, 8);
        bullet.backgroundColor = "white";
        bullet.centerX = Math.random() * 60;// とりま画面の左上に
        bullet.centerY = Math.random() * 60;
        bullet.moveX   = 0;// 速度も0に!! <- 重要!!
        bullet.moveY   = 0;
        bullets.push(bullet);// マガジンに追加
        shotGroup.addChild(bullet);

        // 弾の動きはここで
        bullet.on(Event.ENTER_FRAME, function(){
            this.centerX += this.moveX;
            this.centerY += this.moveY;

            if(scene.height < this.centerY){
                // マガジンに戻す
                this.centerX = Math.random() * 60;// とりま画面の左上に
                this.centerY = Math.random() * 60;
                this.moveX   = 0;// 速度も0に!!
                this.moveY   = 0;
                bullets.push(this);// マガジンに戻す
            }
        });
    }

    // 定期的に実行
    scene.tl.then(function(){

        if(bullets.length <= 0) return;// マガジンに無い場合はここでストップ
        let bullet = bullets.pop();// マガジンから1つ取り出す
        bullet.centerX = boss.centerX;
        bullet.centerY = boss.centerY;

        // TODO: 弾の移動する方向を決定する
        bullet.moveX   = 0;
        bullet.moveY   = 5;
    });
    scene.tl.delay(8);
    scene.tl.loop();

    //==========
    // ここまで
    //==========
};

function titleStart(){// タイトル画面
    var scene = gameManager.createTitleScene();
    core.replaceScene(scene); core.pause();
    scene.on(enchant.Event.TOUCH_START, function(){gameStart();});
}

//==========
//EnchantJS
enchant();
var gameManager;
var core;
var scene;
window.onload = function(){
    gameManager = new common.GameManager();
    core = gameManager.createCore(320, 480);
    core.preload(assets);
    core.onload = function(){titleStart();};
    core.start();
};