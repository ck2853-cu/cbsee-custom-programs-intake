const storageKey = "cbseeCustomProgramSubmissions";

const mockSubmissions = [
  {
    id: "mock-001",
    receivedAt: "2026-05-13T14:18:00-04:00",
    firstName: "Alyssa",
    lastName: "Chen",
    email: "alyssa.chen@example.com",
    title: "Chief People Officer",
    seniority: "C-Suite",
    companyName: "Northstar BioSystems",
    industry: "Biotechnology",
    country: "United States",
    businessChallenge: "The executive team is preparing for a major operating model shift after rapid growth. They need a common leadership language for decision quality, cross-functional execution, and leading through ambiguity.",
    objectives: "Build alignment among senior leaders, improve enterprise decision making, and prepare a group of high-potential leaders to lead strategic transformation across business units.",
    audience: "Senior-level Executives",
    deliveryTimeline: "In the next 0-6 months",
    budget: "$500,000-$999,999",
    existingClient: "Yes",
    status: "Prioritize",
    owner: "M. Rivera"
  },
  {
    id: "mock-002",
    receivedAt: "2026-05-12T10:42:00-04:00",
    firstName: "Marcus",
    lastName: "Wells",
    email: "marcus.wells@example.com",
    title: "SVP, Enterprise Strategy",
    seniority: "VP and SVP",
    companyName: "Apex Retail Group",
    industry: "Retail and Ecommerce",
    country: "United Kingdom",
    businessChallenge: "Apex is redesigning its customer experience and wants regional leaders to accelerate digital commerce adoption while managing margin pressure.",
    objectives: "Create a custom learning journey for regional general managers focused on digital strategy, customer analytics, and profitable growth.",
    audience: "Upper-level",
    deliveryTimeline: "In the next 0-6 months",
    budget: "$250,000-$499,999",
    existingClient: "No",
    status: "Discovery",
    owner: "T. Shah"
  },
  {
    id: "mock-003",
    receivedAt: "2026-05-10T16:06:00-04:00",
    firstName: "Priya",
    lastName: "Menon",
    email: "priya.menon@example.com",
    title: "Director, Leadership Development",
    seniority: "Director and Senior Director",
    companyName: "HelioGrid Energy",
    industry: "Energy and Utilities",
    country: "India",
    businessChallenge: "The company is moving from project-led growth to platform-led growth and needs leaders to collaborate across engineering, finance, and commercial teams.",
    objectives: "Develop upper-level leaders who can influence without authority, manage stakeholder tradeoffs, and connect innovation investments to business outcomes.",
    audience: "Upper-level",
    deliveryTimeline: "In the next 6+ months",
    budget: "$100,000-$249,999",
    existingClient: "No",
    status: "Nurture",
    owner: "S. Kim"
  },
  {
    id: "mock-004",
    receivedAt: "2026-05-09T09:31:00-04:00",
    firstName: "Daniel",
    lastName: "Rossi",
    email: "daniel.rossi@example.com",
    title: "Board Member",
    seniority: "Board Member",
    companyName: "Meridian Family Holdings",
    industry: "Professional Services",
    country: "Italy",
    businessChallenge: "The next generation of family business leaders is preparing for expanded governance responsibility and more complex portfolio decisions.",
    objectives: "Design an executive program on governance, ownership transitions, strategic capital allocation, and leading family enterprise change.",
    audience: "Senior-level Executives",
    deliveryTimeline: "Unsure at this time",
    budget: "$250,000-$499,999",
    existingClient: "Yes",
    status: "Discovery",
    owner: "L. Bennett"
  },
  {
    id: "mock-005",
    receivedAt: "2026-05-07T13:55:00-04:00",
    firstName: "Nora",
    lastName: "Alvarez",
    email: "nora.alvarez@example.com",
    title: "Manager, Talent Programs",
    seniority: "Manager and Senior Manager",
    companyName: "CivicBridge Partners",
    industry: "Nonprofit",
    country: "United States",
    businessChallenge: "The organization wants to strengthen management fundamentals for a distributed group of new people managers.",
    objectives: "Provide a practical management development experience focused on communication, coaching, and team accountability.",
    audience: "Midlevel",
    deliveryTimeline: "In the next 6+ months",
    budget: "Under $100,000",
    existingClient: "No",
    status: "Review",
    owner: "Unassigned"
  }
];

