import './index.scss'

const gallery = document.querySelector<HTMLDivElement>('#gallery')!
const bottomDiv = document.querySelector('.bottom') as HTMLDivElement

const IMAGE_URL: string = `https://picsum.photos/400/300?random=`

const getImage = (): string => {
  const randomNumber = Math.floor(Math.random() * 100000)

  return IMAGE_URL + randomNumber
}

let imageData: string[]

const init = () => {
  imageData = Array.from({ length: 5 }, () => getImage())

  gallery.innerHTML = `${imageData
    .map((image) => `<img class="image" src="${image}" />`)
    .join('')}
`
}

const buildImageElement = () => {
  const img = document.createElement('img')
  img.className = 'image'
  img.src = getImage()

  return img
}

function getCurrentImageSize(): number {
  return document.querySelectorAll('.image').length
}

const options = {
  rootMargin: '10px 0px 0px 0px', // top right bottom left
  threshold: 0.8, // 只想在可見度達一個比例時觸發
}

const callback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => {
  entries.forEach((entry) => {
    // 當此圖片進入 viewport 時才載入圖片
    if (!entry.isIntersecting) return

    // load the new image
    for (let i = 0; i < 5; i++) {
      gallery.appendChild(buildImageElement())
    }

    // stop to observe
    if (getCurrentImageSize() >= 100) {
      observer.unobserve(entry.target)
    }
  })
}

init()

let observer = new IntersectionObserver(callback, options)
observer.observe(bottomDiv)
