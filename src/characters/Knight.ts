import Phaser from 'phaser'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      knight(x: number, y: number, texture: string, frame?: string | number): Knight
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE
}

export default class Knight extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE
  private damageTime = 0
  
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play('knight-idle-down')
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this.healthState === HealthState.DAMAGE) {
      return
    }

    this.setVelocity(dir.x, dir.y)

    this.setTint(0xff0000)

    this.healthState = HealthState.DAMAGE
    this.damageTime = 0
  }

  protected preUpdate(t: number, dt: number): void {
      switch (this.healthState) {
        case HealthState.DAMAGE:
          this.damageTime += dt
          if (this.damageTime > 250) {
            this.healthState = HealthState.IDLE
            this.setTint(0xffffff)
            this.damageTime = 0
            
          }
          break
        
        case HealthState.IDLE:

          break
      }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursors || this.healthState === HealthState.DAMAGE) {
      return
    }

    const speed = 100;
    if (cursors.left?.isDown) {
      this.anims.play('knight-run-right', true)
      this.scaleX = -1
      this.body.offset.x = 16
      this.setVelocity(-speed, 0)

    } else if (cursors.right?.isDown) {
      this.anims.play('knight-run-right', true)
      this.scaleX = 1
      this.body.offset.x = 0
      this.setVelocity(speed, 0)

    } else if (cursors.up?.isDown) {
      this.anims.play('knight-run-up', true)
      this.setVelocity(0, -speed)

    } else if (cursors.down?.isDown) {
      this.anims.play('knight-run-down', true)
      this.setVelocity(0, speed)

    } else {
      const state = this.anims.currentAnim.key.split('-')
      state[1] = 'idle'
      this.anims.play(state.join('-'))
      this.setVelocity(0, 0)
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