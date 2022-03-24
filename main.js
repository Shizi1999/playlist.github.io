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
var auto, auto1
const ranBtn = $(".btn-random")
const reBtn = $(".btn-repeat")
const playlist = $(".playlist")
const app = {
    value: 0,
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
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
            return `<div class="song ${index === this.currentIndex ? "active": ""}" data-index = "${index}">
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
        const str = htmls.join("")
        playlist.innerHTML = str
    },

    handleEvents: function () {
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
        function seekUpdate() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        auto = setInterval(seekUpdate, 1000)
        progress.onclick = function (e) {
            clearInterval(auto1)
            clearInterval(auto)
            var value = Math.floor(e.target.value)
            const seekTime = value / 100 * audio.duration
            audio.currentTime = seekTime
            auto1 = setInterval(seekUpdate, 1000)
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
        audio.onended = function(){
            if(_this.isRepeat){
                this.play();
            }else{
                nextBtn.click();
            }
        }
        // repeat
        reBtn.onclick =function(){
            _this.isRepeat = !_this.isRepeat
            this.classList.toggle("active", _this.isRepeat)
        }
        // click vao bai hat
        playlist.onclick = function(e){
            const song = e.target.closest('.song:not(.active)')
            const option = e.target.closest('.option')
            if(option){
                
            }else if(song){
                _this.currentIndex = Number(song.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }
        // scroll to active song
        
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            let song = $(".song.active")
            let string = "nearest"
            if(song.dataset.index<1){
            string = "center"
            }
            song.scrollIntoView({
                behavior: "smooth",
                block: string
            })
        },300)
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