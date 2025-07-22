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

  // Posição aleatória dentro do container
  const tagWidth = 150;
  const tagHeight = 50;
  const x = Math.floor(Math.random() * (container.clientWidth - tagWidth));
  const y = Math.floor(Math.random() * (container.clientHeight - tagHeight));
  tag.style.left = `${x}px`;
  tag.style.top = `${y}px`;

  // Tornar arrastável
  let offsetX, offsetY;

  tag.onmousedown = function (e) {
    e.preventDefault();
    const rect = tag.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    function moveAt(pageX, pageY) {
      const containerRect = container.getBoundingClientRect();
      const newX = pageX - containerRect.left - offsetX;
      const newY = pageY - containerRect.top - offsetY;
      tag.style.left = `${Math.max(0, Math.min(container.clientWidth - tag.offsetWidth, newX))}px`;
      tag.style.top = `${Math.max(0, Math.min(container.clientHeight - tag.offsetHeight, newY))}px`;
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    document.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      document.onmouseup = null;
    };
  };

  tag.ondragstart = () => false;

  container.appendChild(tag);
  input.value = "";
}

function removeItem(btn) {
  const tag = btn.parentElement;
  tag.remove();
}
