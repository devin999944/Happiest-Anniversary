let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const startEvent = isMobile ? 'touchstart' : 'mousedown';
    const moveEvent = isMobile ? 'touchmove' : 'mousemove';
    const endEvent = isMobile ? 'touchend' : 'mouseup';

    document.addEventListener(moveEvent, (e) => {
      if (!this.rotating) {
        if (isMobile) {
          this.mouseX = e.touches[0].clientX;
          this.mouseY = e.touches[0].clientY;
        } else {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
        }

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = this.mouseX - this.mouseTouchX;
      const dirY = this.mouseY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg);
      }
    });

    paper.addEventListener(startEvent, (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (isMobile) {
        this.mouseTouchX = e.touches[0].clientX;
        this.mouseTouchY = e.touches[0].clientY;
        this.prevMouseX = this.mouseTouchX;
        this.prevMouseY = this.mouseTouchY;
      } else {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }

      if (e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener(endEvent, () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
