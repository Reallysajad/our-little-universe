import { settings } from './data/settings.js';
import { chapters } from './data/chapters.js';
import './style.css';

const $ = (selector) => document.querySelector(selector);
const screens = ['countdown-screen', 'gate-screen', 'book-screen'];
let currentChapter = 0;

const showScreen = (id) => {
  screens.forEach((screen) => $(`#${screen}`).classList.toggle('hidden', screen !== id));
};

const pad = (value) => String(Math.max(0, value)).padStart(2, '0');

function updateCountdown() {
  const remaining = new Date(settings.countdownTarget).getTime() - Date.now();
  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $('#days').textContent = pad(days);
  $('#hours').textContent = pad(hours);
  $('#minutes').textContent = pad(minutes);
  $('#seconds').textContent = pad(seconds);
}

function renderChapter() {
  const chapter = chapters[currentChapter];
  $('#chapter-number').textContent = `فصل ${currentChapter + 1} از ${chapters.length}`;
  $('#chapter-content').innerHTML = `
    <p class="chapter-environment">${chapter.environment}</p>
    <h2>${chapter.title}</h2>
    <p>${chapter.text}</p>
    <div class="placeholder">محتوای واقعی این فصل بعداً اضافه می‌شود ✨</div>
  `;
  $('#previous').disabled = currentChapter === 0;
  $('#next').textContent = currentChapter === chapters.length - 1 ? 'پایان' : 'بعدی';
}

function openBook() {
  currentChapter = 0;
  renderChapter();
  showScreen('book-screen');
}

$('#preview-entry').addEventListener('click', () => showScreen('gate-screen'));

$('#password-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const entered = $('#password').value.trim().toLowerCase();
  const expected = settings.password.toLowerCase();
  const message = $('#password-message');

  if (entered === expected) {
    message.textContent = 'دروازه باز شد ✨';
    message.className = 'message success';
    window.setTimeout(openBook, 700);
  } else {
    message.textContent = 'رمز درست نیست؛ دوباره امتحان کن 🌙';
    message.className = 'message error';
  }
});

$('#previous').addEventListener('click', () => {
  if (currentChapter > 0) {
    currentChapter -= 1;
    renderChapter();
  }
});

$('#next').addEventListener('click', () => {
  if (currentChapter < chapters.length - 1) {
    currentChapter += 1;
    renderChapter();
  } else {
    currentChapter = 0;
    renderChapter();
  }
});

$('#restart').addEventListener('click', () => {
  if (window.confirm('از ابتدا شروع شود؟')) {
    $('#password').value = '';
    $('#password-message').textContent = '';
    showScreen('countdown-screen');
  }
});

updateCountdown();
window.setInterval(updateCountdown, 1000);
