import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entites/Player";
import Touch from "../entites/Touch";
import Hud from "../component/Hud";

export default class Lab extends Scene {
  /**@type {Phaser.Tilemaps.Tilemap} */
  map;

  /**@type {Player} */
  player;
  playerCollision = [];
  touch;
  layers = {};
  cursors;

  textDialago = ""
  telaDialago;

  /** @type {Phaser.Physics.Arcade.Group} */
  groupObjects;
  isTouching = false;

  taSentado = false;

  hud;
  /** @type {Phaser.GameObjects.Container} */
  dialog;
  /** @type {Phaser.GameObjects.Text} */
  dialogText;
  /** @type {Phaser.GameObjects.Sprite} */
  dialogNext;
  dialogPositionShow;
  dialogPositionHide;
  spaceDown = false;
  cursors;

  constructor(){
    super('Lab');
  }

  preload(){
    this.load.tilemapTiledJSON('tilemap-lab-info', 'mapas/sala.json')

    this.load.image('tiles-office', 'mapas/tiles/tiles_office.png')
    this.load.atlas('hud', 'hud.png', 'hud.json')

    this.load.spritesheet('player', 'carlos.png', {
      frameWidth: CONFIG.TILE_SIZE,
      frameHeight: CONFIG.TILE_SIZE * 2
    });

    this.load.spritesheet('Lixeira', 'mapas/tiles/lixeiras_spritesheet.png', {
      frameWidth: CONFIG.TILE_SIZE,
      frameHeight: CONFIG.TILE_SIZE * 2
    });
  }

  create(){
    this.createMap();
    this.createLayers();
    this.createObjects();
    this.createPlayer();
    this.createCamera();
    this.createColliders();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.hud = new Hud(this, 0, 0);
  }

  update(){

  }

  createMap(){
    this.map = this.make.tilemap({
      key: 'tilemap-lab-info',
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
      // Define a profundidade de cada camada (Layer)
      this.layers[name].setDepth(i);

      if(name.endsWith('Collision')){
        this.layers[name].setCollisionByProperty({ collide: true })
        this.layers[name].setTileIndexCallback(0, this, (sprite, tile) => {
            console.log(`Collided with ${tile.properties.object}, ${sprite}`);
          }
        );

        // Mostrar em amarelo os objetos que pode colidir
        if ( CONFIG.DEBUG_COLLISION ) {
          const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
          this.layers[name].renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
        }
      }
      
    }
  }

  createCamera(){
    const mapWidth = this.map.width * CONFIG.TILE_SIZE;
    const mapHeight = this.map.height * CONFIG.TILE_SIZE;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    this.cameras.main.startFollow(this.player)
  }

  createObjects() {
    this.groupObjects = this.physics.add.group();

    console.log(this.groupObjects)

    const objects = this.map.createFromObjects("Objeto", "Objeto", "Objeto", "Objeto", {
      name: "Placa", name: "Quadro", name: "Lixeira", name: "Cadeira"
    });

    console.log(objects)
    this.physics.world.enable(objects);

    for(let i = 0; i < objects.length; i++){
      const obj = objects[i];
      obj.setDepth(this.layers.length + 1);
      obj.setVisible(false);
      obj.prop = this.map.objects[0].objects[i].properties;
      this.groupObjects.add(obj);     
    }
}

  createPlayer(){
    this.touch = new Touch(this, 16 * 8, 16 * 5);
    this.player = new Player(this, 16 * 8, 16 * 5, this.touch);
    this.player.setDepth(19);        
  }

  createColliders(){
    const layersNames = this.map.getTileLayerNames();
    for (let i = 0; i < layersNames.length; i++) {
      const name = layersNames[i];
      
      if(name.endsWith('Collision')){
        this.physics.add.collider(this.player, this.layers[name], this.Collided(), null, this)
      }
    }
    this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);
  }

  // Refatorar
  handleTouch(touch, object) {
    if(this.isTouching && this.player.isAction){
      return;
    }

    if (this.isTouching && !this.player.isAction){
      this.isTouching = false;
      return;
    }

    if(this.player.isAction) {
      this.isTouching = true;
      if(object.name == "Quadro"){ 
        console.log("Estou tocando no Quadro", object);
        const { space } = this.cursors;

        if (space.isDown && !this.spaceDown) {
          this.spaceDown = true;
          this.hud.showDialog('Carlos Eduardo Casteliano, Analise e desenvolvimento de sistemas - Introdução a jogos');
          if(this.isDialogBlocked == false){
            this.hud.hideDialog()
            console.log("fgrgthf"); 
          }

        } else if (!space.isDown && this.spaceDown){
          this.spaceDown = true;
          //setTimeout(() => this.hud.hideDialog(), 5000)
        }
      }
      else if(object.name == "Placa"){ 
        if(object.prop[0].value == "Comida"){
          this.dialago("Proibido comer");
        } else if(object.prop[0].value == "Celular"){
          this.dialago("Proibido celular");
        }
      }
      else if(object.name == "Cadeira"){ 
        if(!this.taSentado){
          this.sentarNaCadeira(object);
        } else{
          this.sairDaCadeira();
        }
      }
      else if(object.name == "Lixeira"){ 
        if(object.prop[0].value == "Laranja"){
          this.atualizarLixeira('Laranja', object.x, 2);
        } else if (object.prop[0].value == "Azul"){
          this.atualizarLixeira('Azul', object.x, 4);
        }
      }
    }
  };

  // Refatorar
  atualizarLixeira(corLixeira, objeto, frame){
    const lixeira = this.add.sprite(objeto, 48, 'Lixeira', frame); 

    if(corLixeira == 'Laranja'){
      this.input.keyboard.on('keydown', (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          lixeira.setTexture('Lixeira', 0);
        }
      });
    } else if(corLixeira == 'Azul'){
      this.input.keyboard.on('keydown', (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' ) {
          lixeira.setTexture('Lixeira', 3);
        }
      });
    }
  }

  dialago(texto){
    this.telaDialago = this.add.graphics();
    const width = CONFIG.GAME_WIDTH;
    const height = CONFIG.GAME_HEIGHT;

    const boxWidth = width * 0.6;
    const boxHeight = height * 0.1;

    const boxX = width / 2 - boxWidth / 2;
    const boxY = height / 2 - boxHeight / 2;

    this.telaDialago.fillStyle(0x000000, 0.7);
    this.telaDialago.fillRect(boxX, boxY, boxWidth, boxHeight);

    const textStyle = {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      aling: 'center',
      wordWrap: { width: boxWidth - 20, useAdvancedWrap: true }
    };

    const textX = boxX + 10;
    const textY = boxY + 10;

    this.textDialago = this.add.text(textX, textY, texto, textStyle);

    // Quando mover o player
    this.input.keyboard.on('keydown', (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        this.textDialago.setVisible(false);
        this.telaDialago.setVisible(false);
      }
    });
  };
  
  sentarNaCadeira(object) {
    this.taSentado = true;
    // this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.UP);
    // this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    // this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    // this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    const { x, y } = object.getCenter();
    this.player.setPosition(x - 9, y - 9);
    this.player.play('sit-right', true);
    this.player.direction = 'up';
  }

  sairDaCadeira() {
    console.log("espaço");
    this.taSentado = false;
  }

  Collided(){
    console.log('Collided');
  };
}