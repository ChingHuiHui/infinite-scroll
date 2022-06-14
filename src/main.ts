import './index.scss'

type ImgData = { id: number; title: string; src: string }

const container = document.querySelector('.list') as HTMLDivElement

const DB_SIZE: number = 200
const LIST_SIZE: number = 20
const NUMBER_PER_FETCH = LIST_SIZE / 2

const TOP_CHILD_ID = 'tile-0'
const BOTTOM_CHILD_ID = `tile-${LIST_SIZE - 1}`

let currentIndex = 0

let DB: ImgData[] = []

const getFirstIndex = ({ isScrollDown }: { isScrollDown: boolean }): number => {
  let firstIndex = isScrollDown
    ? currentIndex + NUMBER_PER_FETCH
    : currentIndex - NUMBER_PER_FETCH

  return firstIndex < 0 ? 0 : firstIndex
}

const fetchPrev = (): void => {
  if (currentIndex === 0) {
    container.style.paddingTop = '0px'

    return
  }

  currentIndex = getFirstIndex({ isScrollDown: false })
  adjustPaddings({ isScrollDown: false })
  renderList()
}

const fetchMore = (): void => {
  if (currentIndex === DB_SIZE - LIST_SIZE) {
    return
  }

  currentIndex = getFirstIndex({ isScrollDown: true })
  adjustPaddings({ isScrollDown: true })
  renderList()
}

const getNumFromStyle = (numStr: string): number => {
  return Number(numStr.substring(0, numStr.length - 2))
}

const adjustPaddings = ({ isScrollDown }: { isScrollDown: boolean }) => {
  const currentPaddingTop = getNumFromStyle(container.style.paddingTop)
  const currentPaddingBottom = getNumFromStyle(container.style.paddingBottom)

  const remPaddingsVal = 170 * NUMBER_PER_FETCH

  if (isScrollDown) {
    container.style.paddingTop = currentPaddingTop + remPaddingsVal + 'px'
    container.style.paddingBottom =
      currentPaddingBottom === 0
        ? '0px'
        : currentPaddingBottom - remPaddingsVal + 'px'
  } else {
    container.style.paddingBottom = currentPaddingBottom + remPaddingsVal + 'px'
    container.style.paddingTop =
      currentPaddingTop === 0
        ? '0px'
        : currentPaddingTop - remPaddingsVal + 'px'
  }
}

const renderList = (): void => {
  for (let i = 0; i < LIST_SIZE; i++) {
    const tileData = DB[i + currentIndex]

    const tile = document.querySelector('#tile-' + i) as HTMLLIElement

    ;(tile.firstElementChild as HTMLDivElement).innerText = tileData.title
    ;(tile.lastChild as HTMLDivElement).setAttribute('src', tileData.src)
  }
}

const getImage = (): string => {
  const IMAGE_URL = 'https://picsum.photos/400/300?random='

  return IMAGE_URL + Math.floor(Math.random() * 100000)
}

const initDB = (): ImgData[] => {
  const db = []

  for (let i = 0; i < DB_SIZE; i++) {
    db.push({
      id: i,
      title: `Image Number ${i + 1}`,
      src: getImage(),
    })
  }

  return db
}

const initImagesDOM = (): void => {
  for (let i = 0; i < LIST_SIZE; i++) {
    const tile = document.createElement('li')
    tile.setAttribute('class', 'tile')
    tile.setAttribute('id', 'tile-' + i)

    const title = document.createElement('H3')
    title.innerText = DB[i].title

    tile.appendChild(title)

    const img = document.createElement('img')
    img.setAttribute('src', DB[i].src)
    tile.appendChild(img)

    container.appendChild(tile)
  }
}

const initIntersectionObserver = () => {
  const callback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const isTopChild = entry.target.id === TOP_CHILD_ID
      const isBottomChild = entry.target.id === BOTTOM_CHILD_ID

      if (!entry.isIntersecting) return

      if (isTopChild) {
        console.log('fetchPrev')
        fetchPrev()
      } else if (isBottomChild) {
        console.log('fetchMore')
        fetchMore()
      }
    })
  }

  const observer = new IntersectionObserver(callback, {})

  const firstChild = document.querySelector(`#${TOP_CHILD_ID}`) as HTMLLIElement
  const lastChild = document.querySelector(
    `#${BOTTOM_CHILD_ID}`
  ) as HTMLLIElement

  observer.observe(firstChild)
  observer.observe(lastChild)
}

const start = () => {
  DB = initDB()
  initImagesDOM()
  initIntersectionObserver()
}

start()

export default {}
