let lastX = 0;
let lastY = 0;

document.addEventListener(
  "mousemove",
  (e) => {
    const distanceMoved = Math.sqrt(
      (e.clientX - lastX) ** 2 + (e.clientY - lastY) ** 2,
    );
    const randomColor = Math.floor(Math.random() * 2 ** 24)
      .toString(16)
      .padStart(6, "0");
    const points = [];
    for (let i = 0; i < distanceMoved + 1; i += 3) {
      const ratio = i / distanceMoved;
      const x = lastX + ratio * (e.clientX - lastX);
      const y = lastY + ratio * (e.clientY - lastY);
      const point = document.createElement("div");
      point.style.width = "3px";
      point.style.height = "3px";
      point.style.position = "fixed";
      point.style.left = `${x}px`;
      point.style.top = `${y}px`;
      point.style.background = `#${randomColor}`;
      point.style.pointerEvents = "none";
      document.body.append(point);
      points.push(point);
    }

    lastX = e.clientX;
    lastY = e.clientY;

    let opacity = 1;
    const fade = () => {
      opacity -= 0.03;
      for (const point of points) {
        point.style.opacity = String(opacity);
      }
      if (opacity > 0) {
        requestAnimationFrame(fade);
      } else {
        for (const point of points) {
          point.remove();
        }
      }
    };
    requestAnimationFrame(fade);
  },
  { passive: true },
);
