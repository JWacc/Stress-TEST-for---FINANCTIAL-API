const wave = document.querySelector('.wave');
const initialPath = "M0,192L20,192C40,192,80,192,120,176C160,160,200,128,240,112C280,96,320,96,360,85.3C400,75,440,53,480,69.3C520,85,560,139,600,149.3C640,160,680,128,720,144C760,160,800,224,840,245.3C880,267,920,245,960,224C1000,203,1040,181,1080,176C1120,171,1160,181,1200,160C1240,139,1280,85,1320,85.3C1360,85,1400,139,1420,165.3L1440,192L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z";
const targetPath = "M0,160L20,138.7C40,117,80,75,120,58.7C160,43,200,53,240,101.3C280,149,320,235,360,256C400,277,440,235,480,234.7C520,235,560,277,600,282.7C640,288,680,256,720,224C760,192,800,160,840,144C880,128,920,128,960,138.7C1000,149,1040,171,1080,176C1120,181,1160,171,1200,138.7C1240,107,1280,53,1320,42.7C1360,32,1400,64,1420,80L1440,96L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z";

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function animatePath(startPath, endPath, duration) {
    const startTime = performance.now();
    const numbers = startPath.split(/[\s,MLCZ]/).filter(n => n !== '').map(Number);
    const targetNumbers = endPath.split(/[\s,MLCZ]/).filter(n => n !== '').map(Number);

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = cubicBezier(0.25, 0.1, 0.25, 1)(progress);

        const currentNumbers = numbers.map((n, i) => lerp(n, targetNumbers[i], easedProgress));
        let index = 0;
        const newPath = startPath.replace(/(-?\d+\.?\d*)/g, () => currentNumbers[index++].toFixed(1));

        wave.setAttribute('d', newPath);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function cubicBezier(x1, y1, x2, y2) {
    return function(t) {
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;
        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;
        const ay = 1 - cy - by;
        const tSquared = t * t;
        const tCubed = tSquared * t;
        return ax * tCubed + bx * tSquared + cx * t;
    };
}

function animateWave() {
    animatePath(initialPath, targetPath, 3500);
    setTimeout(() => {
        animatePath(targetPath, initialPath, 3500);
    }, 3500);
}

animateWave();
setInterval(animateWave, 7000); 
document.addEventListener("DOMContentLoaded", function() {
    const image = document.querySelector('.about-us-image');
    const container = image.parentElement;

    container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = -(x - centerX) / 25;

        image.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        image.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
    });

    container.addEventListener('mouseleave', function() {
        image.style.transform = 'scale(1) rotateX(0) rotateY(0)';
        image.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
});

function onScroll() {
    const aboutUsText = document.querySelector('.about-us-text');
    const rect = aboutUsText.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top <= windowHeight - 300) {
        aboutUsText.classList.add('visible');
    }
}

document.addEventListener('scroll', onScroll);
document.addEventListener('DOMContentLoaded', onScroll); // Check if the element is visible on page load
