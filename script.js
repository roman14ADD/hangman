// Обновление рисунка виселицы
function updateHangman() {
    for (let i = 0; i < maxWrong; i++) {
        const part = document.getElementById(`hangman-${i}`);
        if (part) {
            if (i < wrongCount) {
                part.classList.remove("hidden");
            } else {
                part.classList.add("hidden");
            }
        }
    }
}
// Логика игры "Виселица" (Apple-стиль)

// Список слов (природа, технологии, животные, еда)
const words = [
    "радуга", "молния", "туман", "закат", "снегопад",
    "жираф", "пингвин", "дельфин", "крокодил", "бабочка",
    "пирожок", "шоколад", "мороженое", "пельмени", "борщ",
    "доктор", "учитель", "пожарный", "космонавт", "инженер",
    "телефон", "компьютер", "наушники", "рюкзак", "зонтик",
    "футбол", "хоккей", "плавание", "теннис", "велосипед",
    "картина", "музыка", "театр", "балет", "скульптура",
    "поезд", "корабль", "палатка", "компас", "чемодан",
    "радость", "грусть", "смех", "страх", "мечта",
    "робот", "ракета", "спутник", "лазер", "мотор"
];

// Состояние игры
let currentWord = "";
let guessedLetters = new Set();
let wrongCount = 0;
let gameOver = false;
const maxWrong = 6;

// Элементы DOM
const wordDisplay = document.getElementById("wordDisplay");
const errorCount = document.getElementById("errorCount");
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalWord = document.getElementById("modalWord");
const modalPlayAgain = document.getElementById("modalPlayAgain");
const lifeDots = document.querySelectorAll(".life-dot");
const screamer = document.getElementById("screamer");
const thankYou = document.getElementById("thankYou");
const keyboardInput = document.getElementById("keyboardInput");

// Инициализация игры
function initGame() {
    currentWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
    guessedLetters.clear();
    wrongCount = 0;
    gameOver = false;
    updateWordDisplay();
    updateErrorCount();
    resetLifeDots();
    updateHangman();
    hideModal();
    // Сброс скримера и надписи
    if (screamer) {
        screamer.style.display = "none";
        screamer.style.opacity = "0";
    }
    if (thankYou) {
        thankYou.style.display = "none";
        thankYou.style.opacity = "0";
    }
    const app = document.querySelector(".app");
    if (app) {
        app.style.opacity = "1";
    }
    // Очищаем скрытое поле ввода
    if (keyboardInput) {
        keyboardInput.value = "";
    }
}

// Отображение слова
function updateWordDisplay() {
    const display = currentWord
        .split("")
        .map(letter => (guessedLetters.has(letter) ? letter : "_"))
        .join(" ");
    wordDisplay.textContent = display;
}

// Счётчик ошибок
function updateErrorCount() {
    errorCount.textContent = `Ошибки: ${wrongCount} из ${maxWrong}`;
}

// Сброс индикаторов жизней
function resetLifeDots() {
    lifeDots.forEach(dot => dot.classList.remove("lost"));
}

// Обновление индикаторов жизней
function updateLifeDots() {
    lifeDots.forEach((dot, index) => {
        if (index < wrongCount) {
            dot.classList.add("lost");
        } else {
            dot.classList.remove("lost");
        }
    });
}

// Обработка ввода буквы (общая функция)
function guessLetter(letter) {
    if (gameOver) return;
    letter = letter.toLowerCase();
    if (!/^[а-яё]$/.test(letter)) return;
    if (guessedLetters.has(letter)) return;

    guessedLetters.add(letter);

    if (currentWord.includes(letter)) {
        updateWordDisplay();
        checkWin();
    } else {
        wrongCount++;
        updateErrorCount();
        updateLifeDots();
        updateHangman();
        checkLose();
    }
}

// Обработчик ввода из скрытого поля (для мобильной клавиатуры)
if (keyboardInput) {
    keyboardInput.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase();
        if (/^[а-яё]$/.test(val)) {
            guessLetter(val);
        }
        e.target.value = "";
        // Возвращаем фокус для продолжения ввода
        setTimeout(() => {
            if (!gameOver) keyboardInput.focus();
        }, 50);
    });
}

// Проверка победы
function checkWin() {
    const allGuessed = currentWord.split("").every(letter => guessedLetters.has(letter));
    if (allGuessed) {
        gameOver = true;
        const app = document.querySelector(".app");
        if (app) {
            app.style.opacity = "0";
            app.style.transition = "opacity 0.5s ease";
        }
        setTimeout(() => {
            if (thankYou) {
                thankYou.style.display = "flex";
                thankYou.style.opacity = "1";
            }
            setTimeout(() => {
                if (thankYou) {
                    thankYou.style.display = "none";
                    thankYou.style.opacity = "0";
                }
                if (app) {
                    app.style.opacity = "1";
                }
                initGame();
            }, 3000);
        }, 1000);
    }
}

// Проверка проигрыша
function checkLose() {
    if (wrongCount >= maxWrong) {
        gameOver = true;
        const app = document.querySelector(".app");
        if (app) {
            app.style.transition = "none";
            app.style.opacity = "0";
        }
        if (screamer) {
            screamer.style.display = "block";
            screamer.style.opacity = "1";
        }
        // Воспроизведение звука скримера
        try {
            const audio = new Audio("fsdsdfhh_gain (mp3cut.net).mp3");
            audio.play().catch(e => console.log("Audio play error:", e));
        } catch (e) {
            console.log("Audio error:", e);
        }
        setTimeout(() => {
            if (screamer) {
                screamer.style.display = "none";
                screamer.style.opacity = "0";
            }
            if (app) {
                app.style.opacity = "1";
            }
            initGame();
        }, 4000);
    }
}

// Показ модального окна
function showModal(title, subtitle, word) {
    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;
    modalWord.textContent = word;
    modalOverlay.classList.add("active");
    modalOverlay.setAttribute("aria-hidden", "false");
}

// Скрытие модального окна
function hideModal() {
    modalOverlay.classList.remove("active");
    modalOverlay.setAttribute("aria-hidden", "true");
}

// Фокус на скрытое поле при клике на страницу (для мобильной клавиатуры)
document.addEventListener("click", () => {
    if (!gameOver && keyboardInput) {
        keyboardInput.focus();
    }
});

// Обработчик физической клавиатуры
window.addEventListener("keydown", (e) => {
    if (gameOver) return;
    const key = e.key.toLowerCase();
    // Игнорируем служебные клавиши
    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;
    if (!/^[а-яё]$/.test(key)) return;
    guessLetter(key);
});

// Кнопка "Играть снова"
modalPlayAgain.addEventListener("click", initGame);

// Старт игры
initGame();
