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

    this.setOrigin(0, 0.5)

    this.body.setSize(14, 10);
    this.body.setOffset(1, 22);
    this.initAnimations();

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

    // this.play('idle-right');
    // this.play('idle-up');
    // this.play('idle-left');
    // this.play('idle-down');
    // this.play('walk-right');
    // this.play('walk-up');
    // this.play('walk-left');
    // this.play('walk-down');
    this.play('sit-left');
    this.play('sit-right');
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
      this.play('idle-' + this.direction, true)
    } else { // Em movimento
      this.play('walk-' + this.direction, true)
    }

    // Fazer o touch seguir o player
    let tX, tY;
    let distance = 16;
    
    switch(this.direction){
      case 'down':
        tX = 0;
        tY = distance;
        break
      case 'up':
        tX = 0;
        tY = - distance + CONFIG.TILE_SIZE;
        break
      case 'right':
        tX = distance / 2;
        tY = CONFIG.TILE_SIZE / 2;
        break
      case 'left':
        tX = - distance / 2;
        tY = CONFIG.TILE_SIZE / 2;
        break
      case 'space':
        tX = 0;
        tY = 0;
        break;
    }

    this.touch.setPosition(this.x + tX + CONFIG.TILE_SIZE / 2, this.y + tY)
  }

  initAnimations(){
    // Idle
    this.anims.create({
      key: 'idle-right',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 9 }), 
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'idle-up',
      frames: this.anims.generateFrameNumbers('player', { start: 10, end: 15 }), 
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'idle-left',
      frames: this.anims.generateFrameNumbers('player', { start: 16, end: 21 }), 
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'idle-down',
      frames: this.anims.generateFrameNumbers('player', { start: 22, end: 27 }), 
      frameRate: this.frameRate,
      repeat: -1
    })

    // Walk
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player', { start: 28, end: 33 }), 
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', { start: 34, end: 39 }), 
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player', { start: 40, end: 45 }), 
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', { start: 46, end: 51 }), 
      frameRate: this.frameRate,
      repeat: -1
    })

    // Sit
    this.anims.create({
      key: 'sit-right',
      frames: this.anims.generateFrameNumbers('player', { start: 52, end: 57 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'sit-left',
      frames: this.anims.generateFrameNumbers('player', { start: 58, end: 63 }),
      frameRate: this.frameRate,
      repeat: -1
    });

    // Phone
    this.anims.create({
      key: 'phone',
      frames: this.anims.generateFrameNumbers('player', { start: 64, end: 75 }),
      frameRate: this.frameRate,
      repeat: -1
    });
  
    // Book
    this.anims.create({
      key: 'book',
      frames: this.anims.generateFrameNumbers('player', { start: 76,end:87 }),
      frameRate: this.frameRate,
      repeat: -1
     });
  
    // Cath
    this.anims.create({
      key: 'catch-right',
      frames: this.anims.generateFrameNumbers('player', { start: 88, end: 99 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'catch-up',
      frames: this.anims.generateFrameNumbers('player', { start: 100, end: 111 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'catch-left',
      frames: this.anims.generateFrameNumbers('player', { start: 112, end: 123 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'catch-down',
      frames: this.anims.generateFrameNumbers('player', { start: 124, end: 135 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    
    // Gift
    this.anims.create({
      key: 'gift-right',
      frames: this.anims.generateFrameNumbers('player', { start: 136, end: 145 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'gift-up',
      frames: this.anims.generateFrameNumbers('player', { start: 146, end: 155 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'gift-left',
      frames: this.anims.generateFrameNumbers('player', { start: 156, end: 165 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'gift-down',
      frames: this.anims.generateFrameNumbers('player', { start: 166, end: 175 }),
      frameRate: this.frameRate,
      repeat: -1
    });

    // Punch
    this.anims.create({
      key: 'punch-right',
      frames: this.anims.generateFrameNumbers('player', { start: 176, end: 181 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'punch-up',
      frames: this.anims.generateFrameNumbers('player', { start: 182, end: 187 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'punch-left',
      frames: this.anims.generateFrameNumbers('player', { start: 188, end: 193 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'punch-down',
      frames: this.anims.generateFrameNumbers('player', { start: 194, end: 199 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    
    // Gun
    this.anims.create({
      key: 'gun-right',
      frames: this.anims.generateFrameNumbers('player', { start: 200, end: 203 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'gun-up',
      frames: this.anims.generateFrameNumbers('player', { start: 204, end: 207 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'gun-left',
      frames: this.anims.generateFrameNumbers('player', {start: 208, end: 211 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'gun-down',
      frames: this.anims.generateFrameNumbers('player', {start: 212, end: 215 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    
    // Damage
    this.anims.create({
      key: 'fire-right',
      frames: this.anims.generateFrameNumbers('player', {start: 228, end: 230 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'fire-up', 
      frames: this.anims.generateFrameNumbers('player', { start: 231, end: 233 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'fire-left',
      frames: this.anims.generateFrameNumbers('player', { start: 234, end: 236 }),
      frameRate: this.frameRate,
      repeat: -1
    });
    this.anims.create({
      key: 'fire-down',
      frames: this.anims.generateFrameNumbers('player', { start: 238, end: 240 }),
      frameRate: this.frameRate,
      repeat: -1
    });
  }

}