import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', '/public/tiles/0x72_16x16DungeonTileset.v5.png')
    this.load.tilemapTiledJSON('dungeon', '/public/tiles/dungeon-01.json')

    this.load.atlas('texture', '/resources/texture.png', '/resources/texture.json')
  }

  create() {
    this.scene.start('game')
  }
}