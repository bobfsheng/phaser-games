import Phaser from 'phaser';

const config = {
  //WebGL (Web Graphics library) JS Api for rendering 2D/3D graphics
  width: 800,
  height: 600,
  physics: {
    // Arcade physics plugin, mangages physics simulation
    default: 'arcade'
  },
  scene: {
    preload,
    create,
  }
};

// Loading assets, e.g., images, music, animations
function preload() {
  // this context  - scene
  // contains functions and properties we can use

  // debugger
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

let bird = null;

function create() {
  // this.add.image(config.width/2, config.height/2, 'sky');
  this.add.image(0, 0, 'sky').setOrigin(0);
  bird = this.physics.add.sprite(config.width / 10, config.height / 2, 'bird').setOrigin(0);
  bird.body.gravity.y = 2000;
  // debugger
}

new Phaser.Game(config);