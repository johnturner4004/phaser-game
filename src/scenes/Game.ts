import Phaser from 'phaser'
import { debugDraw } from '../utils/debug'

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private knight!: Phaser.Physics.Arcade.Sprite

	constructor() {
		super('game')
	}

	preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
	}

	create() {
    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('dungeon-2', 'tiles')

    map.createLayer('Ground', (tileset as Phaser.Tilemaps.Tileset), 0, 0) as Phaser.Tilemaps.TilemapLayer
    const wallLayer = map.createLayer('Walls', (tileset as Phaser.Tilemaps.Tileset), 0, 0) as Phaser.Tilemaps.TilemapLayer

    wallLayer.setCollisionByProperty({ collides: true})

    // debugDraw(wallLayer, this)

    this.knight = this.physics.add.sprite(248, 100, 'texture', 'sprites/110.png')
    
    this.anims.create({
      key: 'knight-idle-down',
      frames: [{ key: 'texture', frame: 'sprites/110.png' }]
    })
    
    this.anims.create({
      key: 'knight-idle-up',
      frames: [{ key: 'texture', frame: 'sprites/111.png' }]
    })

    this.anims.create({
      key: 'knight-idle-right',
      frames: [{ key: 'texture', frame: 'sprites/112.png' }]
    })

    this.anims.create({
      key: 'knight-run-down',
      frames: [
        { key: 'texture', frame: 'sprites/114.png'},
        { key: 'texture', frame: 'sprites/115.png'},
      ],
      repeat: -1,
      frameRate: 5
    })

    this.anims.create({
      key: 'knight-run-up',
      frames: [
        { key: 'texture', frame: 'sprites/116.png'},
        { key: 'texture', frame: 'sprites/117.png'},
      ],
      repeat: -1,
      frameRate: 5
    })

    this.anims.create({
      key: 'knight-run-right',
      frames: [
        { key: 'texture', frame: 'sprites/118.png'},
        { key: 'texture', frame: 'sprites/119.png'},
      ],
      repeat: -1,
      frameRate: 5
    })

    this.knight.anims.play('knight-idle-down')

    this.physics.add.collider(this.knight, wallLayer)

    this.cameras.main.startFollow(this.knight, true)
	}

  update(t: number, dt: number) {
    if (!this.cursors || !this.knight) {
      return
    }

    const speed = 100;
    if (this.cursors.left?.isDown) {
      this.knight.anims.play('knight-run-right', true)
      this.knight.scaleX = -1
      this.knight.body.offset.x = 16
      this.knight.setVelocity(-speed, 0)
    } else if (this.cursors.right?.isDown) {
      this.knight.anims.play('knight-run-right', true)
      this.knight.scaleX = 1
      this.knight.body.offset.x = 0
      this.knight.setVelocity(speed, 0)
    } else if (this.cursors.up?.isDown) {
      this.knight.anims.play('knight-run-up', true)
      this.knight.setVelocity(0, -speed)
    } else if (this.cursors.down?.isDown) {
      this.knight.anims.play('knight-run-down', true)
      this.knight.setVelocity(0, speed)
    } else {
      const state = this.knight.anims.currentAnim.key.split('-')
      state[1] = 'idle'
      this.knight.anims.play(state.join('-'))
      this.knight.setVelocity(0, 0)
    }
  }

}
