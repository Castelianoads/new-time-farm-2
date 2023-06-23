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
    this.load.tilemapTiledJSON('tilemap-fazenda', 'mapas/fazenda.json')

    this.load.image('geral', 'mapas/tiles/geral.png')
    this.load.image('agua1_anim', 'mapas/tiles/agua1_anim.png')
    this.load.atlas('hud', 'hud.png', 'hud.json')
    
    this.load.spritesheet('player', 'mapas/fazenda/main_character.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('arvore_normal', 'mapas/fazenda/arvore_anim.png', {
      frameWidth: 48,
      frameHeight: CONFIG.TILE_SIZE * 2
    });
    this.load.spritesheet('arvore_pera', 'mapas/fazenda/arvore_peras_anim.png', {
      frameWidth: 48,
      frameHeight: CONFIG.TILE_SIZE * 2
    });
    this.load.spritesheet('arvore_laranja', 'mapas/fazenda/arvore_laranjas_anim.png', {
      frameWidth: 48,
      frameHeight: CONFIG.TILE_SIZE * 2
    });
    this.load.spritesheet('arvore_maca', 'mapas/fazenda/arvore_macas_anim.png', {
      frameWidth: 48,
      frameHeight: CONFIG.TILE_SIZE * 2
    });
    this.load.spritesheet('arvore_pessego', 'mapas/fazenda/arvore_pessegos_anim.png', {
      frameWidth: 48,
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
      key: 'tilemap-fazenda',
      tileHeight: CONFIG.TILE_SIZE,
      tileWidth: CONFIG.TILE_SIZE
    })
    this.map.addTilesetImage('geral', 'geral')
    this.map.addTilesetImage('agua1_anim', 'agua1_anim')
  }

 

  createLayers(){
    const tilesOffice = this.map.getTileset('geral') // Nome no tiles
    const tilesOffice2 = this.map.getTileset('agua1_anim') // Nome no tiles
    const layersNames = this.map.getTileLayerNames();

    for (let i = 0; i < layersNames.length; i++) {
      const name = layersNames[i];
      if(name == 'Abaixo agua Collision'){
        this.layers[name] = this.map.createLayer(name, [tilesOffice2], 0, 0)
        this.layers[name].setDepth(i);
        console.log(name, this.layers[name].depth);
        
      } else{
        this.layers[name] = this.map.createLayer(name, [tilesOffice], 0, 0)
        this.layers[name].setDepth(i);
        console.log(name, this.layers[name].depth);
      }
      // Define a profundidade de cada camada (Layer)

      if(name.endsWith('Collision')){
        this.layers[name].setCollisionByProperty({ collide: true })
        this.layers[name].setTileIndexCallback(0, this, (sprite, tile) => {
            console.log(`collided with ${tile.properties.object}, ${sprite}`);
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

    const objects = this.map.createFromObjects("Objeto", "Objeto", "Objeto", {
      name: "placa", name: "loja", name: "casa"
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
    this.player = new Player(this, 18 * 8, 20 * 5, this.touch);
    this.player.setDepth(5);        
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

      if(object.name == 'loja'){
        console.log("Tocou na loja");
      } 
      else if(object.name == "placa"){ 
        this.showModal("Deseja plantar " + object.prop[0].value + " ?" )
        console.log("Tocou na placa: " + object.prop[0].value);
        // if(object.prop[0].value == "Comida"){
        //   this.dialago("Proibido comer");
        // } else if(object.prop[0].value == "Celular"){
        //   this.dialago("Proibido celular");
        // }
      }
      else if(object.name == "casa"){ 
        console.log("Tocou na casa");
        // if(!this.taSentado){
        //   this.sentarNaCadeira(object);
        // } else{
        //   this.sairDaCadeira();
        // }
      }
      // if(object.name == "Quadro"){ 
      //   console.log("Estou tocando no Quadro", object);
      //   const { space } = this.cursors;

      //   if (space.isDown && !this.spaceDown) {
      //     this.spaceDown = true;
      //     this.hud.showDialog('Carlos Eduardo Casteliano, Analise e desenvolvimento de sistemas - Introdução a jogos');
      //     if(this.isDialogBlocked == false){
      //       this.hud.hideDialog()
      //       console.log("fgrgthf"); 
      //     }
      //   } else if (!space.isDown && this.spaceDown){
      //     this.spaceDown = true;
      //     //setTimeout(() => this.hud.hideDialog(), 5000)
      //   }
      // }
      // else if(object.name == "Lixeira"){ 
      //   if(object.prop[0].value == "Laranja"){
      //     this.atualizarLixeira('Laranja', object.x, 2);
      //   } else if (object.prop[0].value == "Azul"){
      //     this.atualizarLixeira('Azul', object.x, 4);
      //   }
      // }
    }
  };

  showModal(message) {
    this.telaDialago = this.add.graphics();
    const width = CONFIG.GAME_WIDTH;
    const height = CONFIG.GAME_HEIGHT;
    const boxWidth = width * 0.6;
    const boxHeight = height * 0.3;
    const boxX = width / 2 - boxWidth / 2;
    const boxY = height / 2 - boxHeight / 2; 
    const textX = boxX + 60;
    const textY = boxY + 10;

    this.telaDialago.fillStyle(0x000000, 0.7)
      .fillRect(boxX, boxY, boxWidth, boxHeight)
      .setDepth(13);

    const textStyle = {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
      aling: 'center',
      wordWrap: { width: boxWidth - 20, useAdvancedWrap: true }
    };
   
    this.textDialago = this.add.text(textX, textY, message, textStyle)
      .setDepth(14);

    const yesButton = this.add.text(textX + 10, textY + 50, 'Sim', textStyle)
      .setInteractive()
      .setDepth(15)
      .on('pointerdown', () => {
        console.log('Usuário selecionou: Sim');
        this.closeModal();
        closeButton()
      });
  
    const noButton = this.add.text(textX + 120, textY + 50, 'Não', textStyle)
      .setInteractive()
      .setDepth(15)
      .on('pointerdown', () => {
        console.log('Usuário selecionou: Não');
        this.closeModal();
        closeButton()
      });

    // Quando mover o player
    this.input.keyboard.on('keydown', (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        this.closeModal();
        closeButton()
      }
    });

    function closeButton(){
      noButton.setVisible(false);
      yesButton.setVisible(false);
    }
  } 

  // exibirDialago(){
  //   const dialogBox = this.add.graphics();
  //   dialogBox.fillStyle(0x000000, 0.8);
  //   dialogBox.fillRect(100, 200, 600, 200);

  //   // Criar botão "Sim"
  //   const yesButton = this.add.text(250, 300, 'Sim', { fill: '#ffffff' })
  //     .setInteractive()
  //     .setDepth(10)
  //     .on('pointerdown', () => {
  //       // Lógica para quando o usuário clicar em "Sim"
  //       console.log('Usuário selecionou: Sim');
  //       this.closeDialago();
  //       yesButton.setVisible(false)
  //     });

  //   // Criar botão "Não"
  //   const noButton = this.add.text(450, 300, 'Não', { fill: '#ffffff' })
  //     .setInteractive()
  //     .setDepth(10)
  //     .on('pointerdown', () => {
  //       // Lógica para quando o usuário clicar em "Não"
  //       console.log('Usuário selecionou: Não');
  //       this.closeDialago();
  //       noButton.setVisible(false)
  //     });
  //   }


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

  closeModal(){
    this.textDialago.setVisible(false);
    this.telaDialago.setVisible(false);
  }

  // dialago(texto){
  //   this.telaDialago = this.add.graphics();
  //   const width = CONFIG.GAME_WIDTH;
  //   const height = CONFIG.GAME_HEIGHT;

  //   const boxWidth = width * 0.6;
  //   const boxHeight = height * 0.1;

  //   const boxX = width / 2 - boxWidth / 2;
  //   const boxY = height / 2 - boxHeight / 2;

  //   this.telaDialago.fillStyle(0x000000, 0.7);
  //   this.telaDialago.fillRect(boxX, boxY, boxWidth, boxHeight);

  //   const textStyle = {
  //     fontFamily: 'Arial',
  //     fontSize: '18px',
  //     color: '#ffffff',
  //     aling: 'center',
  //     wordWrap: { width: boxWidth - 20, useAdvancedWrap: true }
  //   };

  //   const textX = boxX + 10;
  //   const textY = boxY + 10;

  //   this.textDialago = this.add.text(textX, textY, texto, textStyle);

  //   // Quando mover o player
  //   this.input.keyboard.on('keydown', (event) => {
  //     if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
  //       this.textDialago.setVisible(false);
  //       this.telaDialago.setVisible(false);
  //     }
  //   });
  // };
  
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