const mainCard = document.querySelector('.main-card');
const canvas = document.querySelector('.visual-weather');
const ctx = canvas.getContext('2d');

const numberOfDrops = [50, 100, 200];
let drops = []

function initRain(weathercode) {
    const rainCodesLow = [51, 56, 61, 66, 80];
    const rainCodesMedium = [53, 63, 81];
    const rainCodesHigh = [55, 57, 65, 67];

    if (rainCodesLow.includes(weathercode)) {
        drops = Array.from( {length: numberOfDrops[0]}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 3 + 2
        }));
    }
    if (rainCodesMedium.includes(weathercode)) {
        drops = Array.from( {length: numberOfDrops[1]}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 4 + 2,
            speed: Math.random() * 5 + 3
        }));
    }
    if (rainCodesHigh.includes(weathercode)) {
        drops = Array.from( {length: numberOfDrops[2]}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 3,
            speed: Math.random() * 8 + 5
        }));
    }
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

    requestAnimationFrame(draw);
}

draw()