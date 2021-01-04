// Game scene

class gameScene extends Phaser.Scene{
	constructor(){
		super({key: 'gameScene'})
	}

	init(data){
		this.data = data
	}

	create(){
		this.graphics = this.add.graphics()

		// Initialize board
		this.board = [
		    ['_', '_', '_'],
		    ['_', '_', '_'],
		    ['_', '_', '_']
		]

		// Initialize game
		this.event = new Phaser.Events.EventEmitter()

		this.event.on('changeTurn', this.changeTurn, this)
		this.event.on('gameFinished', this.gameFinished, this)

		this.player = this.data.player
		this.computer = this.data.player == 'x' ? 'o' : 'x'

		//Pick turn
		if(Math.floor(Math.random() * 2) == 0){
			this.turn = this.player
		}else{
			this.turn = this.computer
		}

		// Display board
		this.drawBoard()

		this.event.emit('changeTurn', this.turn)

	}

	changeTurn(turn){
		console.log(this.board)
		if(this.isFinished()){
			this.event.emit('gameFinished')
		}else{
			if(turn == this.computer){
				this.computerTurn()
			}else if(turn == this.player){
				this.playerTurn()
			}			
		}
	}

	computerTurn(){
		if(!this.isFinished() && this.turn == this.computer){
				let move = this.findBestMove(this.board, this.computer)
				this.board[move.row][move.col] = this.computer
				if(this.computer == 'x'){
					this.drawX(move.row, move.col)
				}else if(this.computer == 'o'){
					this.drawO(move.row, move.col)
				}
				this.turn = this.player
				this.event.emit('changeTurn', this.player)
		}
	}

	playerTurn(){
		let game = this
		game.input.on('pointerdown', function(pointer){
			if(!game.isFinished() && game.turn == game.player){
				let move = game.determineCoordinate(pointer.x, pointer.y)
				if(game.board[move.row][move.col] == '_'){
					game.board[move.row][move.col] = game.player
					if(game.player == 'x'){
						game.drawX(move.row, move.col)
					}else if(game.player == 'o'){
						game.drawO(move.row, move.col)
					}
					game.turn = game.computer
					game.event.emit('changeTurn', game.computer)
				}
			}
		})
	}

	// Game functions
	showEndScene(){
		let message = ''
		if(this.gameStatus == 1){
			message = 'YOU WIN!'
		}else if(this.gameStatus == -1){
			message = 'YOU LOSE!'
		}else{
			message = 'TIE!'
		}
		
		this.scene.start('endScene', {message: message})
	}

	gameFinished(){
		let winner = this.checkWinner()
		if(winner == this.player){
			this.gameStatus = 1
		}else if(winner == this.computer){
			this.gameStatus = -1
		}else{
			this.gameStatus = 0
		}
		this.time.delayedCall(1500, this.showEndScene, [], this)
	}

	isFinished(){
		// Horizontally check
		for(let row = 0; row < 3; row++){
			if(this.board[row][0] == this.board[row][1] && this.board[row][1] == this.board[row][2]){
				if(this.board[row][0] == 'x')
					return true
				else if(this.board[row][0] == 'o')
					return true
			}
		}

		// Vertically check
		for(let col = 0; col < 3; col++){
			if(this.board[0][col] == this.board[1][col] && this.board[1][col] == this.board[2][col]){
				if(this.board[0][col] == 'x')
					return true
				else if(this.board[0][col] == 'o')
					return true
			}
		}

		// Diagonally check
		if(this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]){
			if(this.board[0][0] == 'x')
				return true
			else if(this.board[0][0] == 'o')
				return true
		}

