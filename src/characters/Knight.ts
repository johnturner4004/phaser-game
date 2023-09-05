import Chest from '../items/Chest'
import Phaser from 'phaser'
import { sceneEvents } from '../events/EventsCenter'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      knight(x: number, y: number, texture: string, frame?: string | number): Knight
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

export default class Knight extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE
  private damageTime = 0
  private _health = 3
  private _coins = 0
  private swords?: Phaser.Physics.Arcade.Group
  private activeChest?: Chest

  get health() {
    return this._health
  }
  
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play('knight-idle-down')
  }

  setSwords(swords: Phaser.Physics.Arcade.Group) {
    this.swords = swords
  }

  setChest(chest: Chest) {
    this.activeChest = chest
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return
    }

    if (this.healthState === HealthState.DAMAGE) {
      return
    }

    --this._health

    if (this._health <= 0) {
      // die
      this.healthState = HealthState.DEAD
      this.setVelocity(0, 0)
      this.anims.play('knight-death')
      this.setTint(0xff0000)
    } else {
      this.setVelocity(dir.x, dir.y)
  
      this.healthState = HealthState.DAMAGE
      this.damageTime = 0
    }
  }

  private throwSword() {
    if (!this.swords) {
      return
    }

    const parts = this.anims.currentAnim.key.split('-')
    const direction = parts[2]

    const vec = new Phaser.Math.Vector2(0, 0)
    
    switch (direction) {
      case 'up':
        vec.y = -1
        break
      
      case 'down':
        vec.y = 1
        break

      case 'right':
        if (this.scaleX < 0) {
          vec.x = -1
        } else {
          vec.x = 1
        }
        break
    }

    const angle = vec.angle()
    const sword = this.swords.get(this.x, this.y, 'sword') as Phaser.Physics.Arcade.Image

    if (!sword) {
      return
    }

    sword.setActive(true)
    sword.setVisible(true)

    sword.x += vec.x * 16
    sword.y += vec.y * 16

    sword.setRotation(angle)
    sword.setVelocity(vec.x * 300, vec.y * 300)
  }
  

  protected preUpdate(t: number, dt: number): void {
    super.preUpdate(t, dt)

    switch (this.healthState) {
      case HealthState.DAMAGE:
        this.damageTime += dt
        if (this.damageTime > 250) {
          this.healthState = HealthState.IDLE
          this.setTint(0xffffff)
          this.damageTime = 0
          
        }

        if (Math.floor(this.damageTime / 10) % 2 === 1) {
          this.setTint(0xff0000)
        } else {
          this.setTint(0xffffff)
        }
        break

      case HealthState.DEAD:
        
        break
      
      case HealthState.IDLE:

        break
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursors 
      || this.healthState === HealthState.DAMAGE 
      || this.healthState === HealthState.DEAD) {
      return
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
      if (this.activeChest) {
        const coins = this.activeChest.open()
        this._coins += coins
        sceneEvents.emit('player-coins-changed', this._coins)
      } else {
        this.throwSword()
      }
      return
    }

    const speed = 100;
    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown

    if (leftDown) {
      this.anims.play('knight-run-right', true)
      this.scaleX = -1
      this.body.offset.x = 16
      this.setVelocity(-speed, 0)

    } else if (rightDown) {
      this.anims.play('knight-run-right', true)
      this.scaleX = 1
      this.body.offset.x = 0
      this.setVelocity(speed, 0)

    } else if (upDown) {
      this.anims.play('knight-run-up', true)
      this.setVelocity(0, -speed)

    } else if (downDown) {
      this.anims.play('knight-run-down', true)
      this.setVelocity(0, speed)

    } else {
      const state = this.anims.currentAnim.key.split('-')
      state[1] = 'idle'
      this.anims.play(state.join('-'))
      this.setVelocity(0, 0)
    }

    if (leftDown || rightDown || upDown || downDown) {
      this.activeChest = undefined
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('knight', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new Knight(this.scene, x, y, texture, frame)

  this.displayList.add(sprite)
  this.updateList.add(sprite)

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

  return sprite
})