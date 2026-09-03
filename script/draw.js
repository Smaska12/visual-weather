const mainCard = document.querySelector('.main-card');
const canvas = document.querySelector('.visual-weather');
const ctx = canvas.getContext('2d');

const numberOfDrops = [50, 100, 200];
let drops = []

const numberOfClouds = [5, 10, 20];
let clouds = [];

let sun = null;
let thunderstorm = null;

const numberOfFog = [20, 30];
let fog = [];

const numberOfSnow = [50, 100, 150];
let snows = [];

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

function initSun(weathercode) {
    const sunCodesFull = [0];
    const sunCodesPartial = [1];

    if (sunCodesFull.includes(weathercode)) {
        sun = {
            x: canvas.width * 0.5,
            y: canvas.height * 0.2,
            radius: 100,
            opacity: 1,
            angle: 0
        };
        return;
    }

    if (sunCodesPartial.includes(weathercode)) {
        sun = {
            x: canvas.width * 0.5,
            y: canvas.height * 0.2,
            radius: 100,
            opacity: 0.7,
            angle: 0
        };
        return;
    }

    sun = null;
}

function initFog(weathercode) {
    const fogCodesLow = [45]
    const fogCodesHigh = [48]

    let count = 0;

    if (fogCodesLow.includes(weathercode)) {
        count = numberOfFog[0];
    }
    if (fogCodesHigh.includes(weathercode)) {
        count = numberOfFog[1];
    }
    fog = Array.from( {length: count}, () => ({
        x: Math.random() * canvas.width,
        y: canvas.height * (0.4 + Math.random() * 0.5),
        width: Math.random() * 200 + 150,
        height: Math.random() * 40 + 40,
        speed: Math.random() * 0.2 + 0.1,
        opacity: Math.random() * 0.1 + 0.05
    }))
}

function initSnow(weathercode) {
    const snowCodesLow = [71, 85];
    const snowCodesMedium = [73];
    const snowCodesHigh = [75, 77, 86];

    let count = 0;
    let radiusRange = [1, 3];
    let speedRange = [1, 2];

    if (snowCodesLow.includes(weathercode)) {
        count = numberOfSnow[0];
        radiusRange = [1, 3];
        speedRange = [1, 2];
    }
    if (snowCodesMedium.includes(weathercode)) {
        count = numberOfSnow[1];
        radiusRange = [2, 4];
        speedRange = [2, 3];
    }
    if (snowCodesHigh.includes(weathercode)) {
        count = numberOfSnow[2];
        radiusRange = [3, 5];
        speedRange = [3, 4];
    }
    snows = Array.from( {length: count}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * (radiusRange[1] - radiusRange[0]) + radiusRange[0],
        speed: Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0],
        opacity: Math.random() * 0.5 + 0.1,
        angle: (Math.random() * 30 - 15) * Math.PI / 180
    }));
}

function initThunderstorm(weathercode) {
    const thunderstormCodes = [95, 96, 99];

    if (!thunderstormCodes.includes(weathercode)) {
        thunderstorm = null;
        return
    }

    let intervalRange = [7000, 12000];

    if (weathercode === 95) intervalRange = [7000, 12000];
    if (weathercode === 96) intervalRange = [5000, 9000];
    if (weathercode === 99) intervalRange = [3000, 6000];
    thunderstorm = {
        intervalRange,
        nextFlashAt: performance.now() + randomBetween(intervalRange[0], intervalRange[1]),
        flashOpacity: 0,
        bolt: null,
        boltVisibleUntil: 0
    };
}
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
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

    drawSun();
    drawClouds();
    drawRain();
    drawFog();
    drawSnow();
    drawThunderstorm();

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

function drawSun() {
    if (!sun) return;
 
    sun.angle += 0.001;
 
    ctx.save();

    const glow = ctx.createRadialGradient(
        sun.x, sun.y, sun.radius * 0.3,
        sun.x, sun.y, sun.radius * 2.2
    );
    glow.addColorStop(0, `rgba(255, 214, 102, ${sun.opacity * 0.5})`);
    glow.addColorStop(1, 'rgba(255, 214, 102, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 214, 102, ${sun.opacity * 0.6})`;
    ctx.lineWidth = 3;
    const rayCount = 8;
    for (let i = 0; i < rayCount; i++) {
        const rayAngle = sun.angle + (i / rayCount) * Math.PI * 2;
        const innerR = sun.radius * 1.5;
        const outerR = sun.radius * 2.5;
        ctx.beginPath();
        ctx.moveTo(
            sun.x + Math.cos(rayAngle) * innerR,
            sun.y + Math.sin(rayAngle) * innerR
        );
        ctx.lineTo(
            sun.x + Math.cos(rayAngle) * outerR,
            sun.y + Math.sin(rayAngle) * outerR
        );
        ctx.stroke();
    }

    ctx.fillStyle = `rgba(255, 224, 130, ${sun.opacity})`;
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fill();
 
    ctx.restore();
}

function drawFog() {
    fog.forEach(patch => {
        patch.x += patch.speed;

        if (patch.x > canvas.width + patch.width) {
            patch.x = -patch.width;
            patch.y = canvas.height * (0.4 + Math.random() * 0.5);
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${patch.opacity})`;
        ctx.beginPath();
        ctx.roundRect(
            patch.x,
            patch.y + 20,
            patch.width,
            100,
            15
        );

        ctx.fill();
    });
}

function drawSnow() {
    snows.forEach(snow => {
        snow.x += Math.sin(snow.angle) * snow.speed;
        snow.y += Math.cos(snow.angle) * snow.speed;

        if (snow.y > canvas.height) {
            snow.y = -snow.radius;
            snow.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(
            snow.x,
            snow.y,
            snow.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(253, 253, 253, ${snow.opacity})`;
        ctx.fill();
    });
}

function drawThunderstorm() {
    if (!thunderstorm) return;

    const now = performance.now();

    if (now >= thunderstorm.nextFlashAt) {
        thunderstorm.flashOpacity = 1;
        thunderstorm.bolt = generateLightningBolt();
        thunderstorm.boltVisibleUntil = now + 150;

        thunderstorm.nextFlashAt = now + randomBetween(
            thunderstorm.intervalRange[0],
            thunderstorm.intervalRange[1]
        );
    }

    if (thunderstorm.flashOpacity > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${thunderstorm.flashOpacity * 0.3})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        thunderstorm.flashOpacity -= 0.04;
        if (thunderstorm.flashOpacity < 0) thunderstorm.flashOpacity = 0;
    }

    if (thunderstorm.bolt && now < thunderstorm.boltVisibleUntil) {
        drawLightningBolt(thunderstorm.bolt);
    } else {
        thunderstorm.bolt = null;
    }
}

function generateLightningBolt() {
    const startX = Math.random() * canvas.width;
    const targetY = canvas.height * (0.5 + Math.random() * 0.4);
    const segments = 8;

    const points = [{ x: startX, y: 0 }];
    let x = startX;
    let y = 0;

    for (let i = 0; i < segments; i++) {
        x += (Math.random() - 0.5) * 60;
        y += targetY / segments;
        points.push({ x, y });
    }

    return points;
}

function drawLightningBolt(points) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(180, 200, 255, 0.8)';
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();
}

draw()