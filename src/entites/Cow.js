import { CONFIG } from "../config";

export default class Cow extends Phaser.Physics.Arcade.Sprite{
  /**@type {Phaser.Type.Input.Keyboard.Cursors} */
  cursors;

  touch;
  isAction;

  constructor(scene, x, y, touch){
    super(scene, x, y, 'cow')

    this.touch = touch

    scene.add.existing(this) // Criando a imagem que o jogador ve
    scene.physics.add.existing(this) // criando o Body da Fisica

    this.init()
  }

  init(){





  }
  
  update(){
    
  }

  

  initAnimations(){
    
    
  }

}