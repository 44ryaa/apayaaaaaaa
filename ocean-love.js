/* MUSIC PLAYER */
var ytReady = false;
var ytPlaying = false;
var ytPlayer = null;
var START_SEC = 43;
var YT_VIDEO_ID = 'fGklW_t2oag';

function loadYTApi() {
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-frame', {
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 1,
      start: START_SEC,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
      mute: 0
    },
    events: {
      onReady: function(e) {
        ytReady = true;
        e.target.setVolume(70);
        e.target.playVideo();
      },
      onStateChange: function(e) {
        if (e.data === YT.PlayerState.PLAYING) {
          ytPlaying = true;
          document.getElementById('musicEq').classList.remove('paused');
          document.getElementById('musicToggle').textContent = '⏸';
        } else {
          ytPlaying = false;
          document.getElementById('musicEq').classList.add('paused');
          document.getElementById('musicToggle').textContent = '▶';
        }
        // Loop: restart at START_SEC when ended
        if (e.data === YT.PlayerState.ENDED) {
          e.target.seekTo(START_SEC);
          e.target.playVideo();
        }
      }
    }
  });
};

function startExperience() {
  var overlay = document.getElementById('startOverlay');
  overlay.classList.add('gone');
  setTimeout(function(){ overlay.style.display = 'none'; }, 750);
  document.getElementById('musicBar').classList.remove('hidden');
  loadYTApi();
}

function toggleMusic() {
  if (!ytReady || !ytPlayer) return;
  if (ytPlaying) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.playVideo();
  }
}

/* BUBBLES */
const bubbleContainer = document.getElementById('bubbles');
for (let i = 0; i < 22; i++) {
  const b = document.createElement('div');
  b.className = 'bubble';
  const size = Math.random() * 16 + 5;
  b.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(Math.random()*100)+'%;animation-duration:'+(Math.random()*12+8)+'s;animation-delay:'+(Math.random()*14)+'s';
  bubbleContainer.appendChild(b);
}

/* FLOATERS */
const emojis = ['🐳','🐋','🐡','🐠','🪼','🐚','🐙','🦞','🦑','🦀','🦈'];
const floaterContainer = document.getElementById('floaters');
emojis.forEach(function(em, i) {
  const f = document.createElement('div');
  f.className = 'floater';
  f.textContent = em;
  f.style.cssText = 'left:'+(((i/emojis.length)*88)+2)+'%;animation-duration:'+(Math.random()*18+16)+'s;animation-delay:'+(Math.random()*18)+'s';
  function popIt(e) {
    if (f.classList.contains('popped')) return;
    f.classList.add('popped');
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    spawnRipple(cx, cy);
    showToast('🫧 ' + em + ' lari darimu!');
    setTimeout(function(){ f.classList.remove('popped'); }, 500);
  }
  f.addEventListener('touchstart', popIt, { passive: true });
  f.addEventListener('click', popIt);
  floaterContainer.appendChild(f);
});

/* CARDS */
const cardData = [
  { emoji:'🐳', title:'Paus Biru', front:'Seperti paus yang mengarungi samudra, pelukanmu adalah rumah yang paling hangat.', back:'"Aku selalu ingin kembali ke pelukanmu, seperti paus yang kembali ke laut."' },
  { emoji:'🦑', title:'Cumi-cumi', front:'Cerdas dan penuh warna — pikiranmu selalu membuatku kagum.', back:'"Kamu mewarnai duniaku dengan caramu yang ajaib."' },
  { emoji:'🐠', title:'Ikan Badut', front:'Cerah dan penuh semangat — tawamu menerangi hari-hariku.', back:'"Tawamu adalah suara yang paling ingin kudengar setiap hari."' },
  { emoji:'🦈', title:'Hiu', front:'Kuat dan berani — keberanianmu selalu menginspirasi aku.', back:'"Kamu mengajarkanku untuk tidak takut menyelami lautan hidup."' },
  { emoji:'🦀', title:'Kepiting', front:'Keras di luar, lembut di dalam — aku percaya sepenuhnya.', back:'"Di balik sikapmu yang kuat, ada kelembutan yang hanya aku yang tahu."' },
  { emoji:'🐙', title:'Gurita', front:'Penuh kejutan — kamu selalu punya cara baru untuk buat aku jatuh cinta.', back:'"Tidak ada hari yang membosankan bersamamu. Setiap momen adalah petualangan."' },
];

const cardsEl = document.getElementById('cards');
cardData.forEach(function(c) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML =
    '<div class="card-wrapper">' +
      '<div class="card-front">' +
        '<span class="emoji">'+c.emoji+'</span>' +
        '<h3>'+c.title+'</h3>' +
        '<p>'+c.front+'</p>' +
        '<div class="tap-hint">ketuk ✨</div>' +
      '</div>' +
      '<div class="card-back">'+c.back+'</div>' +
    '</div>';
  const wrapper = card.querySelector('.card-wrapper');
  function flip(e) {
    wrapper.classList.toggle('flipped');
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    spawnRipple(cx, cy);
  }
  card.addEventListener('touchstart', flip, { passive: true });
  card.addEventListener('click', flip);
  cardsEl.appendChild(card);
});

