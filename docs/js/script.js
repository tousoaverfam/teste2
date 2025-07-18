function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

function addItem() {
  const input = document.getElementById("alimentoInput");
  const value = input.value.trim();
  if (value === "") return;

  const container = document.getElementById("alimentosContainer");

  const tag = document.createElement("div");
  tag.className = "tag";
  tag.innerHTML = `
    ${value}
    <button class="remove-btn" onclick="removeItem(this)">×</button>
  `;

  container.appendChild(tag);
  input.value = "";
}

function removeItem(btn) {
  const tag = btn.parentElement;
  tag.remove();
}
