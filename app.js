const fieldLabels = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  title: "Title",
  seniority: "Seniority Level",
  companyName: "Company Name",
  industry: "Industry",
  country: "Country of Business",
  businessChallenge: "Business Challenge",
  objectives: "Objectives",
  audience: "Audience",
  deliveryTimeline: "Delivery Timeline",
  budget: "Budget",
  existingClient: "Are You An Existing Client?"
};

const wideSummaryFields = new Set(["businessChallenge", "objectives"]);

const seniorityOptions = [
  "Board Member",
  "C-Suite",
  "Director and Senior Director",
  "Director of Board",
  "General Manager",
  "Individual Contributor",
  "Manager and Senior Manager",
  "Owner and Family Business",
  "VP and SVP"
];

const industryOptions = [
  "Accounting",
  "Advertising and Marketing",
  "Aerospace and Defense",
  "Agriculture",
  "Automotive",
  "Banking and Financial Services",
  "Biotechnology",
  "Consulting",
  "Consumer Products",
  "Education",
  "Energy and Utilities",
  "Government and Public Sector",
  "Healthcare",
  "Hospitality and Tourism",
  "Insurance",
  "Legal Services",
  "Manufacturing",
  "Media and Entertainment",
  "Nonprofit",
  "Pharmaceuticals",
  "Professional Services",
  "Real Estate and Construction",
  "Retail and Ecommerce",
  "Technology and Software",
  "Telecommunications",
  "Transportation and Logistics",
  "Other"
];

const audienceOptions = [
  "Midlevel",
  "Upper-level",
  "Senior-level Executives"
];

const timelineOptions = [
  "In the next 0-6 months",
  "In the next 6+ months",
  "Not applicable",
  "Unsure at this time"
];

const budgetOptions = [
  "Under $100,000",
  "$100,000-$249,999",
  "$250,000-$499,999",
  "$500,000-$999,999",
  "$1,000,000+",
  "Budget not set",
  "Prefer not to say"
];

const existingClientOptions = ["Yes", "No"];

const countryCodes = [
  "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM",
  "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ",
  "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF",
  "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC",
  "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ",
  "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET",
  "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE",
  "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY",
  "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE",
  "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR",
  "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO",
  "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX",
  "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP",
  "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MK", "MP", "NO", "OM",
  "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR",
  "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC",
  "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI",
  "SB", "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH",
  "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR",
  "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU",
  "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"
];

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const selectConfig = {
  seniority: seniorityOptions,
  industry: industryOptions,
  country: countryCodes
    .map((code) => regionNames.of(code))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b)),
  audience: audienceOptions,
  deliveryTimeline: timelineOptions,
  budget: budgetOptions,
  existingClient: existingClientOptions
};

const form = document.querySelector("#opportunity-form");
const successView = document.querySelector("#success-view");
const formBand = document.querySelector("#intake");
const liveScoreNode = document.querySelector("#live-oqs-score");
const liveMeterNode = document.querySelector("#live-oqs-meter");
const liveTierNode = document.querySelector("#live-oqs-tier");
const scoreNode = document.querySelector("#oqs-score");
const meterNode = document.querySelector("#oqs-meter");
const tierNode = document.querySelector("#oqs-tier");
const summaryNode = document.querySelector("#submission-summary");
const newEntryButton = document.querySelector("#new-entry");
const storageKey = "cbseeCustomProgramSubmissions";
const feedbackStorageKey = "cbseeCustomProgramFeedback";
const reviewerStorageKey = "cbseeFeedbackReviewer";
const feedbackModeStorageKey = "cbseeFeedbackMode";
const reviewerNameNode = document.querySelector("#reviewer-name");
const feedbackModeToggle = document.querySelector("#feedback-mode-toggle");
const scoreBreakdownNodes = {
  seniority: document.querySelector("#score-seniority"),
  audience: document.querySelector("#score-audience"),
  timeline: document.querySelector("#score-timeline"),
  budget: document.querySelector("#score-budget"),
  client: document.querySelector("#score-client"),
  profile: document.querySelector("#score-profile"),
  detail: document.querySelector("#score-detail")
};

function populateSelect(id, options) {
  const select = document.getElementById(id);
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.append(placeholder);

  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    select.append(option);
  });
}

