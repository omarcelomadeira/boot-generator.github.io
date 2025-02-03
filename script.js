const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
let currentImage = null
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let imageX = 0
let imageY = 0
let scale = 1

const resolutions = [
  { width: 1280, height: 720, label: "1280x720 (Landscape)" },
  { width: 720, height: 1280, label: "720x1280 (Portrait)" },
  { width: 1920, height: 1080, label: "1920x1080 (Full HD)" },
  { width: 1080, height: 1920, label: "1080x1920 (Full HD Portrait)" }
]

function initializeCanvas() {
  const defaultResolution = resolutions[0]
  canvas.width = defaultResolution.width
  canvas.height = defaultResolution.height
  document.getElementById('canvas-container').appendChild(canvas)
  setupEventListeners()
}

function setupEventListeners() {
  canvas.addEventListener('mousedown', startDragging)
  canvas.addEventListener('mousemove', drag)
  canvas.addEventListener('mouseup', stopDragging)
  canvas.addEventListener('mouseleave', stopDragging)
  
  document.getElementById('imageInput').addEventListener('change', handleImageUpload)
  document.getElementById('scaleSlider').addEventListener('input', handleScale)
  document.getElementById('resolutionSelect').addEventListener('change', handleResolutionChange)
  document.getElementById('bgColorInput').addEventListener('input', redraw)
  document.getElementById('generateBtn').addEventListener('click', generateImage)
}

function startDragging(e) {
  if (!currentImage) return
  isDragging = true
  dragStartX = e.clientX - imageX
  dragStartY = e.clientY - imageY
}

function drag(e) {
  if (!isDragging) return
  imageX = e.clientX - dragStartX
  imageY = e.clientY - dragStartY
  redraw()
}

function stopDragging() {
  isDragging = false
}

function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file || !file.type.startsWith('image/')) return
  
  const reader = new FileReader()
  reader.onload = (event) => {
    const img = new Image()
    img.onload = () => {
      currentImage = img
      imageX = (canvas.width - img.width) / 2
      imageY = (canvas.height - img.height) / 2
      redraw()
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(file)
}

function handleScale(e) {
  scale = parseFloat(e.target.value)
  redraw()
}

function handleResolutionChange(e) {
  const resolution = resolutions[e.target.value]
  canvas.width = resolution.width
  canvas.height = resolution.height
  redraw()
}

function redraw() {
  const bgColor = document.getElementById('bgColorInput').value
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  if (currentImage) {
    const scaledWidth = currentImage.width * scale
    const scaledHeight = currentImage.height * scale
    ctx.drawImage(currentImage, imageX, imageY, scaledWidth, scaledHeight)
  }
}

function generateImage() {
  if (!currentImage) return
  
  const link = document.createElement('a')
  link.download = 'mylogo.bmp'
  link.href = canvas.toDataURL('image/bmp')
  link.click()
}

initializeCanvas()
