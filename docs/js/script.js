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
  makeDraggable(tag);
  container.appendChild(tag);

  input.value = "";

  // Enviar para Google Sheets
  enviarParaSheets(value);
}

function removeItem(btn) {
  const tag = btn.parentElement;
  tag.remove();
}

function enviarParaSheets(alimento) {
  fetch("https://script.google.com/macros/s/AKfycbwpiiNwQkU-lIStF9RqVa8YzwAwX0jhkOl3bYsx4Q9iKovTNNTvj39YYRjh8AqZwHYq/exec", {
    method: "POST",
    mode: "no-cors", // Importante para evitar bloqueios de CORS
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ alimento: alimento }),
  })
  .then(() => {
    console.log("Alimento enviado com sucesso:", alimento);
  })
  .catch((error) => {
    console.error("Erro ao enviar o alimento:", error);
  });
}

// Código para arrastar (já existente no teu JS)
function makeDraggable(el) {
  el.style.position = "absolute";
  el.style.left = Math.random() * 80 + "%";
  el.style.top = Math.random() * 50 + "%";

  let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
  el.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    el.style.zIndex = Date.now(); // traz para a frente
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    posX = mouseX - e.clientX;
    posY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    el.style.top = (el.offsetTop - posY) + "px";
    el.style.left = (el.offsetLeft - posX) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