function getFormValues() {
  return {
    ...Object.fromEntries(Object.keys(fieldLabels).map((name) => [name, ""])),
    ...Object.fromEntries(new FormData(form).entries())
  };
}

function scoreTextDepth(value) {
  const length = value.trim().length;
  if (length >= 240) return 5;
  if (length >= 120) return 4;
  if (length >= 40) return 2;
  return 0;
}

function calculateOqs(values) {
  const seniorityScore = {
    "C-Suite": 18,
    "Board Member": 16,
    "VP and SVP": 14,
    "Owner and Family Business": 12,
    "Director of Board": 11,
    "General Manager": 10,
    "Director and Senior Director": 9,
    "Manager and Senior Manager": 5,
    "Individual Contributor": 2
  };

  const audienceScore = {
    "Senior-level Executives": 15,
    "Upper-level": 10,
    "Midlevel": 5
  };

  const timelineScore = {
    "In the next 0-6 months": 15,
    "In the next 6+ months": 8,
    "Unsure at this time": 3,
    "Not applicable": 0
  };

  const budgetScore = {
    "$1,000,000+": 18,
    "$500,000-$999,999": 14,
    "$250,000-$499,999": 10,
    "$100,000-$249,999": 6,
    "Under $100,000": 2,
    "Budget not set": 0,
    "Prefer not to say": 0
  };

  const breakdown = {
    seniority: seniorityScore[values.seniority] || 0,
    audience: audienceScore[values.audience] || 0,
    timeline: timelineScore[values.deliveryTimeline] || 0,
    budget: budgetScore[values.budget] || 0,
    client: values.existingClient === "Yes" ? 8 : values.existingClient === "No" ? 3 : 0,
    profile: 0,
    detail: 0
  };

  breakdown.profile += values.firstName.trim() ? 2 : 0;
  breakdown.profile += values.lastName.trim() ? 2 : 0;
  breakdown.profile += form.elements.email.validity.valid && values.email.trim() ? 2 : 0;
  breakdown.profile += values.title.trim() ? 2 : 0;
  breakdown.profile += values.companyName.trim() ? 2 : 0;
  breakdown.profile += values.industry ? 3 : 0;
  breakdown.profile += values.country ? 3 : 0;
  breakdown.detail += scoreTextDepth(values.businessChallenge);
  breakdown.detail += scoreTextDepth(values.objectives);

  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return {
    score: Math.min(100, Math.max(0, total)),
    breakdown
  };
}

function getTier(score) {
  if (score >= 85) return "Priority opportunity";
  if (score >= 70) return "Strong opportunity";
  if (score >= 55) return "Developing opportunity";
  return "Early qualification";
}

function updateScoreView(targets, result) {
  targets.score.textContent = String(result.score);
  targets.meter.style.width = `${result.score}%`;
  targets.tier.textContent = getTier(result.score);
}

function updateLiveScore() {
  const result = calculateOqs(getFormValues());

  updateScoreView({
    score: liveScoreNode,
    meter: liveMeterNode,
    tier: liveTierNode
  }, result);

  Object.entries(scoreBreakdownNodes).forEach(([key, node]) => {
    node.textContent = String(result.breakdown[key]);
  });
}

function renderSummary(values) {
  summaryNode.textContent = "";

  Object.entries(fieldLabels).forEach(([name, label]) => {
    const item = document.createElement("div");
    item.className = `summary-item${wideSummaryFields.has(name) ? " summary-item-wide" : ""}`;

    const term = document.createElement("dt");
    term.textContent = label;

    const value = document.createElement("dd");
    value.textContent = values[name] || "-";

    item.append(term, value);
    summaryNode.append(item);
  });
}

