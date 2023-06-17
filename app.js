// Controles de flecha canciones
const leftArrowSong = document.querySelector('#popularSongArrowLeft');
const rightArrowSong = document.querySelector('#popularSongArrowRight');
// Contenedor de canciones populares
const songsContainer = document.querySelector('.songs_list');

// Controles de flecha artistas
const leftArrowArtist = document.querySelector('#popularArtistArrowLeft');
const rightArrowArtist = document.querySelector('#popularArtistArrowRight');
// Contenedor de artistas populares
const artistsContainer = document.querySelector('.artist_list');
// Controles Musica
const music = new Audio("./audio/1.mp3");
let songs = {};


const $shuffleButton = document.getElementById('shuffle');
const $skip_previousButton = document.getElementById('skip_previous');
const $play_circleButton = document.getElementById('play_circle');
const $skip_nextButton = document.getElementById('skip_next');
const $downloadButton = document.getElementById('download');
const $banner = document.getElementById('song_banner');
const $bars = document.querySelectorAll('.wave1');
const $input = document.getElementById('searchBar');
let currentSong = 0;
let songsPaths = [{}];
let favoritas = [];
let currentSearch = '';
$input.addEventListener('focusout', (e) => { 
    const songName = e.target.value;
    if (songName.length > 0 && songName !== currentSearch) {
        currentSearch = songName;
        songsContainer.innerHTML = '';
        fetchSongs(songName.trim().toLowerCase());
    }
});

window.addEventListener('keydown', (e) => {
    if($input.focus ){
        if(e.key === 'Enter'){
            const songName = $input.value;
            if (songName.length > 0 && songName !== currentSearch) {
                currentSearch = songName;
                songsContainer.innerHTML = '';
                fetchSongs(songName.trim().toLowerCase());
            }
        }
    }
 });

$play_circleButton.addEventListener('click', () => {
    changeSymbol();
 });

$skip_nextButton.addEventListener('click', () => { 
    console.log(currentSong);
    currentSong++;
    if(currentSong >= songsPaths.length){
        currentSong = 0;
    }
    changeSong(songsPaths[currentSong].id);
});

$skip_previousButton.addEventListener('click', () => {
    currentSong--;
    if(currentSong < 0){
        currentSong = songsPaths.length - 1;
    }
    changeSong(songsPaths[currentSong].id);
});
 
function changeSong(songId) {
    // Modo local
    // music.src = songs[currentSong].preview;
    // Modo API
    const song = songsPaths.find(song => song.id == songId);
    const songIndex = songsPaths.findIndex(song => song.id == songId);
    music.src = song.preview;
    changeSymbol();
    music.play();
    document.querySelector('#title').innerHTML = `${song.title}<br><div class=\"subtitle\">${song.artist}</div>`;
    document.querySelector('#poster_master_play').src = song.cover;
    $banner.src = song.cover;
    currentSong = songIndex;
    // Agregando canciones a favoritos
    if (favoritas.length < 5) {
        if (favoritas.find(song => song.id == songId)) {
            return;
        }
      favoritas.push(song);
      console.log(favoritas);
        saveToLocalStorage(favoritas);
    }
}

 function changeSymbol() {
    if(music.paused || music.currentTime <= 0){
        music.play();
        $play_circleButton.innerHTML = `pause_circle`;
        $bars.forEach(bar => {
            bar.classList.add('active1');
         });
    }else{
        music.pause();
        $play_circleButton.innerHTML = `play_circle`;
        $bars.forEach(bar => {
            bar.classList.remove('active1');
         });
    }
 }
let scroll = 0;

rightArrowSong.addEventListener('click', () => {
    scroll += 200;
    songsContainer.scrollLeft = scroll;
    if(scroll > (songsContainer.scrollWidth ) ){
        songsContainer.scrollLeft = 0;
        scroll = 0;
    }
});
 
leftArrowSong.addEventListener('click', () => {
    scroll -= 200;
    songsContainer.scrollLeft = scroll;
    if(scroll <= 0 ){
        songsContainer.scrollLeft = songsContainer.scrollWidth;
        scroll = songsContainer.scrollWidth - songsContainer.offsetWidth;
    }
});
 
rightArrowArtist.addEventListener('click', () => {
    scroll += 100;
    artistsContainer.scrollLeft = scroll;
    if(scroll > (artistsContainer.scrollWidth - scroll ) ){
        artistsContainer.scrollLeft = 0;
        scroll = 0;
    }
});
 
leftArrowArtist.addEventListener('click', () => {
    scroll -= 100;
    artistsContainer.scrollLeft = scroll;
    if(scroll <= 0 ){
        artistsContainer.scrollLeft = artistsContainer.scrollWidth;
        scroll = artistsContainer.scrollWidth - artistsContainer.offsetWidth;
    }
    console.log(scroll);
    console.log(artistsContainer.scrollWidth);
});

//Input Bar Volume
const $volume = document.getElementById('volume');
const $volumeBar = document.getElementsByClassName('vol_bar')[0];
const $volumeDot = document.getElementById('vol_dot');
$volume.addEventListener('change', () => {
    music.volume = $volume.value / 100;
    $volumeBar.style.width = `${$volume.value}%`;
    $volumeDot.style.left = `${$volume.value}%`;
 });

//Actualizando etiqueta de tiempo
const $currentTime = document.getElementById('currentTime');
const $currentEnd = document.getElementById('currentEnd');
const $inputValue = document.getElementById('seek');
const $progressBar = document.getElementById('progressBar');
const $progressDot = document.getElementById('progressDot');

