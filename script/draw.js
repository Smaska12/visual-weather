const mainCard = document.querySelector('.main-card');
const canvas = document.querySelector('.visual-weather');
const ctx = canvas.getContext('2d');

const numberOfDrops = [50, 100, 200];
let drops = []

const numberOfClouds = [5, 10, 20];
let clouds = [];

function initRain(weathercode) {
    const rainCodesLow = [51, 56, 61, 66, 80];
    const rainCodesMedium = [53, 63, 81];
    const rainCodesHigh = [55, 57, 65, 67];

    let count = 0;
    let radiusRange = [1, 3];
    let speedRange = [2, 3];

    if (rainCodesLow.includes(weathercode)) {
        count = numberOfDrops[0];
        radiusRange = [1, 3];
        speedRange = [2, 3];
    }
    if (rainCodesMedium.includes(weathercode)) {
        count = numberOfDrops[1];
        radiusRange = [2, 4];
        speedRange = [3, 5];
    }
    if (rainCodesHigh.includes(weathercode)) {
        count = numberOfDrops[2];
        radiusRange = [3, 5];
        speedRange = [5, 8];
    }
    drops = Array.from( {length: count}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * (radiusRange[1] - radiusRange[0]) + radiusRange[0],
        speed: Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0]
    }));
}

function initClouds(weathercode) {
    const cloudCodesLow = [1, 61, 66, 80, 95];
    const cloudCodesMedium = [2, 63, 81, 96];
    const cloudCodesHigh = [3, 57, 65, 67, 82, 99];

    let count = 0;

    if (cloudCodesLow.includes(weathercode)) {
        count = numberOfClouds[0];
    }
    if (cloudCodesMedium.includes(weathercode)) {
        count = numberOfClouds[1];
    }
    if (cloudCodesHigh.includes(weathercode)) {
        count = numberOfClouds[2];   
    }
    clouds = Array.from( {length: count}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.35,
        width: Math.random() * 60 + 80,
        height: Math.random() * 30 + 30,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.4
    }));
}

function resize() {
    const rect = mainCard.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}
resize();
window.addEventListener('resize', resize);


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawClouds();
    drawRain();

    requestAnimationFrame(draw);
}

function drawRain() {
    drops.forEach(drop => {
        drop.y += drop.speed;

        if (drop.y > canvas.height) {
            drop.y = -drop.radius;
            drop.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(
            drop.x,
            drop.y,
            drop.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = 'rgba(4, 81, 247, 0.5)';
        ctx.fill();
    });
}

function drawClouds() {
    clouds.forEach(cloud => {
        cloud.x += cloud.speed;

        if (cloud.x > canvas.width + cloud.width) {
            cloud.x = -cloud.width;
            cloud.y = Math.random() * canvas.height * 0.35;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
        ctx.beginPath();
        ctx.roundRect(
            cloud.x,
            cloud.y + 20,
            cloud.width,
            30,
            15
        );

        ctx.arc(
            cloud.x + cloud.width * 0.25,
            cloud.y + 25,
            25,
            0,
            Math.PI * 2
        );
        ctx.arc(
            cloud.x + cloud.width * 0.5,
            cloud.y + 10,
            35,
            0,
            Math.PI * 2
        );
        ctx.arc(
            cloud.x + cloud.width * 0.75,
            cloud.y + 25,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();
        
    });
}

draw()