function showSuccess(values) {
  const result = calculateOqs(values);

  updateScoreView({
    score: scoreNode,
    meter: meterNode,
    tier: tierNode
  }, result);
  renderSummary(values);

  formBand.hidden = true;
  successView.hidden = false;
  successView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function savePrototypeSubmission(values) {
  const result = calculateOqs(values);
  const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const submission = {
    ...values,
    id: `local-${Date.now()}`,
    receivedAt: new Date().toISOString(),
    oqs: result.score,
    tier: getTier(result.score),
    status: result.score >= 85 ? "Prioritize" : result.score >= 70 ? "Discovery" : "Review",
    owner: "Unassigned"
  };

  localStorage.setItem(storageKey, JSON.stringify([submission, ...existing]));
}

function getStoredFeedback() {
  return JSON.parse(localStorage.getItem(feedbackStorageKey) || "[]");
}

function setStoredFeedback(records) {
  localStorage.setItem(feedbackStorageKey, JSON.stringify(records));
}

function getReviewerName() {
  return (reviewerNameNode.value || "").trim();
}

function setFeedbackMode(isOn) {
  document.body.classList.toggle("is-feedback-mode", isOn);
  feedbackModeToggle.setAttribute("aria-pressed", String(isOn));
  feedbackModeToggle.textContent = isOn ? "Feedback Mode On" : "Feedback Mode Off";
  localStorage.setItem(feedbackModeStorageKey, isOn ? "on" : "off");
}

function updateFeedbackButtonCounts() {
  const feedbackRecords = getStoredFeedback();
  document.querySelectorAll("[data-feedback-button]").forEach((button) => {
    const count = feedbackRecords.filter((record) => record.elementId === button.dataset.feedbackButton).length;
    button.textContent = count ? `Feedback ${count}` : "Feedback";
  });
}

function createDrawerField(labelText, inputNode) {
  const wrapper = document.createElement("label");
  wrapper.className = "drawer-field";
  const label = document.createElement("span");
  label.textContent = labelText;
  wrapper.append(label, inputNode);
  return wrapper;
}

function createSelect(name, options) {
  const select = document.createElement("select");
  select.name = name;
  select.required = true;

  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  });

  return select;
}

function buildFeedbackDrawer() {
  const drawer = document.createElement("aside");
  drawer.className = "feedback-drawer";
  drawer.hidden = true;
  drawer.setAttribute("aria-label", "Element feedback panel");

  const closeIconButton = document.createElement("button");
  closeIconButton.className = "drawer-close-button";
  closeIconButton.type = "button";
  closeIconButton.setAttribute("aria-label", "Close feedback panel");
  closeIconButton.textContent = "X";

  const title = document.createElement("h2");
  title.textContent = "Element Feedback";

  const targetLabel = document.createElement("p");
  targetLabel.className = "drawer-target";

  const form = document.createElement("form");
  form.id = "feedback-form";
  form.className = "feedback-form";

  const reviewer = document.createElement("input");
  reviewer.name = "reviewerName";
  reviewer.type = "text";
  reviewer.required = true;

  const importance = createSelect("importance", [
    ["1", "1 - Not useful"],
    ["2", "2 - Low value"],
    ["3", "3 - Useful"],
    ["4", "4 - Important"],
    ["5", "5 - Critical"]
  ]);

  const affectsOqs = createSelect("affectsOqs", [
    ["Yes", "Yes"],
    ["Maybe", "Maybe"],
    ["No", "No"]
  ]);

  const suggestedWeight = createSelect("suggestedWeight", [
    ["None", "No weight"],
    ["Low", "Low"],
    ["Medium", "Medium"],
    ["High", "High"],
    ["Critical", "Critical"]
  ]);

  const requiredPreference = createSelect("requiredPreference", [
    ["Required", "Required"],
    ["Optional", "Optional"],
    ["Conditional", "Conditional"],
    ["Unsure", "Unsure"]
  ]);

  const businessPurpose = createSelect("businessPurpose", [
    ["Qualification", "Qualification"],
    ["Prioritization", "Prioritization"],
    ["Routing", "Routing"],
    ["Proposal readiness", "Proposal readiness"],
    ["Faculty/program fit", "Faculty/program fit"],
    ["Relationship strategy", "Relationship strategy"],
    ["Not sure", "Not sure"]
  ]);

  const strongAnswerDefinition = document.createElement("textarea");
  strongAnswerDefinition.name = "strongAnswerDefinition";
  strongAnswerDefinition.rows = 4;

  const comment = document.createElement("textarea");
  comment.name = "comment";
  comment.rows = 4;

  const actions = document.createElement("div");
  actions.className = "drawer-actions";

  const saveButton = document.createElement("button");
  saveButton.className = "primary-button";
  saveButton.type = "submit";
  saveButton.textContent = "Save Feedback";

  const closeButton = document.createElement("button");
  closeButton.className = "secondary-button";
  closeButton.type = "button";
  closeButton.textContent = "Close";

  actions.append(saveButton, closeButton);
  form.append(
    createDrawerField("Reviewer", reviewer),
    createDrawerField("Importance", importance),
    createDrawerField("Should affect OQS?", affectsOqs),
    createDrawerField("Suggested weight", suggestedWeight),
    createDrawerField("Required preference", requiredPreference),
    createDrawerField("Business purpose", businessPurpose),
    createDrawerField("Strong answer definition", strongAnswerDefinition),
    createDrawerField("Comment", comment),
    actions
  );
  drawer.append(closeIconButton, title, targetLabel, form);
  document.body.append(drawer);

  closeIconButton.addEventListener("click", () => {
    drawer.hidden = true;
  });

  closeButton.addEventListener("click", () => {
    drawer.hidden = true;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const record = {
      id: `feedback-${Date.now()}`,
      reviewerName: form.elements.reviewerName.value.trim(),
      elementId: drawer.dataset.elementId,
      elementLabel: drawer.dataset.elementLabel,
      elementType: drawer.dataset.elementType,
      importance: Number(form.elements.importance.value),
      affectsOqs: form.elements.affectsOqs.value,
      suggestedWeight: form.elements.suggestedWeight.value,
      requiredPreference: form.elements.requiredPreference.value,
      businessPurpose: form.elements.businessPurpose.value,
      strongAnswerDefinition: form.elements.strongAnswerDefinition.value.trim(),
      comment: form.elements.comment.value.trim(),
      createdAt: new Date().toISOString()
    };

    if (!record.reviewerName) {
      form.elements.reviewerName.reportValidity();
      return;
    }

    reviewerNameNode.value = record.reviewerName;
    localStorage.setItem(reviewerStorageKey, record.reviewerName);
    setStoredFeedback([record, ...getStoredFeedback()]);
    updateFeedbackButtonCounts();
    form.reset();
    drawer.hidden = true;
  });

  return drawer;
}

