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
      if (!this.holdingPaper) return;

      // Capture mouse/touch position
      if (isMobile) {
        this.mouseX = e.touches[0].clientX;
        this.mouseY = e.touches[0].clientY;
      } else {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      }

      // Calculate velocity
      if (!this.rotating) {
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      // Calculate rotation angle
      const dirX = this.mouseX - this.mouseTouchX;
      const dirY = this.mouseY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY) || 1; // Avoid division by zero
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (!this.rotating) {
        // Update position
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      // Apply transform
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;

      // Update previous position for next frame
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
    });

    paper.addEventListener(startEvent, (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (isMobile) {
        this.mouseTouchX = e.touches[0].clientX;
        this.mouseTouchY = e.touches[0].clientY;
      } else {
        this.mouseTouchX = e.clientX;
        this.mouseTouchY = e.clientY;

        if (e.button === 2) { // Right-click to rotate
          this.rotating = true;
        }
      }

      // Set starting previous mouse/touch position
      this.prevMouseX = this.mouseTouchX;
      this.prevMouseY = this.mouseTouchY;
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

