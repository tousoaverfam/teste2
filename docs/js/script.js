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

  // Tornar arrastável
  let offsetX, offsetY;

  tag.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const rect = tag.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    tag.style.zIndex = zIndexCounter++;

    function onMouseMove(e) {
      let newX = e.clientX - containerRect.left - offsetX;
      let newY = e.clientY - containerRect.top - offsetY;

      newX = Math.max(0, Math.min(container.clientWidth - tag.offsetWidth, newX));
      newY = Math.max(0, Math.min(container.clientHeight - tag.offsetHeight, newY));

      tag.style.left = `${newX}px`;
      tag.style.top = `${newY}px`;
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
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
