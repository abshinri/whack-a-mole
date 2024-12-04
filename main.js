const cursor = document.querySelector('.cursor')
const holes = [...document.querySelectorAll('.hole')]
const scoreEl1 = document.querySelector('.score #score1')
const scoreEl2 = document.querySelector('.score #score2')
const btnEl = document.querySelector('.button')
const modelEl = document.querySelector('#modal')
// 当前正在显示的地鼠组
let currentMoles = []
// pokemon类型
const pokemons = [
    { name: 'diglett', score: 10 },
    { name: 'diglett', score: 10 },
    { name: 'diglett', score: 10 },
    { name: 'diglett', score: 10 },
    { name: 'diglett', score: 10 },
    { name: 'pikachu', score: -10 },
    { name: 'pikachu', score: -10 },
    { name: 'pikachu', score: -10 },
    { name: 'lycanroc', score: -30 },
]
let score = 0
let gameState = 'end'
let gameRoundTimer = null
const playtime = 30

let currentTime = playtime
const sound = new Audio("assets/smash.mp3")

btnEl.addEventListener('click', () => {
    if (gameState === 'end') {
        gameState = 'start'
        modelEl.style.display = 'none'
        reset()
        const interval = setInterval(() => {
            currentTime--
            if (currentTime <= 0) {
                currentTime = 0
                clearInterval(interval)
                gameState = 'end'
                btnEl.textContent = '开始游戏'
                end()
            }
            document.querySelector('.time span').textContent = currentTime
        }, 1000)
    }
})
const updateScore = () => {
    scoreEl1.textContent = score
    scoreEl2.textContent = score
}
function run() {
    if (gameState === 'end') {
        return
    }
    btnEl.style.display = 'none'
    const i = Math.floor(Math.random() * holes.length)
    // 如果currentMoles的长度大于6，就等一秒再执行
    if (currentMoles.length > 6) {
        setTimeout(() => {
            run()
        }, 1000)
        return
    }
    // 如过i已经在currentMoles中，就重新生成i
    if (currentMoles.includes(i)) {
        return run()
    }

    currentMoles.push(i)
    const hole = holes[i]
    let timer = null

    const img = document.createElement('img')

    img.dataset.state = 'normal'

    // 随机分配一个宝可梦类型
    const pokemon = pokemons[Math.floor(Math.random() * pokemons.length)]

    img.dataset.pokemon = pokemon.name
    img.dataset.score = pokemon.score

    img.classList.add('mole')
    img.src = `assets/${img.dataset.pokemon}.png`
    const animationDuration = Math.random() * 3 + 0.5
    img.style.animationDuration = animationDuration + 's'

    img.addEventListener('click', () => {
        if (img.dataset.state === 'whacked') {
            return
        }
        img.dataset.state = 'whacked'
        score += parseInt(img.dataset.score)
        if (score < 0) {
            score = 0
        }
        sound.play()
        updateScore()
        console.log(score)
        img.src = `assets/${img.dataset.pokemon}-whacked.png`
        clearTimeout(timer)
        img.style.animationName = 'fall'
        img.style.animationDuration = '0.5s'

        setTimeout(() => {
            removeMoles(hole, img, i)
            run()
        }, 500)
    })

    hole.appendChild(img)
    // 没有点击的情况下，地鼠会自动消失
    timer = setTimeout(() => {
        //添加一个fall动画
        img.style.animationName = 'fall'
        img.style.animationDuration = '0.5s'
        setTimeout(() => {
            removeMoles(hole, img, i)
        }, 100)
    }, animationDuration * 1000 + 250)
    setTimeout(() => {
        run()
    }, Math.random() * 1000 + 500)
}
function end() {
    updateScore()
    modelEl.style.display = 'block'
    setTimeout(() => {
        btnEl.textContent = '重新开始'
        btnEl.style.display = 'block'
    }, 3000)
}
function reset() {
    score = 0
    currentTime = 30
    document.querySelector('.time span').textContent = currentTime
    updateScore()
    currentMoles.forEach((i) => {
        const hole = holes[i]
        const img = hole.querySelector('img')
        removeMoles(hole, img, i)
    })
    currentMoles = []
    run()
}
const removeMoles = (hole, img, i) => {
    if (hole) {
        hole.removeChild(img)
        currentMoles = currentMoles.filter(n => n !== i)
    }
}
run()

// window.addEventListener('touchstart ', () => {
//     // cursor.classList.add('active')
// })
// window.addEventListener('mousedown', () => {
//     // cursor.classList.add('active')
// })
// window.addEventListener('mouseup', () => {
//     // cursor.classList.remove('active')
// })
// window.addEventListener('mouseup', () => {
//     // cursor.classList.remove('touchend')
// })