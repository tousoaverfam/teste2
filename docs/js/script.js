let zIndexCounter = 1;
const endpointURL = 'https://script.google.com/macros/s/AKfycbyUaJQbRh56JZFjSW6NLJ9mZanCq5ghCnyc-vWiZtI/dev'; // atualiza se mudares

function scrollToSection(id) {
  const section = document.getElementById(id);
  section.scrollIntoView({ behavior: "smooth" });
}

function addItem() {
  const input = document.getElementById("alimentoInput");
  const value = input.value.trim();
  if (value === "") return;

  // Adiciona visualmente o item
  const container = document.getElementById("alimentosContainer");
  const tag = document.createElement("div");
  tag.className = "tag";
  tag.innerHTML = `
    <span>${value}</span>
    <button class="remove-btn" onclick="removeItem(this)">−</button>
  `;

  const tagWidth = 160;
  const tagHeight = 50;
  let x = Math.random() * (container.clientWidth - tagWidth);
  let y = Math.random() * (container.clientHeight - tagHeight);
  tag.style.left = `${x}px`;
  tag.style.top = `${y}px`;
  tag.style.zIndex = zIndexCounter++;

  let offsetX = 0, offsetY = 0;
  let velocityX = 0, velocityY = 0;
  let isDragging = false;
  let lastX = 0, lastY = 0;

  function onMove(e) {
    if (!isDragging) return;
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    const dx = clientX - lastX;
    const dy = clientY - lastY;

    velocityX = dx;
    velocityY = dy;

    let newX = clientX - container.getBoundingClientRect().left - offsetX;
    let newY = clientY - container.getBoundingClientRect().top - offsetY;

    newX = Math.max(0, Math.min(container.clientWidth - tag.offsetWidth, newX));
    newY = Math.max(0, Math.min(container.clientHeight - tag.offsetHeight, newY));

    tag.style.left = `${newX}px`;
    tag.style.top = `${newY}px`;

    lastX = clientX;
    lastY = clientY;
  }

  function endDrag() {
    isDragging = false;
    tag.classList.remove("dragging");
    animateInertia(tag, velocityX, velocityY, container);
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", endDrag);
  }

  function startDrag(e) {
    isDragging = true;
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    const rect = tag.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    lastX = clientX;
    lastY = clientY;

    tag.classList.add("dragging");
    tag.style.zIndex = zIndexCounter++;

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", endDrag);
  }

  tag.addEventListener("mousedown", startDrag);
  tag.addEventListener("touchstart", startDrag, { passive: false });
  tag.ondragstart = () => false;

  container.appendChild(tag);
  input.value = "";

  // 🔁 Enviar para o Google Sheets
  fetch(endpointURL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ alimento: value }),
  }).catch((error) => {
    console.error("Erro ao enviar para Sheets:", error);
  });
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
