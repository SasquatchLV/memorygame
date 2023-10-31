import "@picocss/pico/css/pico.min.css"
import "./styles.css"
import _ from "lodash"

const startGameButtonEl =
  document.querySelector<HTMLButtonElement>(".start-button")
const matchedCardsEl = document.querySelector<HTMLDivElement>(".matched-cards")
const cardContainerEl =
  document.querySelector<HTMLDivElement>(".card-container")
const moveCountEl = document.querySelector<HTMLDivElement>(".move-count")

const restartButton = document.querySelector<HTMLButtonElement>("#restart")

interface ICardElement extends HTMLDivElement {
  cardValue: string
}

const startGame = () => {
  let currentlySelectedCards: ICardElement[] = []
  let matchedCards: ICardElement[] = []
  let time = 0
  let moveCount = 0
  cardContainerEl!.innerHTML = ""

  const cards: string[] = [
    "apple",
    "apple",
    "orange",
    "orange",
    "banana",
    "banana",
    // "grape",
    // "grape",
    // "pear",
    // "pear",
    // "pineapple",
    // "pineapple",
  ]

  const updateMatchedCardsElement = () => {
    matchedCardsEl!.innerText = `${matchedCards.length / 2}/${cards.length / 2}`
  }

  updateMatchedCardsElement()

  const timerInterval = setInterval(() => {
    time += 1
    const date = new Date(time * 1000)
    const localeTime = date.toLocaleTimeString("lv-LV", {
      minute: "2-digit",
      second: "2-digit",
    })
    document.querySelector<HTMLDivElement>(".timer")!.innerText = localeTime
  }, 1000)

  const checkWinner = () => {
    if (matchedCards.length === cards.length) {
      clearInterval(timerInterval)

      // Clear the board
      cardContainerEl!.innerHTML = ""
      startGameButtonEl!.style.display = "block"

      const minutes = Math.floor(time / 60)
      const seconds = time % 60
      let timeString = "It took "
      if (minutes > 0) {
        timeString += `${minutes} minute`
        if (minutes !== 1) {
          timeString += "s"
        }
        timeString += " and "
      }
      timeString += `${seconds} second`
      if (seconds !== 1) {
        timeString += "s"
      }
      timeString += ` to complete the task, and ${moveCount} moves! Press this button to play again.`

      startGameButtonEl!.innerText = timeString
    }
  }

  const shuffledCards = _.shuffle(cards)
  // const shuffledCards = cards.sort(() => 0.5 - Math.random())

  const flipCard = (cardElement: ICardElement) => {
    // Check if the card is already flipped
    if (cardElement.classList.contains("card--front")) {
      return
    }
    cardElement.classList.remove("card--back")
    cardElement.classList.add("card--front")
    cardElement.innerText = cardElement.cardValue
    currentlySelectedCards.push(cardElement)
    moveCountEl!.innerText = `Moves: ${++moveCount}`
    if (currentlySelectedCards.length === 2) {
      const [firstCard, secondCard] = currentlySelectedCards
      if (firstCard.cardValue === secondCard.cardValue) {
        firstCard.classList.add("card--match")
        secondCard.classList.add("card--match")
        matchedCards.push(firstCard, secondCard)
        currentlySelectedCards = []
        updateMatchedCardsElement()
        checkWinner()
      } else {
        currentlySelectedCards = []
        setTimeout(() => {
          firstCard.classList.remove("card--front")
          firstCard.classList.add("card--back")
          firstCard.innerText = ""
          secondCard.classList.remove("card--front")
          secondCard.classList.add("card--back")
          secondCard.innerText = ""
        }, 1000)
      }
    }
  }

  if (startGameButtonEl !== null && cardContainerEl !== null) {
    startGameButtonEl.style.display = "none"
    moveCountEl!.innerText = `Moves: ${moveCount}`

    shuffledCards.forEach((card) => {
      const cardElement = document.createElement("div") as ICardElement
      cardElement.classList.add("card", "card--back")
      cardElement.cardValue = card
      cardContainerEl.appendChild(cardElement)

      // add a click event listener to the card
      cardElement.addEventListener("click", () => {
        flipCard(cardElement)
      })
    })

    restartButton!.style.display = "block"
    restartButton!.addEventListener("click", () => {
      clearInterval(timerInterval)
      document.querySelector<HTMLDivElement>(".timer")!.innerText = "00:00"
      startGame()
    })
  }
}

startGameButtonEl!.addEventListener("click", () => {
  startGame()
})
