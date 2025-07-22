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
  const containerRect = container.getBoundingClientRect();
  const tagWidth = 120;
  const tagHeight = 50;
  const x = Math.floor(Math.random() * (container.clientWidth - tagWidth));
  const y = Math.floor(Math.random() * (container.clientHeight - tagHeight));
  tag.style.left = `${x}px`;
  tag.style.top = `${y}px`;

  // Tornar arrastável
  tag.onmousedown = function (e) {
    e.preventDefault();
    let shiftX = e.clientX - tag.getBoundingClientRect().left;
    let shiftY = e.clientY - tag.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      tag.style.left = `${pageX - shiftX}px`;
      tag.style.top = `${pageY - shiftY}px`;
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    tag.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      tag.onmouseup = null;
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
