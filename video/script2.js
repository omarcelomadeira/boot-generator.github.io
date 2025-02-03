const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const video = document.createElement('video')
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let videoX = 0
let videoY = 0
let scale = 1
let isProcessing = false
let frameCount = 0

const resolutions = [
    { width: 1280, height: 720, label: "9 inches Horizontal", id: "canvas-9-inches" },
    { width: 762, height: 1024, label: "9.7 inches Vertical", id: "canvas-9-7-inches" }
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

    document.getElementById('videoInput').addEventListener('change', handleVideoUpload)
    document.getElementById('scaleSlider').addEventListener('input', handleScale)
    document.getElementById('resolutionSelect').addEventListener('change', handleResolutionChange)
    document.getElementById('generateBtn').addEventListener('click', generateBootAnimation)
}

function startDragging(e) {
    if (!video.src) return
    isDragging = true
    dragStartX = e.clientX - videoX
    dragStartY = e.clientY - videoY
}

function drag(e) {
    if (!isDragging) return
    videoX = e.clientX - dragStartX
    videoY = e.clientY - dragStartY
    drawVideoFrame()
}

function stopDragging() {
    isDragging = false
}

function handleVideoUpload(e) {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('video/')) return

    video.src = URL.createObjectURL(file)
    video.onloadedmetadata = () => {
        videoX = (canvas.width - video.videoWidth) / 2
        videoY = (canvas.height - video.videoHeight) / 2
        video.play()
        video.requestVideoFrameCallback(drawVideoFrame)
    }
}

function handleScale(e) {
    scale = parseFloat(e.target.value)
    drawVideoFrame()
}

function handleResolutionChange(e) {
    const resolution = resolutions[e.target.value]
    canvas.width = resolution.width
    canvas.height = resolution.height
    drawVideoFrame()
}

function drawVideoFrame() {
    if (!video.src) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const scaledWidth = video.videoWidth * scale
    const scaledHeight = video.videoHeight * scale

    ctx.drawImage(video, videoX, videoY, scaledWidth, scaledHeight)

    if (!isProcessing) {
        video.requestVideoFrameCallback(drawVideoFrame)
    }
}

async function generateBootAnimation() {
    if (!video.src || isProcessing) return
    isProcessing = true
    frameCount = 0

    const zip = new JSZip()
    const part0 = zip.folder('part0')

    video.currentTime = 0
    video.playbackRate = 1

    const frames = []
    const fps = 20
    const interval = 1000 / fps
    let currentTime = 0

    while (currentTime < video.duration) {
        video.currentTime = currentTime
        await new Promise(resolve => video.onseeked = resolve)

        drawVideoFrame()
        const frame = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png')
        })

        const paddedIndex = String(frameCount + 1).padStart(4, '0')
        frames.push({ blob: frame, name: `frame_${paddedIndex}.png` })
        frameCount++
        currentTime += interval / 1000
    }

    frames.forEach(frame => {
        part0.file(frame.name, frame.blob)
    })

    const descContent = `${canvas.width} ${canvas.height} 20\np 1 0 part0`
    zip.file('desc.txt', descContent)

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'bootanimation.zip'
    link.click()

    isProcessing = false
    video.currentTime = 0
    drawVideoFrame()
}

initializeCanvas()
