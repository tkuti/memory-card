const _wrapper = document.querySelector('.game-wrapper')
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
const _resultsBtns = document.querySelectorAll('.results-btn')
const _resultsCloseBtns = document.querySelectorAll('.results-close-btn')
const _resultsContainer = document.querySelector('.results-container')
const _resultTypeBtns = document.querySelectorAll('.result-type-btn')

let levelClass = 'demo'
let screenType = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
let numberOfFlippedCards
let numberOfRemainingPairs
let timer
let finalTime
let images
let hasFlippedCard = false
let lockBoard = false
let firstCard, secondCard
let results

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

window.addEventListener('resize', () => {
    _wrapper.classList.remove(screenType)
    _board.classList.remove(screenType)
    window.innerWidth > window.innerHeight ? screenType = 'landscape' : screenType = 'portrait'
    setLevel(levelClass)
}) 

_resultsBtns.forEach(btn => btn.addEventListener('click', () => {
    _resultsContainer.style.display = 'flex'
    _resultTypeBtns.forEach(bt => {
        if (bt.innerHTML !== "Demo") {
            bt.classList.remove('active')
        } else {
            bt.classList.add("active")
        }
    })
    generateResultTable('demo')
}))


_resultTypeBtns.forEach(btn => btn.addEventListener('click', (e) => {
    _resultTypeBtns.forEach(bt => {
        bt.classList.remove('active')
    })
    e.target.classList.add('active')
    generateResultTable(e.target.innerHTML.toLowerCase())
}))

_resultsCloseBtns.forEach(btn => btn.addEventListener('click', () => {
    _resultsContainer.style.display = 'none'
}))


const savedResults = localStorage.getItem('results') 
savedResults ? results = JSON.parse(savedResults) : results = []


function setLevel(level) {
    resetGame()
    switch (level) {
        case 'demo':
            numberOfRemainingPairs = 3
            images = imagesOfDogs.slice(0, 6)
            break
        case 'easy':
            numberOfRemainingPairs = 10
            images = imagesOfDogs.slice(0, 20)
            break
        case 'medium':
            numberOfRemainingPairs = 15
            images = imagesOfDogs.slice(0, 30)
            break
        case 'hard':
            numberOfRemainingPairs = 21
            images = [...imagesOfDogs]
            break
    }
    levelClass = level
    _remainingPairs.innerHTML = numberOfRemainingPairs
    generateCards()
}

function generateCards() {
    _board.classList.add(levelClass)
    _board.classList.add(screenType)
    _wrapper.classList.add(screenType)
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
    _board.classList.remove(levelClass)
    resetBoard()
    stopTime()
}

function startTime() {
    let seconds = 0
    let minutes = '00'
    timer = setInterval(() => {
        seconds++
        if (seconds < 10) {
            seconds = "0" + seconds
        }
        if (seconds > 59) {
            minutes++
            seconds = "00"
            if (minutes < 10) {
                minutes = "0" + minutes
            }
        }
        let clockFace = minutes + ":" + seconds
        _time.innerHTML = clockFace
    }, 1000)
}

function stopTime() {
    clearInterval(timer)
    finalTime = _time.innerHTML
    _time.innerHTML = '00:00'
}

function gameOver() {
    stopTime()
    let _resultLevel = document.querySelector("#result-level")
    let _resultTime = document.querySelector("#result-time")
    let _resultFlips = document.querySelector("#result-flips")
    let _resultName = document.querySelector("#result-name")
    _gameOverContainer.style.display = "flex"
    _resultTime.innerHTML = finalTime
    _resultFlips.innerHTML = _flippedCards.innerHTML
    if ( !username ) username = "Stranger"
    _resultName.innerHTML = username
    _resultLevel.innerHTML = _levelSelect.value
    saveResult()
}

function saveResult () {
    const newResult = {
        name: username,
        time: finalTime,
        flips: _flippedCards.innerHTML,
        level: _levelSelect.value
    }
    results.push(newResult)
    localStorage.setItem('results', JSON.stringify(results))
}

function sortResults (filteredResults) {
    filteredResults.sort((a, b) => {
        if (a.time < b.time) {
            return -1
        } else if (a.time > b.time) {
            return 1
        } else {
            return a.flips - b.flips
        }
    })
}

function generateResultTable (level) {
    const filteredResults = results.filter(res => res.level === level)
    sortResults(filteredResults)
    const _resultTableBody = document.querySelector('tbody')
    _resultTableBody.innerHTML = ""
    if (filteredResults.length > 0) {
        filteredResults.forEach((result, index) => {
            const row = document.createElement('tr')
            const nrTd = document.createElement('td')
            nrTd.innerHTML = index + 1
            const nameTd = document.createElement('td')
            nameTd.innerHTML = result.name
            const timeTd = document.createElement('td')
            timeTd.innerHTML = result.time
            const flipsTd = document.createElement('td')
            flipsTd.innerHTML = result.flips
            const levelTd = document.createElement('td')
            levelTd.innerHTML = result.level
            row.appendChild(nrTd)
            row.appendChild(nameTd)
            row.appendChild(timeTd)
            row.appendChild(flipsTd)
            row.appendChild(levelTd)
            _resultTableBody.appendChild(row)
        })
    }
}