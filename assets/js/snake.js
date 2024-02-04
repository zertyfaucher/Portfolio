const terrain = document.getElementById('terrain');
const ctx = terrain.getContext('2d');
const baliseRecord = document.getElementById('record');
const jeuElement = document.getElementById('jeu');
terrain.width = 400;
terrain.height = 400;

let snake = [{ x: 200, y: 200 }];
let pomme = { x: 300, y: 300 };
let dx = 0;
let dy = 0;
const tCase = 20;
let point = 0;
let record = 0;
let gameOver = false;

// Images pour la tête et le corps du serpent
const teteImage = new Image();
teteImage.src = './assets/img/PortFolio-6/tete.png';

const corpImage = new Image();
corpImage.src = './assets/img/PortFolio-6/corp.png';
// Image pour la pomme
const pommeImage = new Image();
pommeImage.src = './assets/img/PortFolio-6/pomme.png';

// Chargement des images avant de commencer le jeu
teteImage.onload = function () {
    corpImage.onload = function () {
        pommeImage.onload = jeu;
    };
};

const startBouton = document.getElementById('startBouton');
startBouton.addEventListener('click', startGame);

let imagesLoaded = 0; // Compteur pour les images chargées
const totalImages = 3; // Nombre total d'images à charger

// Vérification si toutes les images sont chargées
function checkAllImagesLoaded() {
    if (imagesLoaded === totalImages) {
        startBouton.disabled = false;
    }
}

// Chargement des images avec la vérification
teteImage.onload = () => {
    imagesLoaded++;
    checkAllImagesLoaded();
};

corpImage.onload = () => {
    imagesLoaded++;
    checkAllImagesLoaded();
};

pommeImage.onload = () => {
    imagesLoaded++;
    checkAllImagesLoaded();
};

function startGame() {
    startBouton.style.display = 'none';
    terrain.style.display = 'block';
    baliseRecord.style.display = 'none';
    jeuElement.style.marginTop = '4%';

    // Réinitialisation du jeu
    snake = [{ x: 200, y: 200 }];
    pomme = { x: 300, y: 300 }; // Réinitialisation de la position de la pomme
    dx = 0;
    dy = 0;
    point = 0; // Réinitialisation des points
    gameOver = false;

    jeu(); // Démarrage du jeu
}

function endGame() {
    startBouton.style.display = 'block'; // Affiche le bouton
    terrain.style.display = 'none'; // Masque le canvas
    gameOver = true; // Mise à jour de l'état du jeu
    if (record < point) { // affiche le record de la personne
        record = point;
        updateRecord();
    }
    baliseRecord.style.display = 'block'; // Affiche le score
    point = 0; // Réinitialisation des points
    jeuElement.style.marginTop = '25%';
}

function updateRecord() {
    document.getElementById('record').textContent = 'Votre meilleur score : ' + record;
}

function update() {
    if (gameOver) return; // Ne pas mettre à jour si le jeu est terminé

    // Ajout d'un nouveau morceau en fonction de la direction
    let MorceauSerpen = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Vérifie si la tête du serpent touche un bord
    if (MorceauSerpen.x < 0 || MorceauSerpen.x >= terrain.width || MorceauSerpen.y < 0 || MorceauSerpen.y >= terrain.height) {
        // Afficher "jeu perdu" et réinitialise le jeu
        alert('Jeu perdu !' + '\n' + 'Score : ' + point);
        endGame();
        return;
    }

    // Vérifie si la tête du serpent touche une partie de son corps
    if (collisionSurSerpent()) {
        // Afficher "jeu perdu" et réinitialise le jeu
        alert('Jeu perdu ! Collision avec le corps du serpent.' + '\n' + 'Score : ' + point);
        endGame();
        return;
    }

    // Ajoute un nouveau morceau en fonction de la direction
    snake.unshift(MorceauSerpen);

    // Vérifie si le serpent a mangé une pomme
    if (snake[0].x === pomme.x && snake[0].y === pomme.y) {
        // Génére une nouvelle pomme qui n'est pas sur le serpent
        generePomme();
        point++;
    } else {
        // Enleve la dernière partie du serpent
        snake.pop();
    }
}

function collisionSurSerpent() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true; // Collision détectée
        }
    }
    return false;
}


function generePomme() {
    // Génère une nouvelle position pour la pomme
    pomme = {
        x: Math.floor(Math.random() * (terrain.width / tCase)) * tCase,
        y: Math.floor(Math.random() * (terrain.height / tCase)) * tCase,
    };

    // Vérifie si la nouvelle position de la pomme est sur le serpent
    while (pommeSurSerpent()) {
        pomme = {
            x: Math.floor(Math.random() * (terrain.width / tCase)) * tCase,
            y: Math.floor(Math.random() * (terrain.height / tCase)) * tCase,
        };
    }
}

function pommeSurSerpent() {
    // Vérifie si la nouvelle position de la pomme est sur le serpent
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === pomme.x && snake[i].y === pomme.y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, terrain.width, terrain.height);

    // Dessine le corps du serpent
    for (let i = 1; i < snake.length; i++) {
        Corp(snake[i], i);
    }

    // Dessine la tête du serpent avec la bonne orientation
    Tete();

    // Dessine la pomme
    ctx.drawImage(pommeImage, pomme.x, pomme.y, tCase, tCase);
}

function Corp(bodyPart, index) {
    ctx.save();
    ctx.translate(bodyPart.x + tCase / 2, bodyPart.y + tCase / 2);

    // Utilise la rotation en fonction de la direction de la pièce du corps
    if (index < snake.length - 1) {
        const dx = snake[index + 1].x - bodyPart.x;
        const dy = snake[index + 1].y - bodyPart.y;
        ctx.rotate(Math.atan2(dy, dx));
    } else {
        // Utilise la rotation par défaut si c'est la dernière pièce du corps
        ctx.rotate(rotationTete());
    }

    ctx.drawImage(corpImage, -tCase / 2, -tCase / 2, tCase, tCase);
    ctx.restore();
}

function Tete() {
    // Utilise la rotation pour orienter la tête en fonction de la direction
    ctx.save();
    ctx.translate(snake[0].x + tCase / 2, snake[0].y + tCase / 2);
    ctx.rotate(rotationTete());
    ctx.drawImage(teteImage, -tCase / 2, -tCase / 2, tCase, tCase);
    ctx.restore();
}

function rotationTete() {
    // Calcule angle de rotation en fonction de la direction du serpent
    if (dx === tCase) {
        return Math.PI; // serpent vers la droite
    } else if (dx === -tCase) {
        return 0; // serpent a gauche par defaut
    } else if (dy === tCase) {
        return Math.PI / -2; // serpent vers le bas
    } else if (dy === -tCase) {
        return Math.PI / 2; // serpent vers le haut
    }
}

function jeu() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(jeu, 100);
    }
}

let peuxChangerDirection = true;

document.addEventListener('keydown', (e) => {
    // Vérifie si le changement de direction est autorisé
    if (!peuxChangerDirection) {
        return;
    }

    // Désactive la possibilité de changer de direction pendant 0.085 seconde (evite le retour en arriere)
    peuxChangerDirection = false;
    setTimeout(() => {
        peuxChangerDirection = true;
    }, 85);

    // Change la direction en fonction de la touche appuyée
    if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -tCase;
    }
    if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = tCase;
    }
    if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -tCase;
        dy = 0;
    }
    if (e.key === 'ArrowRight' && dx === 0) {
        dx = tCase;
        dy = 0;
    }
});