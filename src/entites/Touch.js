import { CONFIG } from "../config"

export default class Touch extends Phaser.Physics.Arcade.Sprite{

  constructor(scene, x, y){
    super(scene, x, y)

    scene.add.existing(this) // Criando a imagem que o jogador ve
    scene.physics.add.existing(this) // criando o Body da Fssica

    this.init()
  }

  init(){
    this.body.setSize(CONFIG.TILE_SIZE / 2, CONFIG.TILE_SIZE / 2)
  }
}