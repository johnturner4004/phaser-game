import Phaser from 'phaser'

export default class Game extends Phaser.Scene {
	constructor() {
		super('game')
	}

	preload() {
    
	}

	create() {
    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('dungeon-2', 'tiles')

    map.createLayer('Ground', (tileset as Phaser.Tilemaps.Tileset), 0, 0) as Phaser.Tilemaps.TilemapLayer
    const wallLayer = map.createLayer('Walls', (tileset as Phaser.Tilemaps.Tileset), 0, 0) as Phaser.Tilemaps.TilemapLayer

    wallLayer.setCollisionByProperty({ collides: true})

    const debugGraphics = this.add.graphics().setAlpha(0.75)
    wallLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })
	}
}
