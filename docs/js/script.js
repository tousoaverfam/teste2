function addItem() {
  const input = document.getElementById("alimentoInput");
  const value = input.value.trim();
  if (value === "") return;

  // Enviar para Google Sheets via fetch
  fetch('https://script.google.com/macros/s/AKfycbyrzThm54njpfjR4nuD7AaYa5uxlNrrtJD757xOmC-y5YNoqqgt3N1mhH0LZABgS8KtrQ/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `alimento=${encodeURIComponent(value)}`
  });

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
}
