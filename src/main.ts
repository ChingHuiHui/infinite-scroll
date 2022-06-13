import './index.scss'

const gallery = document.querySelector<HTMLDivElement>('#gallery')!
const target = document.querySelector('.loading') as HTMLDivElement

const IMAGE_URL: string = `https://picsum.photos/400/300?random=`

const getImage = (): string => {
  const randomNumber = Math.floor(Math.random() * 100000)

  return IMAGE_URL + randomNumber
}

const buildImageElement = () => {
  const img = document.createElement('img')
  img.className = 'image'
  img.src = getImage()

  return `<img src="${getImage()}" class="image">`
}

function getCurrentImageSize(): number {
  return document.querySelectorAll('.image').length
}

const options = {
  rootMargin: '10px 0px 0px 0px', // top right bottom left
  threshold: 1, // 只想在可見度達一個比例時觸發
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
      gallery.innerHTML += buildImageElement()
    }

    // stop to observe
    if (getCurrentImageSize() >= 100) {
      observer.unobserve(entry.target)
      target.remove()
    }
  })
}

let observer = new IntersectionObserver(callback, options)
observer.observe(target)
