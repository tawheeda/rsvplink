// ===============================
// Utilities
// ===============================
const $ = (id) => document.getElementById(id);

function openOverlay(el) { el.classList.add("active"); }
function closeOverlay(el) { el.classList.remove("active"); }

// Mobile accordion: only one open at a time (per container)
function setupMobileAccordion(containerEl) {
  const detailsList = containerEl.querySelectorAll("details.player-accordion");
  detailsList.forEach((details) => {
    details.addEventListener("toggle", () => {
      const isMobileNow = window.matchMedia("(max-width: 768px)").matches;
      if (!isMobileNow || !details.open) return;
      detailsList.forEach((other) => {
        if (other !== details) other.removeAttribute("open");
      });
    });
  });
}

// ===============================
// Section Minimize / Expand
// ===============================
const golfBody = $("golfBody");
const galaBody = $("galaBody");
const golfMinibar = $("golfMinibar");
const galaMinibar = $("galaMinibar");

function minimizeGolf() {
  golfBody.classList.add("hidden");
  golfMinibar.classList.remove("hidden");
  $("toggleGolf").textContent = "Show";
}
function showGolf() {
  golfBody.classList.remove("hidden");
  golfMinibar.classList.add("hidden");
  $("toggleGolf").textContent = "Minimize";
}
function minimizeGala() {
  galaBody.classList.add("hidden");
  galaMinibar.classList.remove("hidden");
  $("toggleGala").textContent = "Show";
}
function showGala() {
  galaBody.classList.remove("hidden");
  galaMinibar.classList.add("hidden");
  $("toggleGala").textContent = "Minimize";
}

$("toggleGolf").addEventListener("click", () => {
  golfBody.classList.contains("hidden") ? showGolf() : minimizeGolf();
});
$("toggleGala").addEventListener("click", () => {
  galaBody.classList.contains("hidden") ? showGala() : minimizeGala();
});

document.querySelectorAll("[data-expand]").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.expand === "golf") showGolf();
    if (btn.dataset.expand === "gala") showGala();
  });
});

// ===============================
// THANK YOU MODAL
// ===============================
const thanksModal = $("thanksModal");
$("closeThanksBtn").addEventListener("click", () => closeOverlay(thanksModal));
thanksModal.addEventListener("click", (e) => {
  if (e.target === thanksModal) closeOverlay(thanksModal);
});

// ===============================
// GOLF RSVP
// ===============================
const golfModal = $("rsvpModal");
const closeGolfBtn = $("closeModal");
const changePackageBtn = $("changePackageBtn");

const packageSelect = $("packageSelect");
const packageSummary = $("packageSummary");
const playersContainer = $("playersContainer");

const companyFieldset = $("companyFieldset");
const companyName = $("companyName");
const vatNumber = $("vatNumber");

const wateringDietFieldset = $("wateringDietFieldset");
const wateringDiet1 = $("wateringDiet1");
const wateringDiet2 = $("wateringDiet2");
const wateringDietNotes1 = $("wateringDietNotes1");
const wateringDietNotes2 = $("wateringDietNotes2");

const packageFourballs = {
  main: 4,
  platinum: 3,
  gold: 2,
  silver: 2,
  goodie: 1,
  fourball: 1,
  watering: 0,
  "dinner-only": 0
};

function resetGolfModal() {
  packageSelect.value = "";
  playersContainer.innerHTML = "";
  packageSummary.classList.add("hidden");
  packageSummary.innerHTML = "";

  companyFieldset.classList.add("hidden");
  companyName.value = "";
  vatNumber.value = "";
  companyName.required = false;
  vatNumber.required = false;

  wateringDietFieldset.classList.add("hidden");
  wateringDiet1.value = "";
  wateringDiet2.value = "";
  wateringDietNotes1.value = "";
  wateringDietNotes2.value = "";
  wateringDiet1.required = false;
  wateringDiet2.required = false;

  // Reset Guest 2 visibility
  wateringDietFieldset.querySelectorAll(".mini-card")[1].style.display = "";
}

function closeGolfModal() {
  closeOverlay(golfModal);
  resetGolfModal();
}

closeGolfBtn.addEventListener("click", closeGolfModal);
golfModal.addEventListener("click", (e) => {
  if (e.target === golfModal) closeGolfModal();
});

changePackageBtn.addEventListener("click", () => {
  closeGolfModal();
  showGolf();
  document.querySelector("#golfSection").scrollIntoView({ behavior: "smooth" });
});

// Open golf modal
document.querySelectorAll("#golfSection .pkg .pkg-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const pkg = e.target.closest(".pkg").dataset.package;
    minimizeGala();
    showGolf();
    openOverlay(golfModal);
    packageSelect.value = pkg;
    packageSelect.dispatchEvent(new Event("change"));
  });
});

