import { CONFIG } from "../config";

export default class Player extends Phaser.Physics.Arcade.Sprite{
  /**@type {Phaser.Type.Input.Keyboard.Cursors} */
  cursors;

  touch;
  isAction;

  constructor(scene, x, y, touch){
    super(scene, x, y, 'player')

    this.touch = touch

    scene.add.existing(this) // Criando a imagem que o jogador ve
    scene.physics.add.existing(this) // criando o Body da Fisica

    this.init()
  }

  init(){
    this.setFrame(3)

    this.speed = 120;
    this.frameRate = 8;
    this.direction = 'down';
    this.cursors = this.scene.input.keyboard.createCursorKeys()

    this.setOrigin(0.5, 0.5)

    this.body.setSize(12, 8);
    this.body.setOffset(18, 24);
    this.initAnimations();

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

    // this.play('idle-right');
  }
  
  update(){
    const { left, right, down, up, space } = this.cursors

    if(left.isDown) {
      this.direction = 'left';
      this.setVelocityX(-this.speed)
    } else if(right.isDown){
      this.direction = 'right';
      this.setVelocityX(this.speed)
    } else {
      this.setVelocityX(0)
    }

    if(up.isDown) {
      this.direction = 'up';
      this.setVelocityY(-this.speed)
    } else if(down.isDown){
      this.direction = 'down';
      this.setVelocityY(this.speed)
    } else {
      this.setVelocityY(0)
    }

    if(space.isDown) {
      this.isAction = true;
    } else {
      this.isAction = false;
    }
    
    if(this.body.velocity.x === 0 && this.body.velocity.y === 0){ // esta parado
      this.play('idle_' + this.direction, true)
    } else { // Em movimento
      this.play('walk_' + this.direction, true)
    }

    // Fazer o touch seguir o player
    let tX, tY;
    let distance = 16;
    
    switch(this.direction){
      case 'down':
        tX = -8;
        tY = 7;
        break
      case 'up':
        tX = -8;
        tY = -2;
        break
      case 'right':
        tX = 0;
        tY = 0;
        break
      case 'left':
        tX = - distance;
        tY = 0;
        break
      case 'space':
        tX = 0;
        tY = 0;
        break;
    }

    this.touch.setPosition(this.x + tX + CONFIG.TILE_SIZE / 2, this.y + tY)
  }

