const backgroundImages = [
    'https://i.pinimg.com/originals/86/25/49/8625497f2dc3c93b58f38365322b3d05.gif',
    'https://i.pinimg.com/originals/5a/a8/69/5aa869da340cbf31e3570f19ea3452a6.gif',
    'https://i.pinimg.com/originals/92/98/b8/9298b8aa90e9bc71a6162878ee24cbeb.gif',
    'https://i.pinimg.com/originals/e1/e7/a3/e1e7a33173d81a85444942e403bef217.gif',
    'https://i.pinimg.com/originals/3d/53/20/3d5320844e67f6285cf086f0442407d8.gif'
];

const bgGif = document.querySelector('.bg-gif');

function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    bgGif.src = backgroundImages[randomIndex];
}
setRandomBackground();