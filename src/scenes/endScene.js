// End scene: Show winner and rematch option

class endScene extends Phaser.Scene{
	constructor(){
		super({key: 'endScene'})
	}

	init(data){
		this.message =  data.message
	}

	create(){
		this.add.text(50, 100, this.message, {fontSize: 64})
		let rematch = this.add.text(50, 200, 'Rematch', {fontSize: 32})
		rematch.setInteractive()

		rematch.on('pointerover', () => {
			rematch.setColor('#eff67b')
		})
		rematch.on('pointerout', () => {
			rematch.setColor('#ffffff')
		})
		rematch.on('pointerdown', () => this.rematch())
	
	}

	rematch(){
		this.scene.start('startScene')
	}
}

