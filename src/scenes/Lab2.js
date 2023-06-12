import { Scene } from "phaser"
import { CONFIG } from "../config";
import Hud from "../component/Hud";

// 9-sline

export default class Lab2 extends Scene {
  /** @type {Phaser.Tilemaps.tilemap} */
  map;
  layers = {};

  

  spaceDown = false;
  /**@type {Phaser.Type.Input.Keyboard.Cursors} */
  cursors;

  hud;
  /** @type {Phaser.GameObjects.Container} */
  dialog;
  /** @type {Phaser.GameObjects.Text} */
  dialogText;
  /** @type {Phaser.GameObjects.Sprite} */
  dialogNext;
  dialogPositionShow;
  dialogPositionHide;


  constructor(){
    super('Lab2')
  }

  preload(){
    // Carregar dados do mapa
    this.load.tilemapTiledJSON('tilemap-lab-info', 'mapas/sala.json')

    // Carregar os tilessets do map (as imagens)
    this.load.image('tiles-office', 'mapas/tiles/tiles_office.png')

    this.load.atlas('hud', 'hud.png', 'hud.json')

  }

  create(){
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createMap();
    this.createLayers();
    
    this.hud = new Hud(this, 0, 0);

  }

  update(){
    const { space } = this.cursors;

    if (space.isDown && !this.spaceDown) {
      this.spaceDown = true;
      this.hud.showDialog('Esse testo deve ser grande, Analise e desenvolvimento de sistemas - Introdução a jogos');
      if(this.isDialogBlocked == false){
        this.hud.hideDialog()
        console.log("fgrgthf"); 
      }
         
    } else if (!space.isDown && this.spaceDown){
      this.spaceDown = true;
      //setTimeout(() => this.hud.hideDialog(), 5000)
    }
  }


  createMap(){
    this.map = this.make.tilemap({
      key: 'tilemap-lab-info', // dados JSON
      tileHeight: CONFIG.TILE_SIZE,
      tileWidth: CONFIG.TILE_SIZE
    })
    this.map.addTilesetImage('tiles_office', 'tiles-office')
  }

  createLayers(){
    const tilesOffice = this.map.getTileset('tiles_office') // Nome no tiles
    const layersNames = this.map.getTileLayerNames();
    for (let i = 0; i < layersNames.length; i++) {
      const name = layersNames[i];
      this.layers[name] = this.map.createLayer(name, [tilesOffice], 0, 0)
      this.layers[name].setDepth(i);
    }
  }

  // showDialog(text){
  //   this.dialogText.text = ''
    
  //   // Verifica se esta fora da tela
  //   if(this.dialog.y > this.dialogPositionShow){
  //     this.add.tween({
  //       targets: this.dialog,
  //       duration: 400,
  //       y: this.dialogPositionShow,
  //       ease: Phaser.Math.Easing.Back.Out,
  //       onComplete: () => {
  //         this.showText(text)
  //       }
  //     });
  //   } else {
  //     this.showText(text)
  //   }
  // }

  // showText(text){
  //   let i = 0;

  //   this.time.addEvent({
  //     repeat: text.length - 1,
  //     delay: 25,
  //     callback: () => {
  //       this.dialogText.text += text[i++]
  //     }
  //   })
  // }

}