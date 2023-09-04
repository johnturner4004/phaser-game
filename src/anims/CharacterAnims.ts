import Phaser from 'phaser'

const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'knight-idle-down',
    frames: [{ key: 'texture', frame: 'sprites/110.png' }]
  })
  
  anims.create({
    key: 'knight-idle-up',
    frames: [{ key: 'texture', frame: 'sprites/111.png' }]
  })

  anims.create({
    key: 'knight-idle-right',
    frames: [{ key: 'texture', frame: 'sprites/112.png' }]
  })

  anims.create({
    key: 'knight-run-down',
    frames: [
      { key: 'texture', frame: 'sprites/114.png'},
      { key: 'texture', frame: 'sprites/115.png'},
    ],
    repeat: -1,
    frameRate: 5
  })

  anims.create({
    key: 'knight-run-up',
    frames: [
      { key: 'texture', frame: 'sprites/116.png'},
      { key: 'texture', frame: 'sprites/117.png'},
    ],
    repeat: -1,
    frameRate: 5
  })

  anims.create({
    key: 'knight-run-right',
    frames: [
      { key: 'texture', frame: 'sprites/118.png'},
      { key: 'texture', frame: 'sprites/119.png'},
    ],
    repeat: -1,
    frameRate: 5
  })

  anims.create({
    key: 'knight-death',
    frames: [
      { key: 'texture', frame: 'sprites/111.png' },
      { key: 'texture', frame: 'sprites/112.png' },
      { key: 'texture', frame: 'sprites/110.png' },
    ],
    frameRate: 5
  })
}

export {
  createCharacterAnims
}