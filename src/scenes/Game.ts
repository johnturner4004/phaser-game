import '../characters/Knight'

import Knight from '../characters/Knight'
import Phaser from 'phaser'
import Skeleton from '../enemies/Skeleton'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createSkeletonAnims } from '../anims/EnemyAnims'
import { debugDraw } from '../utils/debug'
import { sceneEvents } from '../events/EventsCenter'

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private knight!: Knight
  private swords!: Phaser.Physics.Arcade.Group
  private skeletons!: Phaser.Physics.Arcade.Group

  private playerSkeletonCollider?: Phaser.Physics.Arcade.Collider

	constructor() {
		super('game')
	}

	preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
	}

	create() {
    this.scene.run('game-ui')

    createCharacterAnims(this.anims)
    createSkeletonAnims(this.anims)

    this.swords = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image
    })

    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('dungeon-2', 'tiles')

    map.createLayer('Ground', (tileset as Phaser.Tilemaps.Tileset), 0, 0) as Phaser.Tilemaps.TilemapLayer
    const wallLayer = map.createLayer('Walls', (tileset as Phaser.Tilemaps.Tileset), 0, 0) as Phaser.Tilemaps.TilemapLayer

    wallLayer.setCollisionByProperty({ collides: true})

    // debugDraw(wallLayer, this)

    // knight
    this.knight = this.add.knight(248, 100, 'texture')
    this.knight.setSwords(this.swords)

    this.cameras.main.startFollow(this.knight, true)

    // skeleton
    this.skeletons = this.physics.add.group({
      classType: Skeleton,
      createCallback: (go) => {
        const skeletonGo = go as Skeleton
        skeletonGo.body.onCollide = true
      }
    })

    this.skeletons.get(100, 100, 'skeleton')

    this.physics.add.collider(this.knight, wallLayer)
    this.physics.add.collider(this.skeletons, wallLayer)

    this.physics.add.collider(this.swords, wallLayer, this.handleSwordWallCollision, undefined, this)
    this.physics.add.collider(this.swords, this.skeletons, this.handleSwordSkeletonCollision, undefined, this)

    this.playerSkeletonCollider = this.physics.add.collider(this.skeletons, this.knight, this.handlePlayerSkeletonCollision, undefined, this)
	}

  private handleSwordWallCollision(ojb1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    this.swords.killAndHide(ojb1)
  }

  private handleSwordSkeletonCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    this.swords.killAndHide(obj1)
    this.skeletons.killAndHide(obj2)
  }

  private handlePlayerSkeletonCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const skeleton = obj2 as Skeleton

    const dx = this.knight.x - skeleton.x
    const dy = this.knight.y - skeleton.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    this.knight.handleDamage(dir)

    sceneEvents.emit('player-health-changed', this.knight.health)

    if (this.knight.health <= 0) {
      this.playerSkeletonCollider?.destroy()
    }
  }

  update(t: number, dt: number) {
    if (this.knight) {
      this.knight.update(this.cursors)
    }
  }

}
