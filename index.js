const readline = require('readline')

// Combinations of horizontal, vertical, or diagonal rows that would designate the winner
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const ticTacToe = new FunkyTicTacToe()
ticTacToe.intitializeGrid()

// By default the first player to play is the computer
ticTacToe.computerPlaysFirst()
ticTacToe.turn()

function FunkyTicTacToe() {
  this.grid = []
  this.playersMark = 'X'
  this.computersMark = 'O'

  this.intitializeGrid = () => {
    for (let i = 0; i < 9; i++) {
      this.grid.push(i)
    }
  }

  this.printGrid = () => {
    for (let i = 0; i < 7; i += 3) {
      console.log(this.grid.slice(i, i + 3))
    }
  }

  this.prompt = () => {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return new Promise(resolve => {
      rl.question(
        'Enter the number of the square you would like to mark\n',
        resolve,
      )
    }).then(input => {
      // Only allow available squares and limit input to the grid
      if (this.checkIfInputIsValid(input)) {
        this.grid[input] = this.playersMark
        rl.close(rl)
      } else {
        console.log('Incorrect input. Try again.')
        return this.prompt()
      }
    })
  }

  this.checkIfInputIsValid = input => {
    return (
      this.grid[input] !== undefined &&
      this.grid[input] !== this.playersMark &&
      this.grid[input] !== this.computersMark
    )
  }

  this.turn = () => {
    this.printGrid()
    return this.prompt().then(_ => {
      let status = this.checkGame()
      if (status.tie || status.winner) {
        console.log('Game over. Thank you for playing.')
      } else {
        ticTacToe.computerPlays()
        status = this.checkGame()
        if (!status.tie && !status.winner) {
          ticTacToe.turn()
        }
      }
    })
  }

  this.checkGame = () => {
    let status = {
      winner: null,
      tie: null,
    }
    if (this.checkIfPlayerWon(this.playersMark)) {
      status.winner = this.playersMark
      this.showGameOver('Game is WON by PLAYER')
    }

    if (this.checkIfPlayerWon(this.computersMark)) {
      status.winner = this.computersMark
      this.showGameOver('Game is WON by COMPUTER')
    }

    if (!status.winner && this.checkIfTie()) {
      status.tie = true
      this.showGameOver('Game is TIE')
    }
    return status
  }

  this.checkIfPlayerWon = player => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      let won = true
      for (let j = 0; j < WINNING_COMBINATIONS[i].length; j++) {
        let id = WINNING_COMBINATIONS[i][j]
        won = this.grid[id] === player && won
      }
      if (won) {
        return true
      }
    }
    return false
  }

  this.checkIfTie = () => {
    // Type checking since Numbers are replaced with Strings as we evolve into the game
    const isAString = currentValue => typeof currentValue === 'string'
    return this.grid.every(isAString)
  }

  this.showGameOver = text => {
    console.log('######################################')
    console.log(text)
    console.log('######################################')
    this.printGrid()
  }

  this.computerPlaysFirst = () => {
    // We are always starting with the center as this is the recommended strategy
    this.grid[4] = this.computersMark
  }

  this.computerPlays = () => {
    const strategicalMove = this.detectDangerousLine()

    if (strategicalMove.length > 0) {
      // The goal here is to Win or Draw. We are preventing loss using the first best choice
      // Note: An improvement here could be to look for number repetition and prioritize those
      this.playFirstAvailableSquare(strategicalMove[0])
    } else {
      this.playFirstAvailableSquare(this.grid)
    }
  }

  this.detectDangerousLine = () => {
    let strategicalMove = []
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      let dangerous = true
      for (let j = 0; j < WINNING_COMBINATIONS[i].length; j++) {
        let id = WINNING_COMBINATIONS[i][j]
        if (this.grid[id] === this.computersMark) {
          dangerous = false
        }
        dangerous =
          (this.grid[id] === this.playersMark ||
            typeof this.grid[id] === 'number') &&
          dangerous
      }
      if (dangerous) {
        strategicalMove.push(WINNING_COMBINATIONS[i])
      }
    }
    return strategicalMove
  }

  this.playFirstAvailableSquare = availableChoices => {
    for (let i = 0; i < availableChoices.length; i++) {
      if (typeof this.grid[availableChoices[i]] === 'number') {
        console.log('Computer plays ' + this.grid[availableChoices[i]] + '...')
        this.grid[availableChoices[i]] = this.computersMark
        return
      }
    }
  }
}
