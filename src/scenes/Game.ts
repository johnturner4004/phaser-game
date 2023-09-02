import Phaser from 'phaser'
import Skeleton from '../enemies/Skeleton'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createSkeletonAnims } from '../anims/EnemyAnims'
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
    createCharacterAnims(this.anims)
    createSkeletonAnims(this.anims)

    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('dungeon-2', 'tiles')

    map.createLayer('Ground', (tileset as Phaser.Tilemaps.Tileset), 0, 0) as Phaser.Tilemaps.TilemapLayer
    const wallLayer = map.createLayer('Walls', (tileset as Phaser.Tilemaps.Tileset), 0, 0) as Phaser.Tilemaps.TilemapLayer

    wallLayer.setCollisionByProperty({ collides: true})

    // debugDraw(wallLayer, this)

    // knight
    this.knight = this.physics.add.sprite(248, 100, 'texture', 'sprites/110.png')

    this.knight.anims.play('knight-idle-down')

    this.cameras.main.startFollow(this.knight, true)

    // skeleton
    const skeletons = this.physics.add.group({
      classType: Skeleton,
      createCallback: (go) => {
        const skeletonGo = go as Skeleton
        skeletonGo.body.onCollide = true
      }
    })

    skeletons.get(100, 100, 'skeleton')

    this.physics.add.collider(this.knight, wallLayer)
    this.physics.add.collider(skeletons, wallLayer)
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
