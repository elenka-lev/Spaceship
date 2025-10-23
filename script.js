const redBtn = document.getElementById("ship1");
const yellowBtn = document.getElementById("ship2");
const space = document.querySelector(".container");

let player;
//переходимо до ігрового екрану з вибраним кораблем
if (document.body.id === "select-page") { 
  yellowBtn.addEventListener("click", () => {
    localStorage.setItem("selectedShip", "yellow"); 
    window.location.href = "./game.html";            
  });
  redBtn.addEventListener("click", () => {
    localStorage.setItem("selectedShip", "red");
    window.location.href = "./game.html";
  });
}
//створюємо клас корабля
class Spaceship {
  constructor( width, height, container) {
    this.element = document.createElement('img');
    this.width = width;
    this.height = height;
    this.container = container;
    this.element.classList.add('ship');
    this.element.style.position = 'absolute';

    this.x = (container.offsetWidth - width) / 2;
    this.y = container.offsetHeight - height - 10;
    this.updatePosition();

    this.gun = null;
    this.container.appendChild(this.element);
  }
  //оновлюємо позицію корабля
    updatePosition() {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  //рухаємо корабель
  moveLeft(speed = 10) {
    this.x = Math.max(0, this.x - speed);
    this.updatePosition();
  }

  moveRight(speed = 10) {
    this.x = Math.min(this.container.offsetWidth - this.width, this.x + speed);
    this.updatePosition();
  }
}

class YellowShip extends Spaceship {
  constructor(container) {
    super(105, 96, container);
    this.element.src = './images/Quinjet-ship.png';
  }
}
class RedShip extends Spaceship {
  constructor(container) {
    super(100, 112, container);
    this.element.src = './images/Dreadnaught.png';
  }
}

//ініціалізуємо вибраний корабель на ігровому екрані

if (document.body.id === "game-page") {
  const selectedShip = localStorage.getItem("selectedShip");

  if (selectedShip === "yellow") {
    player = new YellowShip(space);
  } else if (selectedShip === "red") {
    player = new RedShip(space);
  }
}
  // управление клавіатурой
  let keys = {};

// отслеживаем нажатие клавиш
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    keys[e.key] = true;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    keys[e.key] = false;
  }
});

// основной игровой цикл движения корабля
function gameMove() {
  if (!player) return;

  if (keys['ArrowLeft']) player.moveLeft();
  if (keys['ArrowRight']) player.moveRight();

  requestAnimationFrame(gameMove);
}

gameMove();