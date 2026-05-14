const feedbackStorageKey = "cbseeCustomProgramFeedback";

const bodyNode = document.querySelector("#feedback-body");
const searchNode = document.querySelector("#feedback-search");
const reviewerFilterNode = document.querySelector("#reviewer-filter");
const elementFilterNode = document.querySelector("#element-filter");
const emptyStateNode = document.querySelector("#feedback-empty-state");
const elementSummaryNode = document.querySelector("#element-summary");
const reviewerSummaryNode = document.querySelector("#reviewer-summary");
const importFileNode = document.querySelector("#import-file");
const metricNodes = {
  total: document.querySelector("#metric-feedback-total"),
  reviewers: document.querySelector("#metric-reviewers"),
  averageImportance: document.querySelector("#metric-avg-importance"),
  oqsYes: document.querySelector("#metric-oqs-yes")
};

function getStoredFeedback() {
  return JSON.parse(localStorage.getItem(feedbackStorageKey) || "[]");
}

function setStoredFeedback(records) {
  localStorage.setItem(feedbackStorageKey, JSON.stringify(records));
}

function getFeedbackRecords() {
  return getStoredFeedback().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function uniqueValues(records, key) {
  return [...new Set(records.map((record) => record[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function populateFilter(select, values, label) {
  const selectedValue = select.value || "all";
  select.textContent = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = label;
  select.append(allOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });

  select.value = values.includes(selectedValue) ? selectedValue : "all";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function createCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text || "-";
  if (className) cell.className = className;
  return cell;
}

function matchesFilters(record) {
  const query = searchNode.value.trim().toLowerCase();
  const reviewer = reviewerFilterNode.value;
  const element = elementFilterNode.value;
  const haystack = [
    record.reviewerName,
    record.elementLabel,
    record.elementType,
    record.affectsOqs,
    record.suggestedWeight,
    record.requiredPreference,
    record.businessPurpose,
    record.strongAnswerDefinition,
    record.comment
  ].join(" ").toLowerCase();

  if (query && !haystack.includes(query)) return false;
  if (reviewer !== "all" && record.reviewerName !== reviewer) return false;
  if (element !== "all" && record.elementLabel !== element) return false;
  return true;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function mostCommon(values) {
  const counts = values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
}

function renderMetrics(records) {
  const reviewers = uniqueValues(records, "reviewerName");
  metricNodes.total.textContent = String(records.length);
  metricNodes.reviewers.textContent = String(reviewers.length);
  metricNodes.averageImportance.textContent = average(records.map((record) => Number(record.importance))).toFixed(1);
  metricNodes.oqsYes.textContent = String(records.filter((record) => record.affectsOqs === "Yes").length);
}

function renderElementSummary(records) {
  const groups = records.reduce((acc, record) => {
    acc[record.elementLabel] = acc[record.elementLabel] || [];
    acc[record.elementLabel].push(record);
    return acc;
  }, {});

  elementSummaryNode.textContent = "";

  Object.entries(groups)
    .map(([label, items]) => ({
      label,
      count: items.length,
      avgImportance: average(items.map((item) => Number(item.importance))),
      topWeight: mostCommon(items.map((item) => item.suggestedWeight)),
      yesRate: Math.round((items.filter((item) => item.affectsOqs === "Yes").length / items.length) * 100)
    }))
    .sort((a, b) => b.avgImportance - a.avgImportance)
    .forEach((item) => {
      const row = document.createElement("div");
      row.className = "alignment-row";
      row.innerHTML = `
        <div>
          <strong></strong>
          <span></span>
        </div>
        <p></p>
      `;
      row.querySelector("strong").textContent = item.label;
      row.querySelector("span").textContent = `${item.count} responses`;
      row.querySelector("p").textContent = `${item.avgImportance.toFixed(1)} importance | ${item.topWeight} weight | ${item.yesRate}% OQS yes`;
      elementSummaryNode.append(row);
    });
}

function renderReviewerSummary(records) {
  const groups = records.reduce((acc, record) => {
    acc[record.reviewerName] = acc[record.reviewerName] || [];
    acc[record.reviewerName].push(record);
    return acc;
  }, {});

  reviewerSummaryNode.textContent = "";

  Object.entries(groups)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([reviewer, items]) => {
      const row = document.createElement("div");
      row.className = "alignment-row";
      row.innerHTML = `
        <div>
          <strong></strong>
          <span></span>
        </div>
        <p></p>
      `;
      row.querySelector("strong").textContent = reviewer;
      row.querySelector("span").textContent = `${items.length} responses`;
      row.querySelector("p").textContent = `${average(items.map((item) => Number(item.importance))).toFixed(1)} avg importance`;
      reviewerSummaryNode.append(row);
    });
}

function renderTable(records) {
  bodyNode.textContent = "";

  records.forEach((record) => {
    const row = document.createElement("tr");
    row.append(
      createCell(formatDate(record.createdAt), "nowrap"),
      createCell(record.reviewerName, "strong-cell nowrap"),
      createCell(record.elementLabel),
      createCell(record.elementType, "nowrap"),
      createCell(String(record.importance), "nowrap"),
      createCell(record.affectsOqs, "nowrap"),
      createCell(record.suggestedWeight, "nowrap"),
      createCell(record.requiredPreference, "nowrap"),
      createCell(record.businessPurpose, "nowrap"),
      createCell(record.strongAnswerDefinition, "long-cell"),
      createCell(record.comment, "long-cell")
    );
    bodyNode.append(row);
  });

  emptyStateNode.hidden = records.length > 0;
}

function render() {
  const allRecords = getFeedbackRecords();
  populateFilter(reviewerFilterNode, uniqueValues(allRecords, "reviewerName"), "All reviewers");
  populateFilter(elementFilterNode, uniqueValues(allRecords, "elementLabel"), "All elements");

  const visibleRecords = allRecords.filter(matchesFilters);
  renderMetrics(visibleRecords);
  renderElementSummary(visibleRecords);
  renderReviewerSummary(visibleRecords);
  renderTable(visibleRecords);
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  return `"${String(value || "").replaceAll('"', '""')}"`;
}

function exportVisibleJson() {
  const records = getFeedbackRecords().filter(matchesFilters);
  downloadFile("cbsee-feedback.json", JSON.stringify(records, null, 2), "application/json");
}

function exportVisibleCsv() {
  const records = getFeedbackRecords().filter(matchesFilters);
  const headers = [
    "createdAt",
    "reviewerName",
    "elementLabel",
    "elementType",
    "importance",
    "affectsOqs",
    "suggestedWeight",
    "requiredPreference",
    "businessPurpose",
    "strongAnswerDefinition",
    "comment"
  ];
  const rows = records.map((record) => headers.map((header) => csvEscape(record[header])).join(","));
  downloadFile("cbsee-feedback.csv", [headers.join(","), ...rows].join("\n"), "text/csv");
}

function importFeedback(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let imported = [];
    try {
      imported = JSON.parse(reader.result);
    } catch {
      return;
    }
    if (!Array.isArray(imported)) return;

    const localRecords = getStoredFeedback();
    const existingIds = new Set(localRecords.map((record) => record.id));
    const cleanImported = imported.filter((record) => record.id && !existingIds.has(record.id));
    setStoredFeedback([...cleanImported, ...localRecords]);
    render();
  };
  reader.readAsText(file);
}

searchNode.addEventListener("input", render);
reviewerFilterNode.addEventListener("change", render);
elementFilterNode.addEventListener("change", render);
document.querySelector("#export-json").addEventListener("click", exportVisibleJson);
document.querySelector("#export-csv").addEventListener("click", exportVisibleCsv);
document.querySelector("#import-json").addEventListener("click", () => importFileNode.click());
importFileNode.addEventListener("change", () => {
  if (importFileNode.files[0]) importFeedback(importFileNode.files[0]);
});

render();
