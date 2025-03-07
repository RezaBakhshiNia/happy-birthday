window.mobileCheck = function () {
  let check = false
  ;(function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      check = true
  })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}

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
    let center = (this.width / 2) | 0
    this.spawnA = (center - center / 4) | 0
    this.spawnB = (center + center / 4) | 0

    this.height = canvas.height = window.innerHeight
    this.spawnC = this.height * 0.1
    this.spawnD = this.height * 0.5
  }

  onClick(evt) {
    let x = evt.clientX || (evt.touches && evt.touches[0].pageX)
    let y = evt.clientY || (evt.touches && evt.touches[0].pageY)

    let count = random(3, 5)
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
    for (let firework of this.fireworks) firework.update(delta)

    this.counter += delta * 3 // Create new firework every second
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

    // Clean up dead fireworks
    if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead)
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

    let xDiff = this.targetX - this.x
    let yDiff = this.targetY - this.y

    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      this.x += xDiff * 2 * delta
      this.y += yDiff * 2 * delta

      this.history.push({ x: this.x, y: this.y })
      if (this.history.length > 20) this.history.shift()
    } else {
      if (this.offsprings && !this.madeChilds) {
        let babies = this.offsprings / 2
        for (let i = 0; i < babies; i++) {
          let targetX = (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0
          let targetY = (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0

          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))
        }
      }

      this.madeChilds = true
      this.history.shift()
    }

    if (this.history.length === 0) this.dead = true
    else if (this.offsprings) {
      for (let i = 0; i < this.history.length; i++) {
        let point = this.history[i]
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
const maxConfettis = window?.mobileCheck() ? 25 : 50
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
  this.r = random(11, 33)
  this.d = Math.random() * maxConfettis + 11
  this.color = possibleColors[random(0, possibleColors.length - 1)]
  this.tilt = random(-10, 10)
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05
  this.tiltAngle = 0

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
window.onresize = () => birthday.resize()

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
  for (let particle of particles) {
    particle.draw()
    particle.tiltAngle += particle.tiltAngleIncremental
    particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2
    particle.tilt = Math.sin(particle.tiltAngle) * 15

    if (particle.y > H) {
      particle.x = Math.random() * W
      particle.y = -30
      particle.tilt = random(-20, 20)
    }
  }
})()
