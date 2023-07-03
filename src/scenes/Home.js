import { Scene } from "phaser";
import { CONFIG } from "../config";

export default class Home extends Scene {
  /** @type {Phaser.Tilemaps.tilemap} */
  map;

  constructor(){
    super('Home')
  }

  preload(){
    //this.load.tilemapTiledJSON('tilemap-home', 'mapas/home.json')

    //this.load.image('geral', 'mapas/tiles/geral.png')

   
  }

  create() {
    const width = CONFIG.GAME_WIDTH;
    const height = CONFIG.GAME_HEIGHT;

    // Fundo da cena
    this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0, 0);

    // Mensagem de aviso
    const message = this.add.text(width / 2, height / 2, 'Esta cena está em desenvolvimento.', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff'
    });
    message.setOrigin(0.5);
  }
  update(){
  
  }

}