packageSelect.addEventListener("change", () => {
  const selected = packageSelect.value;
  playersContainer.innerHTML = "";

  companyFieldset.classList.add("hidden");
  wateringDietFieldset.classList.add("hidden");

  companyName.required = false;
  vatNumber.required = false;
  wateringDiet1.required = false;
  wateringDiet2.required = false;

  companyName.value = "";
  vatNumber.value = "";
  wateringDiet1.value = "";
  wateringDiet2.value = "";
  wateringDietNotes1.value = "";
  wateringDietNotes2.value = "";

  // Watering Hole
  if (selected === "watering") {
    companyFieldset.classList.remove("hidden");
    companyName.required = true;
    vatNumber.required = true;

    wateringDietFieldset.classList.remove("hidden");
    wateringDiet1.required = true;
    wateringDiet2.required = true;
    return;
  }

  // Dinner Only (Prize Giving)
  if (selected === "dinner-only") {
    wateringDietFieldset.classList.remove("hidden");
    wateringDiet1.required = true;
    wateringDietFieldset.querySelectorAll(".mini-card")[1].style.display = "none";
    return;
  }

  // Players for golf packages
  const totalPlayers = (packageFourballs[selected] || 0) * 4;
  if (!totalPlayers) return;

  for (let i = 1; i <= totalPlayers; i++) {
    playersContainer.innerHTML += `
      <details class="player-accordion" ${i === 1 ? "open" : ""}>
        <summary>Player ${i}</summary>
        <div class="player-inner">
          <input type="text" placeholder="Full Name" required />
          <select required>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input type="tel" placeholder="Phone Number" required />
          <input type="email" placeholder="Email Address" required />
          <select required>
            <option value="">Shirt Size</option>
            <option>XS</option><option>S</option><option>M</option>
            <option>L</option><option>XL</option><option>XXL</option>
          </select>
          <input type="text" placeholder="Bottom Size" required />
          <input type="text" placeholder="Glove Size" required />
          <select required>
            <option value="">Glove Hand</option>
            <option>Left</option>
            <option>Right</option>
          </select>
          <select required>
            <option value="">Dietary Requirement</option>
            <option>None</option>
            <option>Halaal</option>
            <option>Kosher</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Gluten-Free</option>
            <option>Other</option>
          </select>
          <input type="text" placeholder="Dietary notes (optional)" />
        </div>
      </details>
    `;
  }

  setupMobileAccordion(playersContainer);
});

$("rsvpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  closeGolfModal();
  openOverlay(thanksModal);
});

// ===============================
// GALA RSVP
// ===============================
const galaModal = $("galaModal");
const closeGalaBtn = $("closeGalaModal");
const changeGalaBtn = $("changeGalaBtn");

const tableType = $("tableType");
const tableQty = $("tableQty");
const galaGuests = $("galaGuests");

const galaTableLimits = {
  platinum: 3,
  gold: 5,
  silver: 6
};

function resetGalaModal() {
  tableType.value = "";
  tableQty.innerHTML = `<option value="">Number</option>`;
  galaGuests.innerHTML = "";
}

function closeGalaModal() {
  closeOverlay(galaModal);
  resetGalaModal();
}

closeGalaBtn.addEventListener("click", closeGalaModal);
galaModal.addEventListener("click", (e) => {
  if (e.target === galaModal) closeGalaModal();
});

changeGalaBtn.addEventListener("click", () => {
  closeGalaModal();
  showGala();
  document.querySelector("#galaSection").scrollIntoView({ behavior: "smooth" });
});

// Open gala modal
document.querySelectorAll("#galaSection .pkg .pkg-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const tier = e.target.closest(".pkg").dataset.gala;
    minimizeGolf();
    showGala();
    openOverlay(galaModal);
    tableType.value = tier;
    tableType.dispatchEvent(new Event("change"));
  });
});

// Table / Seat selector
tableType.addEventListener("change", () => {
  galaGuests.innerHTML = "";
  tableQty.innerHTML = "";

  const tier = tableType.value;
  if (!tier) return;

  // Single Ticket logic
  if (tier === "single-ticket") {
    tableQty.innerHTML = `<option value="">Number of Seats</option>`;
    for (let i = 1; i <= 5; i++) {
      tableQty.innerHTML += `<option value="${i}">${i} Seat${i > 1 ? "s" : ""}</option>`;
    }
    return;
  }

  tableQty.innerHTML = `<option value="">Number of Tables</option>`;
  const max = galaTableLimits[tier] || 0;
  for (let i = 1; i <= max; i++) {
    tableQty.innerHTML += `<option value="${i}">${i} Table${i > 1 ? "s" : ""}</option>`;
  }
});

tableQty.addEventListener("change", () => {
  galaGuests.innerHTML = "";

  const qty = parseInt(tableQty.value || 0);
  if (!qty) return;

  const tier = tableType.value;
  const totalGuests = tier === "single-ticket" ? qty : qty * 10;

  for (let i = 1; i <= totalGuests; i++) {
    galaGuests.innerHTML += `
      <details class="player-accordion" ${i === 1 ? "open" : ""}>
        <summary>Guest ${i}</summary>
        <div class="player-inner">
          <input type="text" placeholder="Guest Name" required />
          <select required>
            <option value="">Dietary Requirement</option>
            <option>None</option>
            <option>Halaal</option>
            <option>Kosher</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Gluten-Free</option>
            <option>Other</option>
          </select>
          <input type="text" placeholder="Dietary notes (optional)" />
        </div>
      </details>
    `;
  }

  setupMobileAccordion(galaGuests);
});

$("galaForm").addEventListener("submit", (e) => {
  e.preventDefault();
  closeGalaModal();
  openOverlay(thanksModal);
});