music.addEventListener('timeupdate', () => {
    let minutes = `${Math.floor(music.currentTime / 60)}`;
    let seconds = `${Math.floor(music.currentTime % 60)}`;
    let time = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    $currentTime.innerHTML = time;
    let totalMinutes = `${Math.floor(music.duration / 60)}`;
    let totalSeconds = `${Math.floor(music.duration % 60)}`;
    let totalTime = `${totalMinutes}:${totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}`;
    $currentEnd.innerHTML = totalTime;
    $inputValue.value = (music.currentTime / music.duration) * 100;
    $progressBar.style.width = `${(music.currentTime / music.duration) * 100}%`;
    $progressDot.style.left = `${(music.currentTime / music.duration) * 100}%`;
 });

$inputValue.addEventListener('change', (e) => {
    music.currentTime = (e.target.value / 100) * music.duration;
 });

function createHTMLSongEleent(songs) {
    let fragment = document.createDocumentFragment();
        songs.forEach(song => {
            let songItem = document.createElement('div');
            // Llenando el array de canciones
            songsPaths.push({
                id: song.id,
                preview: song.preview,
                cover: song.album.cover_big,
                title: song.title,
                artist: song.artist.name
            });
            // Creando el elemento de la cancion
            songItem.classList.add('song');
            songItem.classList.add('no-select');
            songItem.setAttribute('song_id', song.id);
            songItem.innerHTML = `
            <div class="heart_reaction">
            <i class="material-icons">favorite</i>
          </div>
            <img src=${song.album.cover_big} alt="">
            <i id="1" class="bi material-symbols-rounded play">play_circle</i>
            <div class="song_info text_abreviation">
                <h5>${song.title}</h5>
                <p>${song.artist.name}</p>
            </div>`;
            fragment.appendChild(songItem);
        });
        songsContainer.appendChild(fragment);
        Array.from(document.querySelectorAll('.song')).forEach((song) => {
        song.addEventListener('click', () => {
        changeSong(song.getAttribute('song_id'));
        });
            song.addEventListener('dblclick', () => {
                song.children[0].classList.add('visible');
                setTimeout(() => {
                    song.children[0].classList.remove('visible');
                 }, 1200);
             });
    });
}
async function fetchSongs(search) {
    const url = new URL('https://deezerdevs-deezer.p.rapidapi.com/search');
    url.searchParams.append('q', search);
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd91bda661emsh33c1da8ab8b313dp1e4f67jsn6c933af012cc',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };
    try {
        const [response, localResponse] = await Promise.all([fetch(url, options), fetch('./songs.json')]);
        const [{data}, localSongs] = await Promise.all([response.json(), localResponse.json()]);

        songs = [...data, ...localSongs];
        createHTMLSongEleent(songs);    

    } catch (error) {
        console.error(error);
    }
}
// Función para enviar el ID al servidor
function saveToLocalStorage(datos) {
    localStorage.setItem('favoritas', JSON.stringify(datos));
}
function actualizarRegistroEnIndexedDB(id, nuevoDato) {
}

function obtenerListaDeFavoritos() { 
    let favoritas = localStorage.getItem('favoritas');
    if (favoritas == null) {
        favoritas = [];
    } else {
        favoritas = JSON.parse(favoritas);
    }
    return favoritas;    
}


function fillFavouriteSongs(songs = []) {
    console.log(songs);
    if (songs.length === 0) { return; }
    const $container = document.querySelector('.menu_song');
    let fragment = document.createDocumentFragment();
    songs.forEach((song,index) => { 
        let songItem = document.createElement('li');
        songItem.classList.add('songItem');
        songItem.setAttribute('song_id', song.id);
        songItem.innerHTML = `
        <span>${index}</span>
        <img src=${song.cover} alt="song__title">
        <h5>${song.title}<br> 
            <div class="subtitle">${song.artist}</div> 
        </h5>
        <div>
            <i class="bi material-symbols-rounded play" song_id=${song.id}>play_circle</i>
            <i class="bi material-symbols-rounded delete" song_id=${song.id}>delete</i>
        </div>`;
        fragment.appendChild(songItem);
    });
    $container.appendChild(fragment);

//Left Panel Song List
const $songList = document.querySelectorAll('.songItem i.play');
$songList.forEach(song => {
    song.addEventListener('click', () => {
        $songList.forEach(song => {
            song.classList.remove('active');
        });
        song.classList.add('active');
        const song_id = song.getAttribute('song_id');
        changeSong(song_id);
    });
});
document.querySelectorAll('.songItem i.delete').forEach((song) => { 
    song.addEventListener('click', () => {
        const song_id = song.getAttribute('song_id');
        const songIndex = favoritas.findIndex(song => song.id == song_id);
        favoritas.splice(songIndex, 1);
        saveToLocalStorage(favoritas);
        song.parentElement.parentElement.remove();
    });
});
}

const $openMenu = document.querySelector('#openMenu');
const $hideMenuButton = document.querySelector('#hideMenuButton');
const menu = document.querySelector('.menu_side');
$hideMenuButton.addEventListener('click', () => {
    menu.classList.add('inactive');
    setTimeout(() => {
        menu.classList.remove('active');
    }, 400)
 });

$openMenu.addEventListener('click', () => {
    menu.classList.remove('inactive');
    menu.classList.add('active');

 });

const $artists = document.querySelectorAll('.artist');
$artists.forEach(artist => {
    artist.addEventListener('dblclick', () => {
        // const artistName = artist.getAttribute('artist_name');
        // $input.value = artistName;
        // songsContainer.innerHTML = '';
        // fetchSongs(artistName.trim().toLowerCase());
        artist.children[0].classList.add('visible');
        setTimeout(() => {
            artist.children[0].classList.remove('visible');
         }, 1200);
    });
 });


(async () => {
  favoritas = obtenerListaDeFavoritos();
  fillFavouriteSongs(favoritas);
  await fetchSongs('Avril Lavigne');
})()
 