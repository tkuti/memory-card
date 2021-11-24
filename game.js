const _welcomeContainer = document.querySelector('#welcome-container')
const _startBtn = document.querySelector('#start-btn')
const _usernameInput = document.querySelector('#username')
let username;
const _board = document.querySelector(".board")
const _levelSelect = document.querySelector("#level")
const _flippedCards = document.querySelector("#flipped-cards")
const _remainingPairs = document.querySelector("#remaining-pairs")
const _time = document.querySelector("#time")
const _gameOverContainer = document.querySelector('#game-over-container')
const _newGameBtn = document.querySelector('#new-game-btn')

let numberOfFlippedCards
let numberOfRemainingPairs
let timer
let images
let hasFlippedCard = false
let lockBoard = false
let firstCard, secondCard

_startBtn.addEventListener('click', () => {
    _welcomeContainer.style.display = 'none'
    username = _usernameInput.value
    setLevel('demo')
})

_newGameBtn.addEventListener('click', () => {
    _gameOverContainer.style.display = 'none'
    setLevel(_levelSelect.value)
})

_levelSelect.addEventListener('change', (e) => {
    setLevel(e.target.value)
})

function setLevel(level) {
    resetGame()
    switch (level) {
        case 'demo':
            numberOfRemainingPairs = 3
            images = imagesOfDogs.slice(0, 6)
            break
        case 'easy':
            numberOfRemainingPairs = 9
            images = imagesOfDogs.slice(0, 18)
            break
        case 'medium':
            numberOfRemainingPairs = 14
            images = imagesOfDogs.slice(0, 28)
            break
        case 'hard':
            numberOfRemainingPairs = 20
            images = [...imagesOfDogs]
            break
    }
    _remainingPairs.innerHTML = numberOfRemainingPairs
    generateCards()
}

function generateCards() {
    images.forEach(img => createCard(img))
    const _cards = document.querySelectorAll('.card')
    _cards.forEach(card => card.addEventListener('click', flipCard))
}

function createCard(img) {
    const card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('data-name', img.name)
    const frontFace = document.createElement('img')
    frontFace.setAttribute('src', img.src)
    frontFace.setAttribute('alt', img.name)
    frontFace.classList.add('front-face')
    const backFace = document.createElement('img')
    backFace.setAttribute('src', './images/cover.jpg')
    backFace.setAttribute('alt', 'cover')
    backFace.classList.add('back-face')
    _board.appendChild(card)
    card.appendChild(frontFace)
    card.appendChild(backFace)
}

function flipCard() {
    if (lockBoard || this === firstCard) return
    this.classList.add('flip')
    numberOfFlippedCards++
    _flippedCards.innerHTML = numberOfFlippedCards
    numberOfFlippedCards === 1 && startTime()

    if (!hasFlippedCard) {
        hasFlippedCard = true
        firstCard = this
        return
    }

    secondCard = this

    firstCard.dataset.name === secondCard.dataset.name
        ? disableCards()
        : unflipCards()
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard)
    secondCard.removeEventListener('click', flipCard)
    numberOfRemainingPairs--
    _remainingPairs.innerHTML = numberOfRemainingPairs
    resetBoard()
    numberOfRemainingPairs === 0 && gameOver()
}

function unflipCards() {
    lockBoard = true
    setTimeout(() => {
        firstCard.classList.remove('flip')
        secondCard.classList.remove('flip')
        resetBoard()
    }, 1500)
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]
    [firstCard, secondCard] = [null, null]
}

function resetGame() {
    numberOfFlippedCards = 0
    _flippedCards.innerHTML = numberOfFlippedCards
    _board.innerHTML = ""
    resetBoard()
    stopTime()
}

function startTime() {
    let seconds = 0
    let minutes = 0
    timer = setInterval(() => {
        seconds++
        if (seconds < 10) {
            seconds = "0" + seconds
        }
        if (seconds > 59) {
            minutes++
            seconds = "00"
        }
        let clockFace = minutes + ":" + seconds
        _time.innerHTML = clockFace
    }, 1000)
}

function stopTime() {
    clearInterval(timer)
    _time.innerHTML = '0:00'
}

function gameOver() {
    let _resultLevel = document.querySelector("#result-level")
    let _resultTime = document.querySelector("#result-time")
    let _resultFlips = document.querySelector("#result-flips")
    let _resultName = document.querySelector("#result-name")
    _gameOverContainer.style.display = "flex"
    _resultTime.innerHTML = _time.innerHTML
    _resultFlips.innerHTML = _flippedCards.innerHTML
    username != ""
        ? _resultName.innerHTML = username
        : _resultName.innerHTML = "Stranger"
    _resultLevel.innerHTML = _levelSelect.value
    stopTime();
}