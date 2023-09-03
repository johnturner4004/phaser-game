import Phaser from 'phaser'

const createSkeletonAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'skeleton-idle-down',
    frames: [{ key: 'skeleton', frame: 'skeleton/120.png' }]
  })

  anims.create({
    key: 'skeleton-idle-up',
    frames: [{ key: 'skeleton', frame: 'skeleton/121.png' }]
  })

  anims.create({
    key: 'skeleton-idle-right',
    frames: [{ key: 'skeleton', frame: 'skeleton/122.png' }]
  })

  anims.create({
    key: 'skeleton-run-down',
    frames: [
      { key: 'skeleton', frame: 'skeleton/124.png' },
      { key: 'skeleton', frame: 'skeleton/125.png' }
    ],
    repeat: -1,
    frameRate: 5
  })

  anims.create({
    key: 'skeleton-run-up',
    frames: [
      { key: 'skeleton', frame: 'skeleton/126.png' },
      { key: 'skeleton', frame: 'skeleton/127.png' }
    ],
    repeat: -1,
    frameRate: 5
  })

  anims.create({
    key: 'skeleton-run-right',
    frames: [
      { key: 'skeleton', frame: 'skeleton/128.png' },
      { key: 'skeleton', frame: 'skeleton/129.png' }
    ],
    repeat: -1,
    frameRate: 5
  })
}

export {
  createSkeletonAnims
}