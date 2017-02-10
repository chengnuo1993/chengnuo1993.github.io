var audio = document.querySelector('audio')
var aside = document.querySelector('aside')
var ul = document.querySelector('aside>ul')
var bg = document.querySelector('#bg')
var box = document.querySelector('#box')
var boxA = document.querySelector('#boxA')
var boxB = document.querySelector('#boxB')
var lrc = document.querySelector('#lrc')
var cover = document.querySelector('#cover')
var header = document.querySelector('main>header')
var h2 = document.querySelector('h2')
var section = document.querySelector('section')
var img2 = document.querySelector('#buttons>img:nth-child(2)')
var timeLeft = document.querySelector('#time>span:nth-child(1)')
var timeRight = document.querySelector('#time>span:nth-child(3)')
var progress = document.querySelector('#time>input')
var volume = document.querySelector('#volume>input')
var current = 0
var updateTime = true
var animating = false
var song

volume.value = 100

function start() {
    lrc.innerHTML = '&#x3000;'
    boxB.innerHTML = ''
    var s = list[current]
    song = s.name
    header.innerHTML = s.name
    h2.innerHTML = s.singer
    bg.style.backgroundImage = 'url(' + s.cover + ')'

    if (section.style.backgroundImage) {
        coverfly(s)
    }
    else {
        section.style.backgroundImage = 'url(' + s.cover + ')'
        animating = false
    }

    audio.src = s.src
    play()
}

function coverfly(s) {
    section.style.animation = 'out 1s forwards'

    var sec = document.createElement('section')
    sec.style.backgroundImage = 'url(' + s.cover + ')'
    sec.style.zIndex = 1;
    cover.appendChild(sec)

    setTimeout(function () {
        sec.style.zIndex = 10;
        section.remove()
        section = sec
        animating = false
    }, 1000);
}

function play() {
    if (audio.paused) {
        audio.play()
    }
    else {
        audio.pause()
    }
}

function prev() {
    if(animating) return
    animating = true

    if (current > 0) {
        current--
    }
    else {
        current = list.length - 1
    }
    start()
}

function next() {
    if(animating) return
    animating = true

    if (current < list.length - 1) {
        current++
    }
    else {
        current = 0
    }
    start()
}


audio.onended = next;

audio.onplaying = function () {
    img2.src = 'images/play.png'
    section.style.animationPlayState = ''
}

audio.onpause = function () {
    img2.src = 'images/pause.png'
    section.style.animationPlayState = 'paused'
}

audio.ontimeupdate = function () {
    if (updateTime) {
        progress.value = audio.currentTime
        progress.max = audio.duration
        timeLeft.innerHTML = format(audio.currentTime)
        timeRight.innerHTML = format(audio.duration)

        if (lrcs[song]) {
            var offset = lrcs[song].offset || 0
            var time = format(audio.currentTime + offset)
            showLrc(time)
        }
    }
}

function showLrc(time) {
    var line = lrcs[song][time]
    if (line) {
        lrc.innerHTML = line
        showLrcs(time, line)
    }
    else if (line == '') {
        lrc.innerHTML = '&#x3000;'
        showLrcs(time, line)
    }
}

function showLrcs(time, line) {
    boxB.innerHTML = ''

    var keys = Object.keys(lrcs[song]).sort()
    var index = keys.indexOf(time)

    var p = document.createElement('p')
    p.innerHTML = line
    boxB.appendChild(p)

    var p1 = p
    var text
    for (var i = 1; i <= 5; i++) {
        var prev = index - i
        if (prev >= 0) {
            text = lrcs[song][keys[prev]]
        }
        else {
            text = ''
        }
        var newP = document.createElement('p')
        newP.innerHTML = text
        boxB.insertBefore(newP, p1)
        p1 = newP
    }

    for (var i = 1; i <= 5; i++) {
        var next = index + i
        if(next < keys.length - 1){
            text = lrcs[song][keys[next]]
        }
        else {
            text = ''
        }
        var newP = document.createElement('p')
        newP.innerHTML = text
        boxB.appendChild(newP)
    }
}

volume.oninput = function () {
    audio.volume = this.value / 100
}

progress.onchange = function () {
    lrc.innerHTML = '&#x3000;'
    audio.currentTime = this.value
}

progress.onmousedown = function () {
    updateTime = false
}

progress.onmouseup = function () {
    updateTime = true
}

progress.onmousemove = function () {
    timeLeft.innerHTML = format(this.value)
}

function format(second) {
    var t = parseInt(second || 0)
    var t1 = parseInt(t / 60)
    var t2 = t % 60

    if (t1 < 10) t1 = '0' + t1
    if (t2 < 10) t2 = '0' + t2

    return t1 + ':' + t2
}

start()

boxB.style.display = 'none'

lrc.onclick = function () {
    if(animating) return
    boxB.style.display = 'block'
    boxB.style.animation = 'fadeIn 2s forwards'
    boxA.style.animation = 'fadeOut 2s forwards'
    animating = true
    setTimeout(function () {
        boxB.style.animation = 'none'
        boxA.style.animation = 'none'
        boxA.style.display = 'none'
        animating = false
    }, 2000);
}

boxB.onclick = function () {
    if(animating) return
    boxA.style.display = 'block'
    boxB.style.animation = 'fadeOut 2s forwards'
    boxA.style.animation = 'fadeIn 2s forwards'
    animating = true
    setTimeout(function () {
        boxB.style.animation = 'none'
        boxA.style.animation = 'none'
        boxB.style.display = 'none'
        animating = false
    }, 2000);
}

aside.style.display = 'none'

cover.onclick = function () {
    aside.style.display = 'block'
    aside.style.animation = 'slideUp 0.5s forwards'
}

function closeList() {
    aside.style.animation = 'slideDown 0.5s forwards'
    setTimeout(function() {
        aside.style.display = 'none'
    }, 500);
}

function renderList() {
    for (var i = 0; i < list.length; i++) {
        var s = list[i];
        var li = document.createElement('li')
        li.setAttribute('onclick', 'current = ' + i + ';start();closeList();')
        li.innerHTML = s.name + '<small> - ' + s.singer + '</small>'
        ul.appendChild(li)
    }
}

renderList()