  initAnimations(){
    
    // Parado
    this.anims.create({
      key: 'idle_down',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7 ] }),
      frameRate: this.frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: 'idle_up',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 8, 9, 10, 11, 12, 13, 14, 15 ] }),
      frameRate: this.frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: 'idle_left',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 16, 17, 18, 19, 20, 21, 22, 23 ] }),
      frameRate: this.frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: 'idle_right',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 24, 25, 26, 27, 28, 29, 30, 31 ] }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    // Andando
    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 32, 33, 34, 35, 36, 37, 38, 39 ] }),
      frameRate: this.frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 40, 41, 42, 43, 44, 45, 46, 47 ] }),
      frameRate: this.frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 48, 49, 50, 51, 52, 53, 54, 55 ] }),
      frameRate: this.frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 56, 57, 58, 59, 60, 61, 62, 63 ] }),
      frameRate: this.frameRate,
      repeat: -1,
    });

    // Correndo
    this.anims.create({
      key: 'run_down',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 64, 65, 66, 67, 68, 69, 70, 71 ] }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'run_up',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 72, 73, 74, 75, 76, 77, 78, 79 ] }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'run_right',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 80, 81, 82, 83, 84, 85, 86, 87 ] }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'run_left',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 88, 89, 90, 91, 92, 93, 94, 95 ] }),
      frameRate: 8,
      repeat: -1,
    });

    // Cavando
    this.anims.create({
      key: 'tilling_down',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 96, 97, 98, 99, 100, 101, 102, 103 ] }),
      frameRate: 8,
    });
    this.anims.create({
      key: 'tilling_up',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 104, 105, 106, 107, 108, 109, 110, 111 ] }),
      frameRate: 8,
    });
    this.anims.create({
      key: 'tilling_left',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 112, 113, 114, 115, 116, 117, 118, 119 ] }),
      frameRate: 8,
    });
    this.anims.create({
      key: 'tilling_right',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 120, 121, 122, 123, 124, 125, 126, 127 ] }),
      frameRate: 8,
    });
    
    // Cortando
    this.anims.create({
      key: 'chopping_down',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 128, 129, 130, 131, 132, 133, 134, 135 ] }),
      frameRate: 8,
    });
    this.anims.create({
      key: 'chopping_up',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 136, 137, 138, 139, 140, 141, 142, 143 ] }),
      frameRate: 8,
    });
    this.anims.create({
      key: 'chopping_left',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 144, 145, 146, 147, 148, 149, 150, 151 ] }),
      frameRate: 8,
    });
    this.anims.create({
      key: 'chopping_right',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 152, 153, 154, 155, 156, 157, 158, 159 ] }),
      frameRate: 8,
    });
    
    // Regando
    this.anims.create({
        key: 'watering_down',
        frames: this.anims.generateFrameNumbers('player', { frames: [ 160, 161, 162, 163, 164, 165, 166, 167 ] }),
        frameRate: 8,
    });
    this.anims.create({
        key: 'watering_up',
        frames: this.anims.generateFrameNumbers('player', { frames: [ 168, 169, 170, 171, 172, 173, 174, 175 ] }),
        frameRate: 8,
    });
    this.anims.create({
        key: 'watering_left',
        frames: this.anims.generateFrameNumbers('player', { frames: [ 176, 177, 178, 179, 180, 181, 182, 183 ] }),
        frameRate: 8,
    });
    this.anims.create({
        key: 'watering_right',
        frames: this.anims.generateFrameNumbers('player', { frames: [ 184, 185, 186, 187, 188, 189, 190, 191 ] }),
        frameRate: 8,
    });

    // Arvore normal
    this.anims.create({
        key: 'normal_tree_static',
        frames: this.anims.generateFrameNumbers('arvore_normal', { frames: [ 0 ] }),
        frameRate: 1,
    });
    this.anims.create({
        key: 'normal_tree_moving',
        frames: this.anims.generateFrameNumbers('arvore_normal', { frames: [ 12, 13, 14, 15 ] }),
        frameRate: 4,
        repeat: -1,
    });
    this.anims.create({
        key: 'normal_tree_chopped',
        frames: this.anims.generateFrameNumbers('arvore_normal', { frames: [ 24, 25, 26, 27, 28, 29 ] }),
        frameRate: 6,
    });
    this.anims.create({
        key: 'normal_tree_chopped_heavily',
        frames: this.anims.generateFrameNumbers('arvore_normal', { frames: [ 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47 ] }),
        frameRate: 12,
    });

    // Arvore pessego
    this.anims.create({
        key: 'peach_tree_static',
        frames: this.anims.generateFrameNumbers('arvore_pessego', { frames: [ 0 ] }),
        frameRate: 1,
    });
    this.anims.create({
        key: 'peach_tree_moving',
        frames: this.anims.generateFrameNumbers('arvore_pessego', { frames: [ 12, 13, 14, 15 ] }),
        frameRate: 4,
        repeat: -1,
    });
    this.anims.create({
        key: 'peach_tree_chopped',
        frames: this.anims.generateFrameNumbers('arvore_pessego', { frames: [ 24, 25, 26, 27, 28, 29 ] }),
        frameRate: 6,
    });
    this.anims.create({
        key: 'peach_tree_chopped_heavily',
        frames: this.anims.generateFrameNumbers('arvore_pessego', { frames: [ 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47 ] }),
        frameRate: 12,
    });
    this.anims.create({
        key: 'peach_tree_moving_no_fruits',
        frames: this.anims.generateFrameNumbers('arvore_pessego', { frames: [ 48, 49 ] }),
        frameRate: 2,
        repeat: -1,
    });

    // Arvore maça
    this.anims.create({
        key: 'apple_tree_static',
        frames: this.anims.generateFrameNumbers('arvore_maca', { frames: [ 0 ] }),
        frameRate: 1,
    });
    this.anims.create({
        key: 'apple_tree_moving',
        frames: this.anims.generateFrameNumbers('arvore_maca', { frames: [ 12, 13, 14, 15 ] }),
        frameRate: 4,
        repeat: -1,
    });
    this.anims.create({
        key: 'apple_tree_chopped',
        frames: this.anims.generateFrameNumbers('arvore_maca', { frames: [ 24, 25, 26, 27, 28, 29 ] }),
        frameRate: 6,
    });
    this.anims.create({
        key: 'apple_tree_chopped_heavily',
        frames: this.anims.generateFrameNumbers('arvore_maca', { frames: [ 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47 ] }),
        frameRate: 12,
    });
    this.anims.create({
        key: 'apple_tree_moving_no_fruits',
        frames: this.anims.generateFrameNumbers('arvore_maca', { frames: [ 48, 49 ] }),
        frameRate: 2,
        repeat: -1,
    });

    // Aarvore pera
    this.anims.create({
        key: 'pear_tree_static',
        frames: this.anims.generateFrameNumbers('arvore_pera', { frames: [ 0 ] }),
        frameRate: 1,
    });
    this.anims.create({
        key: 'pear_tree_moving',
        frames: this.anims.generateFrameNumbers('arvore_pera', { frames: [ 12, 13, 14, 15 ] }),
        frameRate: 4,
        repeat: -1,
    });
    this.anims.create({
        key: 'pear_tree_chopped',
        frames: this.anims.generateFrameNumbers('arvore_pera', { frames: [ 24, 25, 26, 27, 28, 29 ] }),
        frameRate: 6,
    });
    this.anims.create({
        key: 'pear_tree_chopped_heavily',
        frames: this.anims.generateFrameNumbers('arvore_pera', { frames: [ 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47 ] }),
        frameRate: 12,
    });
    this.anims.create({
        key: 'pear_tree_moving_no_fruits',
        frames: this.anims.generateFrameNumbers('arvore_pera', { frames: [ 48, 49 ] }),
        frameRate: 2,
        repeat: -1,
    });

    // Arvore laranja
    this.anims.create({
        key: 'orange_tree_static',
        frames: this.anims.generateFrameNumbers('arvore_laranja', { frames: [ 0 ] }),
        frameRate: 1,
    });
    this.anims.create({
        key: 'orange_tree_moving',
        frames: this.anims.generateFrameNumbers('arvore_laranja', { frames: [ 12, 13, 14, 15 ] }),
        frameRate: 4,
        repeat: -1,
    });
    this.anims.create({
        key: 'orange_tree_chopped',
        frames: this.anims.generateFrameNumbers('arvore_laranja', { frames: [ 24, 25, 26, 27, 28, 29 ] }),
        frameRate: 6,
    });
    this.anims.create({
        key: 'orange_tree_chopped_heavily',
        frames: this.anims.generateFrameNumbers('arvore_laranja', { frames: [ 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47 ] }),
        frameRate: 12,
    });
    this.anims.create({
        key: 'orange_tree_moving_no_fruits',
        frames: this.anims.generateFrameNumbers('arvore_laranja', { frames: [ 48, 49 ] }),
        frameRate: 2,
        repeat: -1,
    });
    // this.anims.create({
    //   key: 'fire-down',
    //   frames: this.anims.generateFrameNumbers('player', { start: 238, end: 240 }),
    //   frameRate: this.frameRate,
    //   repeat: -1
    // });
  }

}