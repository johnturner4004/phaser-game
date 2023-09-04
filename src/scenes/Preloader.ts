import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', '/tiles/0x72_16x16DungeonTileset.v5.png')
    this.load.tilemapTiledJSON('dungeon', '/tiles/dungeon-01.json')

    this.load.atlas('texture', '/resources/texture.png', '/resources/texture.json')
    this.load.atlas('skeleton', '/resources/skeleton/skeleton.png', '/resources/skeleton/skeleton.json')
    this.load.atlas('treasure', '/resources/chest/treasure.png', '/resources/chest/treasure.json')

    this.load.image('ui-heart-full', '/resources/hearts/ui_heart_full.png')
    this.load.image('ui-heart-half', '/resources/hearts/ui_heart_half.png')
    this.load.image('ui-heart-empty', '/resources/hearts/ui_heart_empty.png')

    this.load.image('sword', '/resources/weapons/weapon_sword_ruby.png')
  }

  create() {
    this.scene.start('game')
  }
}