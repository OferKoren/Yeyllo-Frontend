export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function colorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '')
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    lum = lum || 0

    // convert to decimal and change luminosity
    var rgb = '#',
        c,
        i
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16)
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16)
        rgb += ('00' + c).substr(c.length)
    }

    return rgb
}

export function makeLorem(size = 100) {
    var words = [
        'The sky',
        'above',
        'the port',
        'was',
        'the color of television',
        'tuned',
        'to',
        'a dead channel',
        '.',
        'All',
        'this happened',
        'more or less',
        '.',
        'I',
        'had',
        'the story',
        'bit by bit',
        'from various people',
        'and',
        'as generally',
        'happens',
        'in such cases',
        'each time',
        'it',
        'was',
        'a different story',
        '.',
        'It',
        'was',
        'a pleasure',
        'to',
        'burn',
    ]
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

/* export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
} */
export function debounce(func, delay = 300) {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : undefined
}
export function lightenColor(color, percent) {
    // Match the color in rgba or rgb format
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/)

    if (!rgbaMatch) return color // Return original color if format isn't matched

    // Extract RGB channels and optional alpha channel
    const [_, r, g, b, a] = rgbaMatch.map(Number)

    // Calculate the new RGB values by lightening the color
    const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
    const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
    const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))

    // Preserve alpha if it exists, otherwise default to 1 (opaque)
    const newA = a !== undefined ? a : 1

    // Return new color in rgba format
    return `rgba(${newR}, ${newG}, ${newB}, ${newA})`
}

/* export function darkenColor(color, percent) {
    // Match the color in rgba or rgb format
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/)

    if (!rgbaMatch) return color // Return original color if format isn't matched

    // Extract RGB channels and optional alpha channel
    const [_, r, g, b, a] = rgbaMatch.map(Number)

    // Calculate the new RGB values by darkening the color
    const newR = Math.max(0, Math.floor(r * (1 - percent / 100)))
    const newG = Math.max(0, Math.floor(g * (1 - percent / 100)))
    const newB = Math.max(0, Math.floor(b * (1 - percent / 100)))

    // Preserve alpha if it exists, otherwise default to 1 (opaque)
    const newA = a !== undefined ? a : 1

    // Return new color in rgba format
    return `rgba(${newR}, ${newG}, ${newB}, ${newA})`
} */
export function darkenColor(color, percent) {
    // Match the color in either rgba or rgb format
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/)

    if (!match) return color // Return original color if format isn't matched

    // Extract RGB channels and optional alpha channel
    const [, r, g, b, a] = match.map(Number)

    // Calculate the new RGB values by darkening the color
    const newR = Math.max(0, Math.floor(r * (1 - percent / 100)))
    const newG = Math.max(0, Math.floor(g * (1 - percent / 100)))
    const newB = Math.max(0, Math.floor(b * (1 - percent / 100)))

    // Check if the color is rgba or rgb based on the presence of alpha
    if (a !== undefined && !!a) {
        // If alpha is defined, return in rgba format

        return `rgba(${newR}, ${newG}, ${newB}, ${a})`
    }

    // If alpha is not defined, return in rgb format
    return `rgb(${newR}, ${newG}, ${newB})`
}

export function getBrightnessLevel(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)

    if (!match) {
        throw new Error('Invalid RGB or RGBA format')
    }

    // Extract the RGB components
    const r = parseInt(match[1], 10)
    const g = parseInt(match[2], 10)
    const b = parseInt(match[3], 10)

    // Calculate brightness using the luminance formula
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b
    // console.log(brightness)
    // Return brightness level based on thresholds
    if (brightness > 165) {
        return 1 // Brightest
    } else if (brightness > 65) {
        return 2 // Medium
    } else {
        return 3 // Darkest
    }
}

/* export function createComplexCssFilter(color) {
    // Match the RGB or RGBA components using a regex
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)

    if (!match) {
        throw new Error('Invalid RGB or RGBA color format')
    }

    // Extract RGB components
    const r = parseInt(match[1], 10) / 255
    const g = parseInt(match[2], 10) / 255
    const b = parseInt(match[3], 10) / 255

    // Extract alpha channel if it exists, default to 1 (opaque) if not
    const a = !!match[4] ? parseFloat(match[4]) : 1

    // Example complex filter: adjust brightness, hue, and use all channels (r, g, b)
    return `sepia(1) saturate(1000%) brightness(${0.8 + r}) hue-rotate(${(g + b) * 180}deg) opacity(${a})`
} */
export function createCssFilter(color) {
    // Match the RGB or RGBA components using a regex
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)

    if (!match) {
        throw new Error('Invalid RGB or RGBA color format')
    }

    // Extract RGB components
    const r = parseInt(match[1], 10)
    const g = parseInt(match[2], 10)
    const b = parseInt(match[3], 10)

    // Extract alpha channel if it exists, default to 1 (opaque) if not
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1

    // Normalize RGB values to be between 0 and 1 for filter adjustment
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255

    // Calculate brightness (average of RGB values)
    const brightness = (rNorm + gNorm + bNorm) / 3

    // Calculate saturation (based on the largest RGB value)
    const maxRGB = Math.max(rNorm, gNorm, bNorm)
    const saturation = maxRGB

    // Return a CSS filter string that reflects the color
    return `brightness(${brightness}) saturate(${saturation}) opacity(${a})`
}
