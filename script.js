const redBtn = document.getElementById("ship1");
const yellowBtn = document.getElementById("ship2");
const space = document.querySelector(".container");

let player;
let bullets = [];
let asteroids = [];

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
    this.shootInterval = setInterval(() => this.shoot(), 500); // стріляємо кожні 500 мс
    this.bulletSrc = "";
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

  //стріляємо з корабля
  shoot() {
    const bulletWidth = 10; 
    const bulletHeight = 44;
    const bulletX = this.x + this.element.offsetWidth / 2 - bulletWidth / 2; // центр пулі відносно корабля
    const bulletY = this.y - bulletHeight; // початкова позиція пулі над кораблем

    const newBullet = new Bullet(bulletX, bulletY, this.bulletSrc, this.container); // створюємо нову пулю
    bullets.push(newBullet);
    
  }
  
}

class YellowShip extends Spaceship {
  constructor(container) {
    super(105, 96, container);
    this.element.src = './images/Quinjet-ship.png';
    this.bulletSrc = './images/light.svg';
  }
}
class RedShip extends Spaceship {
  constructor(container) {
    super(100, 112, container);
    this.element.src = './images/Dreadnaught.png';
    this.bulletSrc = './images/red.svg';
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

//Додаємо клас для пулі
class Bullet {
  constructor(x, y, src, container, width = 20, height = 55) {
    this.element = document.createElement("img");
    this.x = x; 
    this.y = y;
    this.width = width;
    this.height = height;
    this.container = container;
    this.element.src = src;
    this.element.classList.add("bullet");
    this.element.style.position = "absolute";
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;

    container.appendChild(this.element);

    this.fly();
  }
  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
  }

  fly() {
    const moveBullet = () => {
      this.y -= 8; // змінюємо позицію пулі вгору
      this.updatePosition(); // оновлюємо DOM

      if (this.y < -50) {
        this.element.remove();
        return;
      }
      // this.element.style.top = `${currentY - 8}px`; // швидкість польоту пулі
      requestAnimationFrame(moveBullet);
    };
   requestAnimationFrame(moveBullet);
  }
  }
//створюємо клас для астероїда
class Asteroid {
  constructor(src, container, width = 80, height = 80) {
    this.element = document.createElement("img");
    this.x = Math.floor(Math.random() * (container.offsetWidth - width));
    this.y = 0;
    this.width = width;
    this.height = height;
    this.container = container;
    this.element.src = src;
    this.element.classList.add("asteroid");
    this.element.style.position = "absolute";
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
    this.x = Math.floor(Math.random() * (container.offsetWidth - width));
    this.y = 0;
    this.updatePosition();

    container.appendChild(this.element);
    this.fall();
  }
  updatePosition() {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
  }

  fall(speed = 3) {
    const moveAsteroid = () => {
      this.y += speed;
      this.updatePosition();

      if (this.y > this.container.offsetHeight) {
        this.element.remove();
        return;
      }

      requestAnimationFrame(moveAsteroid);
    };
    moveAsteroid();
  }
}
//створюємо астероїди періодично
setInterval(() => {
  const asteroid = new Asteroid("./images/planet-08.png", space);
  asteroids.push(asteroid);
}, 2000);

//робимо колізії пулі з астероїдами
function checkCollisions() {
  for (let b = bullets.length - 1; b >= 0; b--) {
    for (let a = asteroids.length - 1; a >= 0; a--) {
      const bullet = bullets[b];
      const asteroid = asteroids[a];

      if (
        bullet.x < asteroid.x + asteroid.width &&
        bullet.x + bullet.width > asteroid.x &&
        bullet.y < asteroid.y + asteroid.height &&
        bullet.y + bullet.height > asteroid.y
      ) {
        bullet.element.remove();
        asteroid.element.remove();
        bullets.splice(b, 1);
        asteroids.splice(a, 1);
      }
    }
  }

  requestAnimationFrame(checkCollisions);
}

checkCollisions();