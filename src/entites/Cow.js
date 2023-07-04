
export default class Cow extends Phaser.Physics.Arcade.Sprite {

  cows;
  constructor(scene, x, y){
    super(scene, x, y, 'cow')

    scene.add.existing(this);         
    scene.physics.add.existing(this); 
    
    this.init();
  }

  init() {
    this.setFrame(1);

    this.speed = 5;
    this.frameRate = 8;

    this.body.setSize(21, 18);
    this.body.setOffset(8, 12);
    this.initAnimations();

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

    setInterval(() => {
      var random = Math.floor(Math.random() * 6)
      var random2 = Math.floor(Math.random() * 10)

      if(random == 0){
        this.setVelocityX(random2);
        this.setVelocityY(0);
        this.play('walk')
        this.flipX = false;
      }
      if(random == 1){
        this.setVelocityX(-random2); 
        this.setVelocityY(0);
        this.play('walk')
        this.flipX = true;
      }
      if(random == 2){
        this.setVelocityX(0);
        this.setVelocityY(random2);
        this.play('walk')
      }
      if(random == 3){
        this.setVelocityX(0);
        this.setVelocityY(-random2);
        this.play('walk')       
      }           
    }, 3000);
    
    setInterval(() => {
      if(this.body.velocity.x == 0 && this.body.velocity.y == 0){
        this.play('idle')       
      }
    }, 1000)
  }

  create(){
    this.createCow();     
  }
   
  initAnimations(){
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('cow', {
      start: 18, end: 19}),
      frameRate: this.frameRate,
      repeat: 0
    });
       
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('cow', {
      start: 10, end: 16}),
      frameRate: this.frameRate,
      repeat: -1
    });

    this.play('idle')
  }
}   
   
