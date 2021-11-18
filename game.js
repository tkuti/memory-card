const _board = document.querySelector(".board")

createCards()

const _cards = document.querySelectorAll('.card')


function createCards () {
    imagesOfDogs.forEach(img => {
        const card = document.createElement('div')
        card.classList.add('card')
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
    })
}

function flipCard() {
    this.classList.toggle('flip');
}

_cards.forEach(card => card.addEventListener('click', flipCard));