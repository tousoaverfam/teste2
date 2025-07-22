let zIndexCounter = 1;

function scrollToSection(id) {
  const section = document.getElementById(id);
  section.scrollIntoView({ behavior: "smooth" });
}

function addItem() {
  const input = document.getElementById("alimentoInput");
  const value = input.value.trim();
  if (value === "") return;

  const container = document.getElementById("alimentosContainer");

  const tag = document.createElement("div");
  tag.className = "tag";
  tag.innerHTML = `
    <span>${value}</span>
    <button class="remove-btn" onclick="removeItem(this)">−</button>
  `;

  const tagWidth = 160;
  const tagHeight = 50;
  const x = Math.random() * (container.clientWidth - tagWidth);
  const y = Math.random() * (container.clientHeight - tagHeight);
  tag.style.left = `${x}px`;
  tag.style.top = `${y}px`;
  tag.style.zIndex = zIndexCounter++;

  let offsetX = 0, offsetY = 0;
  let velocityX = 0, velocityY = 0;
  let isDragging = false;

  tag.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    const rect = tag.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    tag.classList.add("dragging");
    tag.style.zIndex = zIndexCounter++;

    let lastX = e.clientX;
    let lastY = e.clientY;

    function onMouseMove(e) {
      if (!isDragging) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      velocityX = dx;
      velocityY = dy;

      let newX = e.clientX - containerRect.left - offsetX;
      let newY = e.clientY - containerRect.top - offsetY;

      newX = Math.max(0, Math.min(container.clientWidth - tag.offsetWidth, newX));
      newY = Math.max(0, Math.min(container.clientHeight - tag.offsetHeight, newY));

      tag.style.left = `${newX}px`;
      tag.style.top = `${newY}px`;

      lastX = e.clientX;
      lastY = e.clientY;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      tag.classList.remove("dragging");
      animateInertia(tag, velocityX, velocityY, container);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  tag.ondragstart = () => false;
  container.appendChild(tag);
  input.value = "";
}

function removeItem(btn) {
  const tag = btn.parentElement;
  tag.remove();
}

function animateInertia(tag, vx, vy, container) {
  let friction = 0.95;
  let bounce = -0.6;

  function step() {
    let x = parseFloat(tag.style.left);
    let y = parseFloat(tag.style.top);

    vx *= friction;
    vy *= friction;

    x += vx;
    y += vy;

    const maxX = container.clientWidth - tag.offsetWidth;
    const maxY = container.clientHeight - tag.offsetHeight;

    if (x <= 0 || x >= maxX) {
      vx *= bounce;
      x = Math.max(0, Math.min(maxX, x));
    }

    if (y <= 0 || y >= maxY) {
      vy *= bounce;
      y = Math.max(0, Math.min(maxY, y));
    }

    tag.style.left = `${x}px`;
    tag.style.top = `${y}px`;

    if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
