const appShell = document.getElementById("appShell");
const collapseBtn = document.getElementById("collapseBtn");
const activeFlightsEl = document.getElementById("activeFlights");
const mineralReserveEl = document.getElementById("mineralReserve");
const fuelChartEl = document.getElementById("fuelChart");
const chartHintEl = document.getElementById("chartHint");
const missionTableBody = document.getElementById("missionTableBody");
const filterShipType = document.getElementById("filterShipType");
const filterStatus = document.getElementById("filterStatus");
const sortDistance = document.getElementById("sortDistance");
const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

collapseBtn.addEventListener("click", () => {
  appShell.classList.toggle("collapsed");
});

const shipTypes = ["Freighter", "Miner", "Scout", "Carrier", "Escort"];

const missions = [
  { code: "NB-103", type: "Freighter", status: "Yolda", distance: 43, origin: "Luna Port" },
  { code: "NB-304", type: "Miner", status: "İndi", distance: 12, origin: "Astra Belt" },
  { code: "NB-887", type: "Scout", status: "Yolda", distance: 85, origin: "Titan Relay" },
  { code: "NB-225", type: "Carrier", status: "İndi", distance: 21, origin: "Nova Prime" },
  { code: "NB-529", type: "Escort", status: "Yolda", distance: 64, origin: "Helios Dock" },
  { code: "NB-731", type: "Freighter", status: "İndi", distance: 30, origin: "Europa Hub" },
  { code: "NB-616", type: "Miner", status: "Yolda", distance: 57, origin: "Orion Wharf" },
  { code: "NB-194", type: "Scout", status: "İndi", distance: 9, origin: "Atlas Ring" },
  { code: "NB-445", type: "Carrier", status: "Yolda", distance: 74, origin: "Eon Station" },
  { code: "NB-978", type: "Escort", status: "İndi", distance: 16, origin: "Zenith Bay" },
  { code: "NB-267", type: "Freighter", status: "Yolda", distance: 51, origin: "Pulsar Gate" },
  { code: "NB-350", type: "Miner", status: "İndi", distance: 26, origin: "Kepler Post" },
];

function populateShipTypeFilter() {
  shipTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = `Gemi Tipi: ${type}`;
    filterShipType.append(option);
  });
}

function renderMissions() {
  const typeValue = filterShipType.value;
  const statusValue = filterStatus.value;
  const sortValue = sortDistance.value;

  let filtered = missions.filter((mission) => {
    const typeOk = typeValue === "all" || mission.type === typeValue;
    const statusOk = statusValue === "all" || mission.status === statusValue;
    return typeOk && statusOk;
  });

  if (sortValue === "asc") {
    filtered = [...filtered].sort((a, b) => a.distance - b.distance);
  } else if (sortValue === "desc") {
    filtered = [...filtered].sort((a, b) => b.distance - a.distance);
  }

  missionTableBody.innerHTML = "";

  filtered.forEach((mission) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${mission.code}</td>
      <td>${mission.type}</td>
      <td><span class="status-pill" data-status="${mission.status}">${mission.status}</span></td>
      <td>${mission.distance}</td>
      <td>${mission.origin}</td>
    `;
    missionTableBody.append(row);
  });
}

[filterShipType, filterStatus, sortDistance].forEach((control) => {
  control.addEventListener("change", renderMissions);
});

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateRealtimeStats() {
  const flights = randomInt(78, 186);
  const reserve = randomInt(2200, 9600);

  activeFlightsEl.textContent = flights.toLocaleString("tr-TR");
  mineralReserveEl.textContent = `${reserve.toLocaleString("tr-TR")} kt`;
}

const fuelData = [
  { sector: "S1", consumption: 62 },
  { sector: "S2", consumption: 45 },
  { sector: "S3", consumption: 80 },
  { sector: "S4", consumption: 53 },
  { sector: "S5", consumption: 71 },
  { sector: "S6", consumption: 66 },
  { sector: "S7", consumption: 39 },
];

function renderFuelChart() {
  fuelChartEl.innerHTML = "";
  const max = Math.max(...fuelData.map((x) => x.consumption));

  fuelData.forEach((item) => {
    const bar = document.createElement("div");
    const heightPercent = (item.consumption / max) * 100;

    bar.className = "bar";
    bar.style.height = `${heightPercent}%`;
    bar.dataset.label = item.sector;

    const tooltip = document.createElement("span");
    tooltip.className = "bar-tooltip";
    tooltip.textContent = `${item.sector}: ${item.consumption} birim`;

    bar.append(tooltip);

    bar.addEventListener("mouseenter", () => {
      chartHintEl.textContent = `${item.sector} yakıt tüketimi: ${item.consumption} birim`;
    });

    bar.addEventListener("mouseleave", () => {
      chartHintEl.textContent = "Sütunların üzerine gelin";
    });

    fuelChartEl.append(bar);
  });
}

function appendTerminalLine(text) {
  const line = document.createElement("p");
  line.textContent = `> ${text}`;
  terminalOutput.append(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleCommand(command) {
  const cmd = command.trim().toLowerCase();

  if (!cmd) {
    return;
  }

  appendTerminalLine(command);

  if (cmd === "/help") {
    appendTerminalLine("Komutlar: /help, /status, /missions, /clear");
  } else if (cmd === "/status") {
    appendTerminalLine(`Sistem nominal. ${activeFlightsEl.textContent} aktif sefer izleniyor.`);
  } else if (cmd === "/missions") {
    appendTerminalLine(`Görüntülenen görev sayısı: ${missionTableBody.children.length}`);
  } else if (cmd === "/clear") {
    terminalOutput.innerHTML = "";
    appendTerminalLine("Terminal temizlendi.");
  } else {
    appendTerminalLine("Bilinmeyen komut. /help yazın.");
  }
}

terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleCommand(terminalInput.value);
  terminalInput.value = "";
});

populateShipTypeFilter();
renderMissions();
updateRealtimeStats();
renderFuelChart();
setInterval(updateRealtimeStats, 5000);
