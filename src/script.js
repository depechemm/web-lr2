const timeZones = {
    msk: {
        offset: 3,
        name: 'MOSCOW',
    },
    london: {
        offset: 0,
        name: 'LONDON',
    },
    tokyo: {
        offset: 9,
        name: 'TOKYO',
    },
    newyork: {
        offset: -5,
        name: 'NEW YORK',
    },
    beijing: {
        offset: 8,
        name: 'BEIJING',
    },
};

function getTimeOfDay(now) {
    const hour = now.getHours();
    if (hour >= 6 && hour < 12) {
        return 'morning'
    } else if (hour >= 12 && hour < 18) {
        return 'afternoon'
    } else if (hour >= 18 && hour < 21) {
        return 'evening'
    } else {
        return 'night'
    }
}

function getDateByTimeZone(timezone) {
    const time = new Date()
    const utc = time.getTime() + (time.getTimezoneOffset() * 60000)
    const now = new Date(utc + (3600000 * timeZones[timezone].offset))
    return now
}

function getSecondColor(now) {
    if (getTimeOfDay(now) == 'morning') {
        return 'rgb(160,163,222)'
    } else if (getTimeOfDay(now) == 'afternoon') {
        return 'rgb(57, 165, 238)'
    } else if (getTimeOfDay(now) == 'evening') {
        return 'rgb(147, 75, 113)'
    } else {
        return 'rgb(80, 75, 155)'
    }
}

function updateClock(canvas, timezone) {
    const now = getDateByTimeZone(timezone)
    const ctx = canvas.getContext('2d')
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    const clockRadius = canvas.width / 2
    const clockX = canvas.width / 2
    const clockY = canvas.height / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.beginPath()
    ctx.arc(clockX, clockY, clockRadius, 0, 2 * Math.PI)
    ctx.fillStyle = 'rgb(244, 244, 244)'
    ctx.fill()

    let secondColor = getSecondColor(now)
    const mainColor = "rgb(42,53,44)"

    for (let number = 1; number <= 12; number++) {
        if (number % 3 === 0) {
            ctx.font = "bold 25px 'Poppins'"
            ctx.fillStyle = secondColor
        } else {
            ctx.font = "bold 20px 'Poppins'"
            ctx.fillStyle = mainColor
        }

        ctx.save();
        ctx.textBaseline = "middle"
        ctx.textAlign = "center"
        const angle = number * Math.PI / 6

        ctx.translate(clockX, clockY)
        ctx.rotate(angle)
        ctx.translate(0, -clockRadius * 0.90)
        ctx.rotate(-angle)
        ctx.fillText("•", 0, 0)

        ctx.rotate(angle)
        ctx.translate(0, clockRadius * 0.15)
        ctx.rotate(-angle)
        ctx.fillText(number.toString(), 0, 0)

        ctx.restore()
    }

    const hourAngle = ((hours % 12) + minutes / 60) * (Math.PI / 6)
    ctx.strokeStyle = mainColor
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(clockX, clockY)
    ctx.lineTo(clockX + clockRadius * 0.5 * Math.cos(hourAngle - Math.PI / 2),
        clockY + clockRadius * 0.5 * Math.sin(hourAngle - Math.PI / 2))
    ctx.stroke()

    const minuteAngle = (minutes + seconds / 60) * (Math.PI / 30)
    ctx.strokeStyle = mainColor
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(clockX, clockY)
    ctx.lineTo(clockX + clockRadius * 0.65 * Math.cos(minuteAngle - Math.PI / 2),
        clockY + clockRadius * 0.65 * Math.sin(minuteAngle - Math.PI / 2))
    ctx.stroke()

    const secondAngle = seconds * (Math.PI / 30)
    ctx.strokeStyle = secondColor
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(clockX, clockY)
    ctx.lineTo(clockX + clockRadius * 0.8 * Math.cos(secondAngle - Math.PI / 2),
        clockY + clockRadius * 0.8 * Math.sin(secondAngle - Math.PI / 2))
    ctx.stroke()

    ctx.font = "bold 50px 'Poppins'"
    ctx.textBaseline = "middle"
    ctx.textAlign = "center"
    ctx.fillStyle = mainColor
    ctx.fillText("•", clockX, clockY)
}

function updateDate(dateHeading, timezone) {
    const now = getDateByTimeZone(timezone)
    const options = { month: 'long', day: 'numeric', year: 'numeric' }
    const currentDate = now.toLocaleDateString('en-US', options)
    dateHeading.textContent = currentDate
}

function updateBackground(clockBlock, timezone) {
    const now = getDateByTimeZone(timezone)
    const timeOfDay = getTimeOfDay(now)
    clockBlock.className = `clock-block ${timeOfDay}-background`
}

function tick() {
    const clocks = document.querySelectorAll('.clock-block')
    clocks.forEach(function (clock) {
        const canvas = clock.querySelector('canvas')
        const timezone = clock.id
        const dateHeading = clock.querySelector('.date-heading')
        updateClock(canvas, timezone)
        updateDate(dateHeading, timezone)
        updateBackground(clock, timezone)
    })

    requestAnimationFrame(tick)
}

function addClock(timezone) {
    const container = document.querySelector('.clock-container')

    if (document.getElementById(timezone)) {
        return
    }

    const clockBlock = document.createElement('div')
    clockBlock.className = 'clock-block'
    clockBlock.id = timezone;

    const dateHeading = document.createElement('h3');
    dateHeading.className = 'date-heading'
    clockBlock.appendChild(dateHeading)

    const cityHeading = document.createElement('h2')
    cityHeading.className = 'city-heading'
    cityHeading.innerText = timeZones[timezone].name
    clockBlock.appendChild(cityHeading)

    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 250
    clockBlock.appendChild(canvas)

    const deleteButton = document.createElement('button')
    deleteButton.className = 'button-delete'
    deleteButton.innerText = 'DELETE'
    deleteButton.addEventListener('click', () => removeClock(timezone))
    clockBlock.appendChild(deleteButton)

    container.appendChild(clockBlock)

    tick()
}

function removeClock(timezone) {
    const clockBlock = document.getElementById(timezone)
    if (clockBlock) {
        clockBlock.remove()
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('timezone')

    for (const timezone in timeZones) {
        const option = document.createElement('option')
        option.value = timezone
        option.innerText = timeZones[timezone].name
        select.appendChild(option)
    }

    document.getElementById('add').addEventListener('click', () => {
        const timeZone = document.getElementById('timezone').value
        addClock(timeZone)
    });

    addClock('msk')

    tick()
})