const bodyNode = document.querySelector("#submissions-body");
const searchNode = document.querySelector("#submission-search");
const priorityNode = document.querySelector("#priority-filter");
const emptyStateNode = document.querySelector("#empty-state");
const metricNodes = {
  total: document.querySelector("#metric-total"),
  priority: document.querySelector("#metric-priority"),
  average: document.querySelector("#metric-average"),
  fast: document.querySelector("#metric-fast")
};

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

  const profile =
    (values.firstName ? 2 : 0) +
    (values.lastName ? 2 : 0) +
    (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? 2 : 0) +
    (values.title ? 2 : 0) +
    (values.companyName ? 2 : 0) +
    (values.industry ? 3 : 0) +
    (values.country ? 3 : 0);

  const total =
    (seniorityScore[values.seniority] || 0) +
    (audienceScore[values.audience] || 0) +
    (timelineScore[values.deliveryTimeline] || 0) +
    (budgetScore[values.budget] || 0) +
    (values.existingClient === "Yes" ? 8 : values.existingClient === "No" ? 3 : 0) +
    profile +
    scoreTextDepth(values.businessChallenge || "") +
    scoreTextDepth(values.objectives || "");

  return Math.min(100, Math.max(0, total));
}

function getTier(score) {
  if (score >= 85) return "Priority opportunity";
  if (score >= 70) return "Strong opportunity";
  if (score >= 55) return "Developing opportunity";
  return "Early qualification";
}

function getSubmissions() {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  return [...saved, ...mockSubmissions].map((submission) => {
    const oqs = submission.oqs || calculateOqs(submission);
    return {
      ...submission,
      oqs,
      tier: submission.tier || getTier(oqs)
    };
  });
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

function createScoreCell(submission) {
  const cell = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = `oqs-badge ${submission.oqs >= 85 ? "is-priority" : submission.oqs >= 70 ? "is-strong" : ""}`;
  badge.textContent = submission.oqs;
  badge.title = submission.tier;
  cell.append(badge);
  return cell;
}

function createStatusCell(status) {
  const cell = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = "status-badge";
  badge.textContent = status || "Review";
  cell.append(badge);
  return cell;
}

function renderMetrics(submissions) {
  const average = Math.round(submissions.reduce((sum, item) => sum + item.oqs, 0) / submissions.length);
  metricNodes.total.textContent = String(submissions.length);
  metricNodes.priority.textContent = String(submissions.filter((item) => item.oqs >= 85).length);
  metricNodes.average.textContent = String(average || 0);
  metricNodes.fast.textContent = String(submissions.filter((item) => item.deliveryTimeline === "In the next 0-6 months").length);
}

function matchesFilters(submission) {
  const query = searchNode.value.trim().toLowerCase();
  const priority = priorityNode.value;
  const haystack = [
    submission.companyName,
    submission.firstName,
    submission.lastName,
    submission.email,
    submission.title,
    submission.industry,
    submission.country,
    submission.businessChallenge,
    submission.objectives,
    submission.owner,
    submission.status
  ].join(" ").toLowerCase();

  if (query && !haystack.includes(query)) return false;
  if (priority === "priority" && submission.oqs < 85) return false;
  if (priority === "strong" && submission.oqs < 70) return false;
  return true;
}

function renderTable() {
  const submissions = getSubmissions().sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
  const visibleSubmissions = submissions.filter(matchesFilters);

  renderMetrics(submissions);
  bodyNode.textContent = "";

  visibleSubmissions.forEach((submission) => {
    const row = document.createElement("tr");
    const contact = `${submission.firstName} ${submission.lastName}`;
    row.append(
      createCell(formatDate(submission.receivedAt), "nowrap"),
      createScoreCell(submission),
      createStatusCell(submission.status),
      createCell(submission.owner, "nowrap"),
      createCell(submission.companyName, "strong-cell"),
      createCell(contact, "nowrap"),
      createCell(submission.title),
      createCell(submission.seniority),
      createCell(submission.industry),
      createCell(submission.country, "nowrap"),
      createCell(submission.audience),
      createCell(submission.deliveryTimeline),
      createCell(submission.budget, "nowrap"),
      createCell(submission.existingClient, "nowrap"),
      createCell(submission.businessChallenge, "long-cell"),
      createCell(submission.objectives, "long-cell")
    );
    bodyNode.append(row);
  });

  emptyStateNode.hidden = visibleSubmissions.length > 0;
}

searchNode.addEventListener("input", renderTable);
priorityNode.addEventListener("change", renderTable);

renderTable();
