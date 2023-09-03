import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', '/public/tiles/0x72_16x16DungeonTileset.v5.png')
    this.load.tilemapTiledJSON('dungeon', '/public/tiles/dungeon-01.json')

    this.load.atlas('texture', '/resources/texture.png', '/resources/texture.json')
    this.load.atlas('skeleton', '/resources/skeleton/skeleton.png', '/resources/skeleton/skeleton.json')

    this.load.image('ui-heart-full', '/resources/hearts/ui_heart_full.png')
    this.load.image('ui-heart-half', '/resources/hearts/ui_heart_half.png')
    this.load.image('ui-heart-empty', '/resources/hearts/ui_heart_empty.png')
  }

  create() {
    this.scene.start('game')
  }
}