/* LOVE METER */
var meterIdx = 0;
var meterStates = [
  { pct:60,  label:'60% — Sangat suka kamu 💙',        emoji:'🌊' },
  { pct:75,  label:'75% — Sayang banget sama kamu 💕',  emoji:'🐠' },
  { pct:88,  label:'88% — Cinta kamu sekali 🥰',        emoji:'🐋' },
  { pct:96,  label:'96% — Gak bisa hidup tanpamu ❤️',   emoji:'🫀' },
  { pct:100, label:'100% — Cintaku tak terbatas! 💙🌊💙', emoji:'🐳' },
];
function measureLove() {
  var s = meterStates[meterIdx % meterStates.length];
  document.getElementById('meterFill').style.width = s.pct + '%';
  document.getElementById('meterLabel').textContent = s.label;
  document.getElementById('meterEmoji').textContent = s.emoji;
  if (s.pct === 100) showToast('💙 Cintaku tak terbatas untukmu!');
  meterIdx++;
}

/* HEART BUTTON */
var heartCount = 0;
var loveWords = ['Sayang kamu 💙','Rindu kamu 🌊','Kamu cantik 🪼','Cinta kamu 🐋','Mau peluk kamu 🐳'];
function sendLove() {
  heartCount++;
  var btn = document.getElementById('heartBtn');
  btn.querySelector('.hb-icon').textContent = '💙';
  btn.classList.remove('beating');
  void btn.offsetWidth;
  btn.classList.add('beating');
  document.getElementById('heartText').textContent = loveWords[(heartCount-1) % loveWords.length];
  document.getElementById('heartCounter').textContent = heartCount > 1 ? ('💙 Sudah '+heartCount+'x dikirim') : '';
  if (heartCount === 5)  showToast('💙 5 ciuman virtual untukmu!');
  if (heartCount === 10) showToast('🐋 Cintamu sedalam lautan!');
}

/* WHALE TAP */
function whaleTap(e) {
  var cx = e.touches ? e.touches[0].clientX : e.clientX;
  var cy = e.touches ? e.touches[0].clientY : e.clientY;
  spawnRipple(cx, cy);
  showToast('🐋 Paus senang kamu datang! 💙');
}
document.getElementById('whaleBadge').addEventListener('touchstart', whaleTap, { passive: true });
document.getElementById('whaleBadge').addEventListener('click', whaleTap);

/* WISHES */
var wishes = [
  '"Semoga setiap harimu penuh dengan senyum yang tulus dan tawa yang dari hati."',
  '"Semoga mimpi-mimpimu sebesar lautan — dan semua terwujud satu per satu."',
  '"Semoga kamu selalu dikelilingi orang-orang yang mencintaimu tulus."',
  '"Semoga setiap perjalananmu ditemani keberanian dan rasa aman."',
  '"Semoga cintamu padaku setulus cintaku padamu — selamanya." 💙',
];
var wishIdx = 0;
var wishDisplay = document.getElementById('wishDisplay');
function showWish(i) {
  wishDisplay.classList.add('fading');
  setTimeout(function() {
    wishDisplay.textContent = wishes[i];
    wishDisplay.classList.remove('fading');
  }, 340);
}
function nextWish() { wishIdx = (wishIdx+1) % wishes.length; showWish(wishIdx); }
function prevWish() { wishIdx = (wishIdx-1+wishes.length) % wishes.length; showWish(wishIdx); }
showWish(0);

/* SWIPE on wishes */
var swipeStartX = 0;
wishDisplay.addEventListener('touchstart', function(e){ swipeStartX = e.touches[0].clientX; }, { passive:true });
wishDisplay.addEventListener('touchend', function(e){
  var dx = e.changedTouches[0].clientX - swipeStartX;
  if (Math.abs(dx) > 40) { dx < 0 ? nextWish() : prevWish(); }
}, { passive:true });

/* TOUCH RIPPLE on page */
document.addEventListener('touchstart', function(e) {
  var el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  if (!el) return;
  if (el.closest('.card') || el.closest('.floater') || el.closest('button')) return;
  spawnRipple(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

/* MOUSE SPARKLE desktop */
var sparklePool = ['✨','💙','🌊','⭐','💫','🫧'];
document.addEventListener('mousemove', function(e) {
  if (Math.random() > 0.88) {
    var s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = sparklePool[Math.floor(Math.random()*sparklePool.length)];
    s.style.left = e.clientX + 'px';
    s.style.top  = e.clientY + 'px';
    document.body.appendChild(s);
    setTimeout(function(){ s.remove(); }, 700);
  }
});

/* HELPERS */
function spawnRipple(x, y) {
  var r = document.createElement('div');
  r.className = 'ripple';
  r.style.left = x + 'px';
  r.style.top  = y + 'px';
  document.body.appendChild(r);
  setTimeout(function(){ r.remove(); }, 650);
}

var toastTimer;
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2600);
}

/* SCROLL REVEAL */
var revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(function(el){ obs.observe(el); });
} else {
  revealEls.forEach(function(el){ el.classList.add('visible'); });
}
