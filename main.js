const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $(".cd")
const playBtn = $(".btn-toggle-play")
const player = $(".player")
const progress = $("#progress")
const nextBtn = $(".btn-next")
const preBtn = $(".btn-prev")
const ranBtn = $(".btn-random")
const reBtn = $(".btn-repeat")
const playlist = $(".playlist")
const app = {
    value: 0,
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isDark: false,
    songs: [
        {
            "name": "Chân Tình",
            "singer": "Jay Chou",
            "path": "./music/Chân Tình.mp3",
            "image": "./img/1.jpg"
        },
        {
            "name": "Chiều Lên Bản Thượng",
            "singer": "Jane Zhang",
            "path": "./music/Chiều lên bản thượng.mp3",
            "image": "./img/2.jpg"
        },
        {
            "name": "Ngày Chưa Giông Bão",
            "singer": "Shou Zhen",
            "path": "./music/Ngày chưa giông bão.mp3",
            "image": "./img/3.jpg"
        },
        {
            "name": "Nhắm Mắt Thấy Mùa Hè",
            "singer": "Shi Zi",
            "path": "./music/Nhắm mắt thấy mùa hè.mp3",
            "image": "./img/4.jpg"
        },
        {
            "name": "Niềm Vui Của Em",
            "singer": "Jay Chou",
            "path": "./music/Niềm vui của em.mp3",
            "image": "./img/5.jpg"
        },
        {
            "name": "Tháng Tư Là Lời Nói Dối Của Em",
            "singer": "G.E.M",
            "path": "./music/Tháng tư là lời nói dối của em.mp3",
            "image": "./img/6.jpg"
        }
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? "active" : ""}" data-index = "${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        const defaultStr = `<div class="change header">
        <div class="title">PlayList</div>
        <div class="mode">
            <div class="light"><i class="fa-solid fa-sun"></i></div>
            <div class="dark"><i class="fa-solid fa-moon"></i></div>
        </div>
    </div>`
        const str = defaultStr + htmls.join("")
        playlist.innerHTML = str
    },

    handleEvents: function () {
        const lightMode = $(".light")
        const darkMode = $(".dark")
        const optionMode = $(".change")
        const mode = $(".mode")
        const _this = this
        const cdWidth = cd.offsetWidth
        // Quay cd thumb
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }],
            {
                duration: 10000,
                iterations: Infinity
            })
        cdThumbAnimate.pause()
        // Su kien scroll
        window.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop
            cd.style.width = newWidth > 0 ? newWidth + "px" : 0
            cd.style.opacity = newWidth / cdWidth
        }
        // Su kien play
        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

        }
        // Audio dang play
        audio.onplay = () => {
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play()
        }
        // audio bi pause
        audio.onpause = () => {
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }
        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        progress.oninput = function (e) {
            if (audio.duration) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
        }
        // next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.ranSong()
            } else {
                _this.nextSong();
            }
            audio.play()
            _this.render();
            _this.scrollToActiveSong();
        }
        // pre song
        preBtn.onclick = function () {
            if (_this.isRandom) {
                _this.ranSong()
            } else {
                _this.preSong();
            }
            audio.play()
            _this.render();
            _this.scrollToActiveSong();
        }
        //random song
        ranBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            this.classList.toggle("active", _this.isRandom)
        }
        // end song
        audio.onended = function () {
            if (_this.isRepeat) {
                this.play();
            } else {
                nextBtn.click();
            }
        }
        // repeat
        reBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            this.classList.toggle("active", _this.isRepeat)
        }
        // click vao bai hat
        playlist.onclick = function (e) {
            const song = e.target.closest('.song:not(.active)')
            const option = e.target.closest('.option')
            if (option) {

            } else if (song) {
                _this.currentIndex = Number(song.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }
        // Change mode
        const lightAni = lightMode.animate(
            [
                { transform: 'translateX(20px)', opacity: 0 },
            ],
            {
                duration: 300,
                iterations: 1
            })
        const darkAni = darkMode.animate(
            [
                { transform: 'translateX(-20px)', opacity: 0 },
            ],
            {
                duration: 300,
                iterations: 1
            })
        lightAni.pause()
        darkAni.pause()
        optionMode.onclick = () => {
            if (_this.isDark) {
                darkAni.play()
                setTimeout(() => {
                    lightMode.style.display = "block"
                    darkMode.style.display = "none"
                }, 200)
                mode.style.backgroundColor = "rgb(221, 221, 221)"
            } else {
                lightAni.play()
                setTimeout(() => {
                    lightMode.style.display = "none"
                    darkMode.style.display = "block"
                }, 200)
                mode.style.backgroundColor = "#f54f7b"
            }
            $("#body").classList.toggle("darkmode")
            $(".dashboard").classList.toggle("darkmode")
            let listSongs = document.querySelectorAll(".song")
            listSongs.forEach(function(song){
                if(!song.classList.contains("active")){
                    song.classList.toggle("darkmode")
                    song.querySelector(".title").classList.toggle("darkmodetext")
                    console.log(song.querySelector(".title"))
                }
            })
            optionMode.classList.toggle("darkmode")
            _this.isDark = !_this.isDark
        }

    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            let song = $(".song.active")
            let string = "nearest"
            if (song.dataset.index < 1) {
                string = "center"
            }
            song.scrollIntoView({
                behavior: "smooth",
                block: string
            })
        }, 300)
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= (this.songs.length)) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    preSong: function () {
        this.currentIndex--
        if (this.currentIndex <= 0) {
            this.currentIndex = (this.songs.length - 1)
        }
        this.loadCurrentSong()
    },
    ranSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    start: function () {
        this.defineProperties()
        this.render();
        this.handleEvents();
        this.loadCurrentSong();
    }
}

app.start();