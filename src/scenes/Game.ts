import '../characters/Knight'

import Knight from '../characters/Knight'
import Phaser from 'phaser'
import Skeleton from '../enemies/Skeleton'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createSkeletonAnims } from '../anims/EnemyAnims'
import { debugDraw } from '../utils/debug'

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private knight!: Knight

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
    this.knight = this.add.knight(248, 100, 'texture')

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

    this.physics.add.collider(skeletons, this.knight, this.handlePlayerSkeletonCollision, undefined, this)
	}

  private handlePlayerSkeletonCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const skeleton = obj2 as Skeleton

    const dx = this.knight.x - skeleton.x
    const dy = this.knight.y - skeleton.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    this.knight.handleDamage(dir)
  }

  update(t: number, dt: number) {
    if (this.knight) {
      this.knight.update(this.cursors)
    }
  }

}
