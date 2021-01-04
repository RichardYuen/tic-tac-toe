// Start scene

class startScene extends Phaser.Scene{
	constructor(){
		super({key: 'startScene'})
	}

	create(){
		this.add.text(125, 270, 'Play as', {fontSize: 32})
		this.add.text(375, 270, 'or', {fontSize: 32})

		let x = this.add.text(300, 256, 'X', {fontSize: 64})
		let o = this.add.text(450, 256, 'O', {fontSize: 64})

		x.setInteractive(new Phaser.Geom.Rectangle(0, 0,  x.width, x.height),
			Phaser.Geom.Rectangle.Contains)
		o.setInteractive(new Phaser.Geom.Rectangle(0, 0,  o.width, o.height),
			Phaser.Geom.Rectangle.Contains)

		x.on('pointerover', function(){
			x.setColor('#d50102')
		})
		x.on('pointerout', function (){
			x.setColor("#ffffff")
		})
		x.on('pointerdown', function(){
			this.scene.start('gameScene', {player: 'x'})
		}, this)
		o.on('pointerover', function(){
			o.setColor("#a6b401")
		})
		o.on('pointerout', function (){
			o.setColor("#ffffff")
		})
		o.on('pointerdown', function(){
			this.scene.start('gameScene', {player: 'o'})
		}, this)
	}
}
