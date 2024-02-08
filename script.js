const squares = document.querySelectorAll('.square');
const message = document.getElementById('message');
const startBtn = document.getElementById('start-btn');
const levelDisplay = document.getElementById('level');
const rankingBody = document.getElementById('ranking-body');
const divTable = document.querySelector('.table-container')
let sequence = [];
let userSequence = [];
let level = 1;
let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

// Generate a random sequence
function generateSequence() {
  sequence = [];
  for (let i = 0; i < level + 1; i++) {
    sequence.push(Math.floor(Math.random() * 4));
  }
}

// Show sequence to the user
async function showSequence() {
  for (let i = 0; i < sequence.length; i++) {
    await new Promise(resolve => {
      setTimeout(() => {
        animateSquare(sequence[i]);
        resolve();
      }, 1000);
    });
    await new Promise(resolve => {
      setTimeout(() => {
        resetSquare(sequence[i]);
        resolve();
      }, 1000);
    });
  }
}

// Animate a square
function animateSquare(index) {
  let scale = 1.2;
  let animation = squares[index].animate(
    { transform: `scale(${scale})` },
    { duration: 100 }
  );
  animation.onfinish = () => {
    squares[index].style.transform = `scale(${scale})`;
  };
}

// Reset a square
function resetSquare(index) {
  let scale = 1;
  let animation = squares[index].animate(
    { transform: `scale(${scale})` },
    { duration: 100 }
  );
  animation.onfinish = () => {
    squares[index].style.transform = `scale(${scale})`;
  };
}

// Check user input against sequence
function checkInput() {
  for (let i = 0; i < userSequence.length; i++) {
    if (userSequence[i] !== sequence[i]) {
      endGame();
      return;
    }
  }
  if (userSequence.length === sequence.length) {
    level++;
    levelDisplay.textContent = `Level: ${level}`;
    userSequence = [];
    generateSequence();
    showSequence();
  }
}

// End the game
function endGame() {
  rankingBody.style.display = 'flex';
  divTable.style.display = 'flex';
  message.textContent = 'Game Over!';
  startBtn.disabled = false;
  startBtn.textContent = 'Restart Game';
  ranking.push(level);
  ranking.sort((a, b) => b - a);
  if (ranking.length > 10) {
    ranking = ranking.slice(0, 10);
  }
  localStorage.setItem('ranking', JSON.stringify(ranking));
  updateRanking();
 
}

// Update ranking table
function updateRanking() {
  rankingBody.innerHTML = '';
  for (let i = 0; i < ranking.length; i++) {
    const row = document.createElement('tr');
    const rank = i + 1;
    const score = ranking[i];
    row.innerHTML = `<td>${rank}</td><td>${score}</td>`;
    rankingBody.appendChild(row);
  }
}

// Event listeners
startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  startBtn.textContent = 'Game in Progress';
  level = 1;
  levelDisplay.textContent = `Level: ${level}`;
  message.textContent = '';
  userSequence = [];
  generateSequence();
  showSequence();
  rankingBody.style.display = 'none';
  divTable.style.display = 'none';
});

squares.forEach(square => {
  square.addEventListener('click', () => {
    const index = parseInt(square.id);
    animateSquare(index);
    setTimeout(() => {
      resetSquare(index);
    }, 300);
    userSequence.push(index);
    checkInput();
  });
});

// const clearRankingBtn = document.getElementById('clear-ranking-btn');
// clearRankingBtn.addEventListener('click', () => {
//   localStorage.removeItem('ranking'); // Remove o ranking do armazenamento local
//   ranking = []; // Limpa o ranking na memória
//   updateRanking(); // Atualiza a exibição do ranking (será vazio após a limpeza)
// });

// Initialize ranking table
updateRanking();
