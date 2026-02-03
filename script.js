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
      if (!isMobileNow) return;
      if (!details.open) return;
      detailsList.forEach((other) => {
        if (other !== details) other.removeAttribute("open");
      });
    });
  });
}

// Minimize / maximize sections (easy access)
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
  if (golfBody.classList.contains("hidden")) showGolf(); else minimizeGolf();
});
$("toggleGala").addEventListener("click", () => {
  if (galaBody.classList.contains("hidden")) showGala(); else minimizeGala();
});
document.querySelectorAll("[data-expand]").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.expand === "golf") showGolf();
    if (btn.dataset.expand === "gala") showGala();
  });
});

// ===============================
// THANK YOU POPUP
// ===============================
const thanksModal = $("thanksModal");
$("closeThanksBtn").addEventListener("click", () => closeOverlay(thanksModal));
thanksModal.addEventListener("click", (e) => { if (e.target === thanksModal) closeOverlay(thanksModal); });

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

// Four-balls per package
const packageFourballs = {
  main: 4,
  platinum: 3,
  gold: 2,
  silver: 2,
  goodie: 1,
  fourball: 1,
  watering: 0
};

// Package summary bullets (also used as “what you get” messaging)
const packageDetails = {
  main: {
    title: "Main Sponsor",
    bullets: [
      "16 golfers (4 Four-Balls)",
      "Gala dinner table for 8",
      "Premium event branding & recognition",
      "Top-tier exposure across platforms"
    ]
  },
  platinum: {
    title: "Platinum Sponsor",
    bullets: [
      "12 golfers (3 Four-Balls)",
      "Gala dinner table for 8",
      "High-visibility branding opportunities",
      "Premium sponsor recognition"
    ]
  },
  gold: {
    title: "Gold Sponsor",
    bullets: [
      "8 golfers (2 Four-Balls)",
      "Gala dinner table for 8",
      "Brand presence at key touchpoints",
      "Sponsor recognition"
    ]
  },
  silver: {
    title: "Silver Sponsor",
    bullets: [
      "8 golfers (2 Four-Balls)",
      "On-day branding opportunities",
      "Sponsor acknowledgment"
    ]
  },
  goodie: {
    title: "Goodie Bag Sponsor",
    bullets: [
      "4 golfers (1 Four-Ball)",
      "Gala dinner table for 4",
      "Branded presence via goodie bags"
    ]
  },
  fourball: {
    title: "Four-Ball Only",
    bullets: [
      "4 golfers (1 Four-Ball)",
      "Dinner table for 4"
    ]
  },
  watering: {
    title: "Watering Hole Sponsor",
    bullets: [
      "A watering hole to activate and share marketing collateral",
      "1 × Gala dinner table for 2",
      "Branding on the putting greens",
      "Branding across communication platforms building up to the event",
      "Branding on the day of the event",
      "1 × Watering Hole"
    ]
  }
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
}

function closeGolfModal() {
  closeOverlay(golfModal);
  resetGolfModal();
}

closeGolfBtn.addEventListener("click", closeGolfModal);
golfModal.addEventListener("click", (e) => { if (e.target === golfModal) closeGolfModal(); });

// Change package: close modal + scroll back to golf section
changePackageBtn.addEventListener("click", () => {
  closeGolfModal();
  showGolf();
  document.querySelector("#golfSection").scrollIntoView({ behavior: "smooth" });
});

// Open golf modal when clicking any golf package card button
document.querySelectorAll("#golfSection .pkg .pkg-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".pkg");
    const selectedPackage = card.dataset.package;

    // Minimize other section (easy access via minibar)
    minimizeGala();
    showGolf();

    openOverlay(golfModal);
    packageSelect.value = selectedPackage;
    packageSelect.dispatchEvent(new Event("change"));
  });
});

packageSelect.addEventListener("change", () => {
  const selected = packageSelect.value;
  playersContainer.innerHTML = "";

  // Summary
  const details = packageDetails[selected];
  if (details) {
    packageSummary.classList.remove("hidden");
    packageSummary.innerHTML = `
      <h4>${details.title} — What you get</h4>
      <ul>${details.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
    `;
  } else {
    packageSummary.classList.add("hidden");
    packageSummary.innerHTML = "";
  }

  // Hide special sections by default
  companyFieldset.classList.add("hidden");
  companyName.required = false;
  vatNumber.required = false;

  wateringDietFieldset.classList.add("hidden");
  wateringDiet1.required = false;
  wateringDiet2.required = false;

  // Clear values
  companyName.value = "";
  vatNumber.value = "";
  wateringDiet1.value = "";
  wateringDiet2.value = "";
  wateringDietNotes1.value = "";
  wateringDietNotes2.value = "";

  // Watering Hole: company + dietary for 2 guests, NO players
  if (selected === "watering") {
    companyFieldset.classList.remove("hidden");
    companyName.required = true;
    vatNumber.required = true;

    wateringDietFieldset.classList.remove("hidden");
    wateringDiet1.required = true;
    wateringDiet2.required = true;

    return;
  }

  // Players for other packages
  const fourballs = packageFourballs[selected] || 0;
  const totalPlayers = fourballs * 4;
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

// Submit handler (Golf) -> Thank you popup
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

// Limits: Platinum 3, Gold 5, Silver 7 total but 1 sold => 6 available
const galaTableLimits = {
  platinum: 3,
  gold: 5,
  silver: 6
};

function resetGalaModal() {
  tableType.value = "";
  tableQty.innerHTML = `<option value="">Number of Tables</option>`;
  galaGuests.innerHTML = "";
}

function closeGalaModal() {
  closeOverlay(galaModal);
  resetGalaModal();
}

closeGalaBtn.addEventListener("click", closeGalaModal);
galaModal.addEventListener("click", (e) => { if (e.target === galaModal) closeGalaModal(); });

// Change table: close modal + scroll to gala section
changeGalaBtn.addEventListener("click", () => {
  closeGalaModal();
  showGala();
  document.querySelector("#galaSection").scrollIntoView({ behavior: "smooth" });
});

// Open gala modal from tiles (preselect table type)
document.querySelectorAll("#galaSection .pkg .pkg-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".pkg");
    const tier = card.dataset.gala;

    // Minimize other section (easy access via minibar)
    minimizeGolf();
    showGala();

    openOverlay(galaModal);
    tableType.value = tier;
    tableType.dispatchEvent(new Event("change"));
  });
});

// When table type changes -> rebuild qty options
tableType.addEventListener("change", () => {
  galaGuests.innerHTML = "";
  tableQty.innerHTML = `<option value="">Number of Tables</option>`;

  const tier = tableType.value;
  if (!tier) return;

  const max = galaTableLimits[tier] || 0;
  for (let i = 1; i <= max; i++) {
    tableQty.innerHTML += `<option value="${i}">${i} Table${i > 1 ? "s" : ""}</option>`;
  }
});

// When qty changes -> generate 10 guests per table
tableQty.addEventListener("change", () => {
  galaGuests.innerHTML = "";

  const qty = parseInt(tableQty.value || 0);
  if (!qty) return;

  const totalGuests = qty * 10;

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

// Submit handler (Gala) -> Thank you popup
$("galaForm").addEventListener("submit", (e) => {
  e.preventDefault();
  closeGalaModal();
  openOverlay(thanksModal);
});
