// Setup canvas and context
const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const W = window.innerWidth
const H = window.innerHeight

// Helper functions
const PI2 = Math.PI * 2
const random = (min, max) => (Math.random() * (max - min + 1) + min) | 0
const timestamp = () => new Date().getTime()

// Fireworks Setup
class Birthday {
  constructor() {
    this.resize()
    this.fireworks = []
    this.counter = 0
    this.then = timestamp()
  }

  resize() {
    this.width = canvas.width = window.innerWidth
    const center = (this.width / 2) | 0
    this.spawnA = (center - center / 4) | 0
    this.spawnB = (center + center / 4) | 0

    this.height = canvas.height = window.innerHeight
    this.spawnC = this.height * 0.1
    this.spawnD = this.height * 0.5

    // Adjust firework frequency based on screen size
    this.fireworkFrequency = this.width < 480 ? 0.5 : 1
  }

  onClick(evt) {
    const x = evt.clientX || (evt.touches && evt.touches[0].pageX)
    const y = evt.clientY || (evt.touches && evt.touches[0].pageY)

    // Adjust number of fireworks based on screen size
    const count = this.width < 480 ? random(2, 3) : random(3, 5)

    for (let i = 0; i < count; i++)
      this.fireworks.push(
        new Firework(random(this.spawnA, this.spawnB), this.height, x, y, random(0, 260), random(30, 110)),
      )

    this.counter = -1
  }

  update(delta) {
    ctx.globalCompositeOperation = 'hard-light'
    ctx.fillStyle = `rgba(20,20,20,${7 * delta})`
    ctx.fillRect(0, 0, this.width, this.height)

    ctx.globalCompositeOperation = 'lighter'
    for (const firework of this.fireworks) firework.update(delta)

    // Adjust counter increment based on screen size
    this.counter += delta * 3 * this.fireworkFrequency

    if (this.counter >= 1) {
      this.fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          random(0, this.width),
          random(this.spawnC, this.spawnD),
          random(0, 360),
          random(30, 110),
        ),
      )
      this.counter = 0
    }

    // Clean up dead fireworks - more aggressive cleanup on mobile
    const maxFireworks = this.width < 480 ? 500 : 1000
    if (this.fireworks.length > maxFireworks)
      this.fireworks = this.fireworks.filter(firework => !firework.dead)
  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false
    this.offsprings = offsprings
    this.x = x
    this.y = y
    this.targetX = targetX
    this.targetY = targetY
    this.shade = shade
    this.history = []
  }

  update(delta) {
    if (this.dead) return

    const xDiff = this.targetX - this.x
    const yDiff = this.targetY - this.y

    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      this.x += xDiff * 2 * delta
      this.y += yDiff * 2 * delta

      this.history.push({ x: this.x, y: this.y })
      if (this.history.length > 20) this.history.shift()
    } else {
      if (this.offsprings && !this.madeChilds) {
        // Adjust number of offspring based on screen size
        const screenFactor = window.innerWidth < 480 ? 0.6 : 1
        const babies = Math.floor((this.offsprings / 2) * screenFactor)

        for (let i = 0; i < babies; i++) {
          const targetX = (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0
          const targetY = (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0

          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))
        }
      }

      this.madeChilds = true
      this.history.shift()
    }

    if (this.history.length === 0) this.dead = true
    else if (this.offsprings) {
      for (let i = 0; i < this.history.length; i++) {
        const point = this.history[i]
        ctx.beginPath()
        ctx.fillStyle = `hsl(${this.shade},100%,${i}%)`
        ctx.arc(point.x, point.y, 1, 0, PI2, false)
        ctx.fill()
      }
    } else {
      ctx.beginPath()
      ctx.fillStyle = `hsl(${this.shade},100%,50%)`
      ctx.arc(this.x, this.y, 1, 0, PI2, false)
      ctx.fill()
    }
  }
}

// Confetti Setup
const particles = []
// Adjust confetti amount based on screen size
const maxConfettis = window.innerWidth < 480 ? 30 : 50
const possibleColors = [
  'DodgerBlue',
  'OliveDrab',
  'Gold',
  'Pink',
  'SlateBlue',
  'LightBlue',
  'Violet',
  'PaleGreen',
  'SteelBlue',
  'SandyBrown',
  'Chocolate',
  'Crimson',
]

function confettiParticle() {
  this.x = Math.random() * W
  this.y = Math.random() * H - H
  // Adjust confetti size based on screen size
  const sizeFactor = window.innerWidth < 480 ? 0.7 : 1
  this.r = random(11, 33) * sizeFactor
  this.d = Math.random() * maxConfettis + 11
  this.color = possibleColors[random(0, possibleColors.length - 1)]
  this.tilt = random(-10, 10)
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05
  this.tiltAngle = 0
  // Add speed factor - slower on mobile
  this.speedFactor = window.innerWidth < 480 ? 0.3 : 1

  this.draw = function () {
    ctx.beginPath()
    ctx.lineWidth = this.r / 2
    ctx.strokeStyle = this.color
    ctx.moveTo(this.x + this.tilt + this.r / 3, this.y)
    ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5)
    ctx.stroke()
  }
}

// Push new confetti objects to `particles[]`
for (let i = 0; i < maxConfettis; i++) {
  particles.push(new confettiParticle())
}

// Unified Animation Loop
const birthday = new Birthday()

// Handle window resize properly
window.onresize = () => {
  birthday.resize()
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const W = window.innerWidth
  const H = window.innerHeight

  // Adjust confetti for new screen size
  particles.length = 0
  const newMaxConfettis = window.innerWidth < 480 ? 30 : 50
  for (let i = 0; i < newMaxConfettis; i++) {
    const particle = new confettiParticle()
    // Update speed factor based on new screen size
    particle.speedFactor = window.innerWidth < 480 ? 0.3 : 1
    particles.push(particle)
  }
}

document.onclick = evt => birthday.onClick(evt)
document.ontouchstart = evt => birthday.onClick(evt)
;(function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const now = timestamp()
  const delta = (now - birthday.then) / 1000
  birthday.then = now

  // Update fireworks
  birthday.update(delta)

  // Update confetti
  for (const particle of particles) {
    particle.draw()
    particle.tiltAngle += particle.tiltAngleIncremental
    // Apply speed factor to slow down confetti on mobile
    particle.y += ((Math.cos(particle.d) + 3 + particle.r / 2) / 2) * particle.speedFactor
    particle.tilt = Math.sin(particle.tiltAngle) * 15

    if (particle.y > H) {
      particle.x = Math.random() * W
      particle.y = -30
      particle.tilt = random(-20, 20)
    }
  }
})()
