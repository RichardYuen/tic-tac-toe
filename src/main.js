var config = {
	type: Phaser.AUTO,
	width: 600,
	height: 600,
	autoCenter: true,
	backgroundColor: "#b3e7dc",
	scene: [startScene, gameScene, endScene]
}

var game = new Phaser.Game(config)
