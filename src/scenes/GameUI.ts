import Phaser from 'phaser'
import { sceneEvents } from '../events/EventsCenter'

export default class GameUI extends Phaser.Scene {

  private hearts!: Phaser.GameObjects.Group
  
  constructor() {
    super({ key: 'game-ui' })
  }

  create() {
    const coin = this.add.sprite(10, 24, 'coin', 'coin/0.png')

    this.anims.create({
      key: 'coin-spin',
      frames: this.anims.generateFrameNames('coin', { start: 0, end: 23, prefix: 'coin/', suffix: '.png'}),
      frameRate: 10,
      repeat: -1
    })

    coin.anims.play('coin-spin')

    const coinsLabel = this.add.text(14, 19.1, '0', {
      fontSize: '10.23px'
    })

    sceneEvents.on('player-coins-changed', (coins: number) => {
      coinsLabel.text = coins.toLocaleString()
    })

    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image
    })

    this.hearts.createMultiple({
      key: 'ui-heart-full',
      setXY: {
        x: 10,
        y:10,
        stepX: 16
      },
      quantity: 3
    })

    sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this)
      sceneEvents.off('player-coins-changed')
    })
  }

  private handlePlayerHealthChanged(health: number) {
    this.hearts.children.each((go, idx) => {
      const heart = go as Phaser.GameObjects.Image

      if (idx < health) {
        heart.setTexture('ui-heart-full')
      } else {
        heart.setTexture('ui-heart-empty')
      }
    })
  }
}
