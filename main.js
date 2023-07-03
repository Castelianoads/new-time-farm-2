
import { AUTO } from "phaser";
import { CONFIG } from "./src/config";
import Farm from "./src/scenes/Farm";
import Home from "./src/scenes/Home";


const config = {
  with: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  type: AUTO,
  scene: [Farm, Home],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: true
    }
  },
  pixelArt: true,
  scale: {
    zoom: CONFIG.GAME_SCALE
  }
}


export default new Phaser.Game(config);