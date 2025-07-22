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
  const tagWidth = 160;
  const tagHeight = 50;
  const x = Math.random() * (container.clientWidth - tagWidth);
  const y = Math.random() * (container.clientHeight - tagHeight);
  tag.style.left = `${x}px`;
  tag.style.top = `${y}px`;

  // Tornar arrastável
  tag.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const shiftX = e.clientX - tag.getBoundingClientRect().left;
    const shiftY = e.clientY - tag.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      const containerRect = container.getBoundingClientRect();
      let newX = pageX - containerRect.left - shiftX;
      let newY = pageY - containerRect.top - shiftY;

      // Limites
      newX = Math.max(0, Math.min(container.clientWidth - tag.offsetWidth, newX));
      newY = Math.max(0, Math.min(container.clientHeight - tag.offsetHeight, newY));

      tag.style.left = `${newX}px`;
      tag.style.top = `${newY}px`;
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", onMouseMove);
    }, { once: true });
  });

  tag.ondragstart = () => false;

  container.appendChild(tag);
  input.value = "";
}

function removeItem(btn) {
  const tag = btn.parentElement;
  tag.remove();
}