const feedbackDrawer = buildFeedbackDrawer();

function openFeedbackDrawer(target) {
  const reviewerName = getReviewerName();
  feedbackDrawer.dataset.elementId = target.dataset.feedbackId;
  feedbackDrawer.dataset.elementLabel = target.dataset.feedbackLabel;
  feedbackDrawer.dataset.elementType = target.dataset.feedbackType;
  feedbackDrawer.querySelector(".drawer-target").textContent = target.dataset.feedbackLabel;
  feedbackDrawer.querySelector("[name='reviewerName']").value = reviewerName;
  feedbackDrawer.hidden = false;
  feedbackDrawer.querySelector("[name='importance']").focus();
}

function initializeFeedbackLayer() {
  reviewerNameNode.value = localStorage.getItem(reviewerStorageKey) || "";

  document.querySelectorAll("[data-feedback-id]").forEach((target) => {
    const button = document.createElement("button");
    button.className = "feedback-button";
    button.type = "button";
    button.dataset.feedbackButton = target.dataset.feedbackId;
    button.textContent = "Feedback";
    button.addEventListener("click", () => openFeedbackDrawer(target));
    target.append(button);
  });

  reviewerNameNode.addEventListener("input", () => {
    localStorage.setItem(reviewerStorageKey, getReviewerName());
  });

  feedbackModeToggle.addEventListener("click", () => {
    setFeedbackMode(!document.body.classList.contains("is-feedback-mode"));
  });

  setFeedbackMode(localStorage.getItem(feedbackModeStorageKey) === "on");
  updateFeedbackButtonCounts();
}

Object.entries(selectConfig).forEach(([id, options]) => {
  populateSelect(id, options);
});

form.addEventListener("input", updateLiveScore);
form.addEventListener("change", updateLiveScore);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const values = getFormValues();
  savePrototypeSubmission(values);
  showSuccess(values);
});

newEntryButton.addEventListener("click", () => {
  form.reset();
  updateLiveScore();
  successView.hidden = true;
  formBand.hidden = false;
  formBand.scrollIntoView({ behavior: "smooth", block: "start" });
});

updateLiveScore();
initializeFeedbackLayer();
