import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH / 10, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
};

const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene];
const initScenes = ()=>Scenes.map(scene => new scene(SHARED_CONFIG))

let gamingCanvas  = document.getElementById("gamingCanvas");

const config = {
  canvas: gamingCanvas,
  type: Phaser.CANVAS,
  ...SHARED_CONFIG,
  physics: {
    // Arcade physics plugin, mangages physics simulation
    default: 'arcade',
    arcade: {
      // gravity: {y: 200},
      debug: true,
    }
  },
  // scene: [new PreloadScene(SHARED_CONFIG), new MenuScene(SHARED_CONFIG), new PlayScene(SHARED_CONFIG)]
  scene: initScenes()
};

console.log("in GameConfig.js");
console.log(config);
export default config;

// new Phaser.Game(config);