		if(this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2]){
			if(this.board[1][1] == 'x')
				return true
			else if(this.board[1][1] == 'o')
				return true
		}

		// Check no move left
		return this.noMoveLeft(this.board)
	}

	checkWinner(){

		// Horizontally check
		for(let row = 0; row < 3; row++){
			if(this.board[row][0] == this.board[row][1] && this.board[row][1] == this.board[row][2]){
				if(this.board[row][0] == 'x')
					return 'x'
				else if(this.board[row][0] == 'o')
					return 'o'
			}
		}

		// Vertically check
		for(let col = 0; col < 3; col++){
			if(this.board[0][col] == this.board[1][col] && this.board[1][col] == this.board[2][col]){
				if(this.board[0][col] == 'x')
					return 'x'
				else if(this.board[0][col] == 'o')
					return 'o'
			}
		}

		// Diagonally check
		if(this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]){
			if(this.board[1][1] == 'x')
				return 'x' 
			else if(this.board[1][1] == 'o')
				return 'o'
		}

		if(this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2]){
			if(this.board[1][1] == 'x')
				return 'x' 
			else if(this.board[1][1] == 'o')
				return 'o'
		}
		return ''
	}

	determineCoordinate(x, y){
		let i = Math.floor((y - 15)/195)
		let j = Math.floor((x - 15)/195)

		return {row: i, col: j}
	}

	// Minimax algorithms
	noMoveLeft(board){
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++){
				if(board[i][j] == '_') 
					return false
			}
		}
		return true
	}

	miniMax(board, depth, isMax, player){
		// console.log(board)

		let opponent = player == 'x' ? 'o' : 'x'

		let score = this.evaluation(board, player)

		if(score == 10)
			return score - depth

		if(score == -10)
			return score + depth

		if(this.noMoveLeft(board)){
			return 0
		}

		if(isMax){
			let value = -1000
			for(let i = 0; i < 3; i++){
				for(let j = 0; j < 3; j++){
					if(board[i][j] == '_'){
						board[i][j] = player
						value = Math.max(value, this.miniMax(board, depth+1, !isMax, player))
						board[i][j] = '_'
					}

				}
			}
			return value
		}else{
			let value = 1000
			for(let i = 0; i < 3; i++){
				for(let j = 0; j < 3; j++){
					if(board[i][j] == '_'){
						board[i][j] = opponent
						value = Math.min(value, this.miniMax(board, depth+1, !isMax, player))
						board[i][j] = '_'
					}

				}
			}
			return value
		}
	}

	evaluation(board, player){
		let opponent = player == 'x' ? 'o' : 'x'

		// Horizontally check
		for(let row = 0; row < 3; row++){
			if(board[row][0] == board[row][1] && board[row][1] == board[row][2]){
				if(board[row][0] == player)
					return +10
				else if(board[row][0] == opponent)
					return -10
			}
		}

		// Vertically check
		for(let col = 0; col < 3; col++){
			if(board[0][col] == board[1][col] && board[1][col] == board[2][col]){
				if(board[0][col] == player)
					return +10
				else if(board[0][col] == opponent)
					return -10
			}
		}

		// Diagonally check
		if(board[0][0] == board[1][1] && board[1][1] == board[2][2]){
			if(board[0][0] == player)
				return +10
			else if(board[0][0] == opponent)
				return -10
		}

		if(board[2][0] == board[1][1] && board[1][1] == board[0][2]){
			if(board[0][0] == player)
				return +10
			else if(board[0][0] == opponent)
				return -10
		}
		return 0
	}

	findBestMove(board, player){
		let score = -1000
		let move = {row: -1, col: -1}
		for(let i = 0;  i < 3; i++){
			for(let j = 0; j < 3; j++){
				if(board[i][j] == '_'){
					board[i][j] = player
					let moveScore = this.miniMax(board, 0, false, player)
					board[i][j] = '_'

					if(moveScore >=  score){
						move.row = i
						move.col = j
						score = moveScore
					}		
				}
			}
		}
		return move
	}

	// Graphics functions

	drawBoard(){
		this.graphics.lineStyle(3, 0xffffff, 1)
		this.graphics.beginPath()

		for(let i = 1; i < 3; i++){
			this.graphics.moveTo(15, i * 195 )
			this.graphics.lineTo(585, i * 195)

		}
		for(let j = 1; j < 3; j++){
			this.graphics.moveTo(j * 195, 15)
			this.graphics.lineTo(j * 195, 585)
		}
		this.graphics.closePath()
		this.graphics.strokePath()
	}

	drawX(i , j){
		this.graphics.lineStyle(5, 0xd50102, 1)
		this.graphics.beginPath()
		
		// Draw X
		this.graphics.moveTo(15 + j * 195, 15 + i * 195)
		this.graphics.lineTo((j + 1) * 195 - 15, (i + 1) * 195 - 15)
		this.graphics.moveTo((j + 1) * 195 - 15, 15 + i * 195)
		this.graphics.lineTo(15 + j * 195, (i + 1) * 195 - 15)
		this.graphics.closePath()
		this.graphics.strokePath()

	}

	drawO(i, j){
		this.graphics.lineStyle(5, 0xa6b401, 1)
		this.graphics.beginPath()

		const radius = 85
		
		// Draw O
		let centerX = (j * 195 + ( j + 1 ) * 195 ) / 2
		let centerY = (i * 195 + ( i + 1 ) * 195 ) / 2
		this.graphics.closePath()
		this.graphics.strokeCircle(centerX, centerY, radius)
	}
}
