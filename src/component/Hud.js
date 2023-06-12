import Phaser from "phaser";
import { CONFIG } from "../config";

export default class Hud extends Phaser.GameObjects.Container {

  /** @type {Phaser.GameObjects.Container} */
  dialog;

  /** @type {Phaser.GameObjects.Text} */
  dialogText

  /** @type {Phaser.GameObjects.Sprite} */
  dialogNext

  dialogPositionShow;
  dialogPositionHided;

  isDialogBlocked = false;

  constructor(scene, x, y) {
    super(scene, x, y);

    //Colocanod hud na tela
    scene.add.existing(this);

    this.createDialog();
    
  }

  createDialog() {
    this.dialog = this.add(new Phaser.GameObjects.Container(this.scene));
    this.dialog.setDepth(10);

    const tileSize = CONFIG.TILE_SIZE
    const largura = CONFIG.GAME_WIDTH - (2 * tileSize);
    const altura = 4 * tileSize;

    this.dialogPositionShow = CONFIG.GAME_HEIGHT - altura - tileSize * 2;
    this.dialogPositionHide = CONFIG.GAME_HEIGHT + tileSize;

    this.dialog.add(
      [
        this.scene.add.image(0, 0, 'hud', 'dialog_topleft'),
        this.scene.add.image(16, 0, 'hud', 'dialog_top').setDisplaySize(largura, tileSize),
        this.scene.add.image(largura + tileSize, 0, 'hud', 'dialog_topright'),
        
        this.scene.add.image(0, 16, 'hud', 'dialog_left').setDisplaySize(tileSize, altura),
        this.scene.add.image(16, 16, 'hud', 'dialog_center').setDisplaySize(largura, altura),
        this.scene.add.image(largura + tileSize, 16, 'hud', 'dialog_right').setDisplaySize(tileSize, altura),

        this.scene.add.image(0, altura + tileSize, 'hud', 'dialog_bottomleft'),
        this.scene.add.image(16, altura + tileSize, 'hud', 'dialog_bottom').setDisplaySize(largura, tileSize),
        this.scene.add.image(largura + tileSize, altura + tileSize, 'hud', 'dialog_bottomright'),
      ]
    )
    
      this.dialog.setPosition(0, this.dialogPositionHide)

      const style = {
        fontFamily : 'Verdana',
        fontSize: 12,
        color: '#6b5052',
        maxLines: 3,
        wordWrap : { width: largura }
      }

      this.dialogText = this.scene.add.text(tileSize, tileSize, 'Meu texto', style);
      this.dialog.add(this.dialogText);
  }

  showDialog(text) {
    this.dialogText.text = '';
    this.isDialogBlocked = true;
    console.log('Entrou show dialog')

    // Verificando se está fora da tela
    if (this.dialog.y > this.dialogPositionShow) {
      console.log('fora da tela')
      this.scene.add.tween({
        targets: this.dialog,
        duration: 800,
        y: this.dialogPositionShow,
        ease: Phaser.Math.Easing.Bounce.Out,
        onComplete: () => {
          this.showText(text);
          console.log('Entrou show dialog - complete')  
        }
      });
    } else {
      this.showText();
      console.log('Entrou show dialog - else')
    }
  }


  showText(text) {
    console.log('Entrou metidi showText')
    //this.dialogText.text = text;
    //Fazer o dialog aparecer igual o dialog do megamam
    let i = 0;
    this.scene.time.addEvent({
      repeat: text.length - 1,
      delay: 20,
      callback: () => { 
        // Entrou 88 vezes
        console.log(text[i])
        this.dialogText.text += text[i++];
        if(this.dialogText.text.length == text.length){
          console.log('Entrou metidi showText - callback e isdialago = false')
          this.isDialogBlocked = false;
          //this.hideDialog()
        }
      }
    })
  }

  hideDialog(){
    this.scene.add.tween({
      targets: this.dialog,
      duration: 400,
      y: this.dialogPositionHide,
      ease: Phaser.Math.Easing.Bounce.In,
    })
  }
}