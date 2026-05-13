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

  showSuccess(getFormValues());
});

newEntryButton.addEventListener("click", () => {
  form.reset();
  updateLiveScore();
  successView.hidden = true;
  formBand.hidden = false;
  formBand.scrollIntoView({ behavior: "smooth", block: "start" });
});

updateLiveScore();
