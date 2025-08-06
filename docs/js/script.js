function addItem() {
  const input = document.getElementById("alimentoInput");
  const value = input.value.trim();
  if (value === "") return;

  // Enviar para o Google Sheets via Apps Script
  fetch('https://script.google.com/macros/s/AKfycbyrzThm54njpfjR4nuD7AaYa5uxlNrrtJD757xOmC-y5YNoqqgt3N1mhH0LZABgS8KtrQ/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `alimento=${encodeURIComponent(value)}`
  })
  .then(response => response.text())
  .then(text => {
    console.log(text); // para debug
    if (text.includes('Adicionado com sucesso')) {
      // Se sucesso, adiciona localmente na UI
      addLocalTag(value);
      input.value = "";
    } else {
      alert('Erro ao adicionar alimento no servidor: ' + text);
    }
  })
  .catch(err => {
    alert('Erro de rede: ' + err);
  });
}

function addLocalTag(value) {
  const container = document.getElementById("alimentosContainer");

  const tag = document.createElement("div");
  tag.className = "tag";
  tag.innerHTML = `
    <span>${value}</span>
    <button class="remove-btn" onclick="removeItem(this)">−</button>
  `;

  // Podes adaptar para posicionar como no teu código original
  tag.style.position = 'relative';
  tag.style.margin = '5px';

  container.appendChild(tag);
}
