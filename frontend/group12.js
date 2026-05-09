// ============================================
// ILES SYSTEM
// ============================================

// ========== 1. STORAGE -Save/Load Data ==========
function getUsers() {
  return JSON.parse(localStorage.getItem("iles_users") || "[]");
}
function saveUsers(u) {
  localStorage.setItem("iles_users", JSON.stringify(u));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("iles_current_user") || "null");
}
function setCurrentUser(u) {
  localStorage.setItem("iles_current_user", JSON.stringify(u));
}
function clearCurrentUser() {
  localStorage.removeItem("iles_current_user");
}
function getLogs() {
  return JSON.parse(localStorage.getItem("iles_logs") || "[]");
}
function saveLogs(l) {
  localStorage.setItem("iles_logs", JSON.stringify(l));
}
function getStudentLogs(id) {
  return getLogs()
    .filter((l) => l.studentId === id)
    .sort((a, b) => b.week - a.week);
}
function updateLog(id, updates) {
  let logs = getLogs();
  let i = logs.findIndex((l) => l.id === id);
  if (i !== -1) {
    logs[i] = { ...logs[i], ...updates };
    saveLogs(logs);
    return true;
  }
  return false;
}

// ========== 2. HELPERS ==========
function showMessage(msg, type) {
  let d = document.createElement("div");
  d.className = `message ${type}`;
  d.textContent = msg;
  d.style.cssText = `position:fixed;top:20px;right:20px;padding:12px 20px;border-radius:8px;z-index:9999;background:${type === "success" ? "#d4edda" : "#f8d7da"};color:${type === "success" ? "#155724" : "#721c24"};font-weight:bold;`;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3000);
}
function formatDate(d) {
  return d ? new Date(d).toLocaleDateString() : "Not submitted";
}
function escapeHtml(t) {
  if (!t) return "";
  let d = document.createElement("div");
  d.textContent = t;
  return d.innerHTML;
}

// ========== 3. DEFAULT DATA-First time only ==========
function initDefaultData() {
  if (getUsers().length === 0) {
    saveUsers([
      {
        id: 1,
        username: "student1",
        password: "pass123",
        role: "student",
        fullName: "John Doe",
        email: "john@student.com",
      },
      {
        id: 2,
        username: "workplace1",
        password: "pass123",
        role: "workplace_supervisor",
        fullName: "Robert Chen",
        email: "robert@workplace.com",
      },
      {
        id: 3,
        username: "academic1",
        password: "pass123",
        role: "academic_supervisor",
        fullName: "Dr. James Wilson",
        email: "james@academic.edu",
      },
      {
        id: 4,
        username: "admin",
        password: "admin123",
        role: "admin",
        fullName: "Admin User",
        email: "admin@iles.com",
      },
    ]);
  }
  if (getLogs().length === 0) {
    saveLogs([
      {
        id: 1,
        studentId: 1,
        studentName: "John Doe",
        week: 1,
        activities: "Worked on project setup",
        challenges: "Understanding codebase",
        status: "approved",
        submittedAt: "2024-01-10",
        workplaceFeedback: "Good work!",
        workplaceScore: 8.5,
        academicFeedback: "Well done",
        academicScore: 8.8,
      },
      {
        id: 2,
        studentId: 1,
        studentName: "John Doe",
        week: 2,
        activities: "Implemented authentication",
        challenges: "JWT handling",
        status: "pending",
        submittedAt: "2024-01-17",
      },
    ]);
  }
}

// ========== 4. AUTHENTICATION ==========
function login(username, password, role) {
  let roles = {
    Student: "student",
    "Workplace Supervisor": "workplace_supervisor",
    "Academic Supervisor": "academic_supervisor",
    Admin: "admin",
  };
  let user = getUsers().find(
    (u) =>
      u.username === username &&
      u.password === password &&
      u.role === roles[role],
  );
  if (user) {
    setCurrentUser(user);
    return { success: true, user: user };
  }
  return { success: false, message: "Invalid credentials" };
}
function togglePassword() {
  const input = document.getElementById("loginPassword");
  input.type = input.type === "password" ? "text" : "password";
}
function toggleRegPassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}
function register(data) {
  if (getUsers().some((u) => u.username === data.username))
    return { success: false, message: "Username exists" };
  let roles = {
    Student: "student",
    "Workplace Supervisor": "workplace_supervisor",
    "Academic Supervisor": "academic_supervisor",
    Admin: "admin",
  };
  let newUser = {
    id: getUsers().length + 1,
    username: data.username,
    password: data.password,
    role: roles[data.role],
    fullName: data.fullName,
    email: data.email,
  };
  saveUsers([...getUsers(), newUser]);
  return { success: true, message: "Registration successful" };
}
function logout() {
  clearCurrentUser();
  showMessage("Logged out!", "success");
  setTimeout(() => (window.location.href = "welcome.html"), 1000);
}

// ========== 5. LOG FUNCTIONS ==========
function submitLog(data) {
  let logs = getLogs();
  let newLog = {
    id: logs.length + 1,
    ...data,
    submittedAt: new Date().toISOString(),
    status: "pending",
  };
  saveLogs([...logs, newLog]);
  return { success: true };
}

// ========== 6. WELCOME PAGE ==========
function setupWelcome() {
  let loginTab = document.getElementById("loginTab");
  let registerTab = document.getElementById("registerTab");
  let loginForm = document.getElementById("loginForm");
  let registerForm = document.getElementById("registerForm");

  loginTab.onclick = () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  };
  registerTab.onclick = () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.style.display = "block";
    loginForm.style.display = "none";
  };

  document.getElementById("loginFormElement").onsubmit = (e) => {
    e.preventDefault();
    let result = login(
      loginUsername.value,
      loginPassword.value,
      loginRole.value,
    );
    if (result.success) {
      showMessage(`Welcome ${result.user.fullName}!`, "success");
      setTimeout(
        () =>
          (window.location.href =
            result.user.role === "student"
              ? "student_dashboard.html"
              : result.user.role === "workplace_supervisor"
                ? "workplace_supervisor.html"
                : result.user.role === "academic_supervisor"
                  ? "academic_supervisor.html"
                  : "admin.html"),
        1500,
      );
    } else showMessage(result.message, "error");
  };

  document.getElementById("registerFormElement").onsubmit = (e) => {
    e.preventDefault();
    if (regPassword.value !== regConfirmPassword.value) {
      showMessage("Passwords don't match", "error");
      return;
    }
    let result = register({
      username: regUsername.value,
      password: regPassword.value,
      fullName: regFullName.value,
      email: regEmail.value,
      role: regRole.value,
    });
    if (result.success) {
      showMessage("Registration successful! Please login.", "success");
      loginTab.click();
    } else showMessage(result.message, "error");
  };
}

// ========== 7. STUDENT DASHBOARD ==========
function loadStudentDashboard() {
  let user = getCurrentUser();
  if (!user || user.role !== "student") {
    window.location.href = "welcome.html";
    return;
  }
  document.getElementById("welcomeName").innerHTML =
    user.fullName.split(" ")[0];
  let logs = getStudentLogs(user.id);
  document.getElementById("totalLogs").innerHTML = logs.length;
  document.getElementById("pendingLogs").innerHTML = logs.filter(
    (l) => l.status === "pending",
  ).length;
  document.getElementById("approvedLogs").innerHTML = logs.filter(
    (l) => l.status === "approved",
  ).length;
  let recent = logs.slice(-3).reverse();
  document.getElementById("recentActivity").innerHTML = recent.length
    ? recent
        .map(
          (l) =>
            `<div class="activity-item"><div>Week ${l.week}: ${l.activities.substring(0, 50)}</div><span class="status-badge status-${l.status}">${l.status}</span></div>`,
        )
        .join("")
    : "<div>No logs yet</div>";
}

// ========== 8. LOG PAGE ==========
function setupLogPage() {
  let user = getCurrentUser();
  if (!user) {
    window.location.href = "welcome.html";
    return;
  }
  document.getElementById("welcomeName").innerHTML =
    user.fullName.split(" ")[0];
  displayUserLogs();
  document.getElementById("logForm").onsubmit = (e) => {
    e.preventDefault();
    let week = parseInt(weekNumber.value);
    let activitiesText = document.getElementById("activities").value.trim();
    let challengesText = document.getElementById("challenges").value.trim();
    if (!week || week < 1 || week > 52) {
      showMessage("Week must be 1-52", "error");
      return;
    }
    if (activitiesText.length < 10) {
      showMessage("Describe activities", "error");
      return;
    }
    if (getStudentLogs(user.id).some((l) => l.week === week)) {
      showMessage(`Week ${week} already submitted!`, "error");
      return;
    }
    submitLog({
      studentId: user.id,
      studentName: user.fullName,
      week: week,
      activities: activitiesText,
      challenges: challengesText,
      learnings: document.getElementById("learnings").value || "",
    });
    showMessage(`Week ${week} submitted!`, "success");
    e.target.reset();
    displayUserLogs();
  };
}
function displayUserLogs() {
  let logs = getStudentLogs(getCurrentUser().id);
  document.getElementById("logsContainer").innerHTML = logs.length
    ? logs
        .map(
          (l) =>
            `<div class="log-item"><div><strong>Week ${l.week}</strong> - ${l.status}</div><div>${l.activities}</div>${l.workplaceFeedback ? `<div>Feedback: ${l.workplaceFeedback}</div>` : ""}<div>Score: ${l.workplaceScore || "-"}/10</div></div>`,
        )
        .join("")
    : "<div>No logs yet</div>";
}

// ========== 9. WORKPLACE SUPERVISOR ==========
function setupWorkplace() {
  let user = getCurrentUser();
  if (!user || user.role !== "workplace_supervisor") {
    window.location.href = "welcome.html";
    return;
  }
  document.getElementById("welcomeName").innerHTML =
    user.fullName.split(" ")[0];
  let students = getUsers().filter((u) => u.role === "student");
  document.getElementById("totalStudents").innerHTML = students.length;
  let pending = getLogs().filter((l) => l.status === "pending");
  document.getElementById("pendingReviews").innerHTML = pending.length;
  let approved = getLogs().filter((l) => l.status === "approved");
  document.getElementById("approvedCount").innerHTML = approved.length;
  displayPendingWorkplaceLogs();
}
function displayPendingWorkplaceLogs() {
  let pending = getLogs().filter((l) => l.status === "pending");
  document.getElementById("pendingLogsList").innerHTML = pending.length
    ? pending
        .map((l) => {
          let s = getUsers().find((u) => u.id === l.studentId);
          return `<div class="pending-item"><div><strong>${s?.fullName}</strong> - Week ${l.week}</div><div>${l.activities.substring(0, 100)}...</div><button onclick="openReviewModal(${l.id})">Review</button></div>`;
        })
        .join("")
    : "<div>No pending logs</div>";
}
function openReviewModal(id) {
  let log = getLogs().find((l) => l.id === id);
  let student = getUsers().find((u) => u.id === log.studentId);
  document.getElementById("modalLogId").value = log.id;
  document.getElementById("modalStudentName").value = student?.fullName;
  document.getElementById("modalWeek").value = `Week ${log.week}`;
  document.getElementById("modalActivities").value = log.activities;
  document.querySelector("#reviewModal .modal-header h3").textContent =
    "Workplace Review";
  document.getElementById("modalWorkplaceFeedback").style.display = "none";
  document.querySelector("label[for='modalAcademicFeedback']").textContent =
    "Workplace Feedback";
  document.querySelector("label[for='modalAcademicScore']").textContent =
    "Workplace Score (0-10)";
  document.getElementById("reviewModal").classList.add("active");
  document.getElementById("modalReviewForm").onsubmit = submitWorkplaceReview;
}
function submitWorkplaceReview(e) {
  e.preventDefault();
  let id = parseInt(document.getElementById("modalLogId").value);
  let fb = document.getElementById("modalAcademicFeedback").value.trim();
  let sc = parseFloat(document.getElementById("modalAcademicScore").value);
  if (fb.length < 5) {
    showMessage("Provide meaningful feedback", "error");
    return;
  }
  if (isNaN(sc) || sc < 0 || sc > 10) {
    showMessage("Enter score 0-10", "error");
    return;
  }
  if (
    updateLog(id, {
      workplaceFeedback: fb,
      workplaceScore: sc,
      status: "reviewed_by_workplace",
    })
  ) {
    showMessage("Review submitted!", "success");
    closeModal();
    displayPendingWorkplaceLogs();
  }
}
function closeModal() {
  document.getElementById("reviewModal").classList.remove("active");
}

// ========== 10. ACADEMIC SUPERVISOR ==========
function setupAcademic() {
  let user = getCurrentUser();
  if (!user || user.role !== "academic_supervisor") {
    window.location.href = "welcome.html";
    return;
  }
  document.getElementById("welcomeName").innerHTML =
    user.fullName.split(" ")[0];
  let students = getUsers().filter((u) => u.role === "student");
  document.getElementById("totalStudents").innerHTML = students.length;
  let pending = getLogs().filter((l) => l.status === "reviewed_by_workplace");
  document.getElementById("pendingReviews").innerHTML = pending.length;
  let approved = getLogs().filter((l) => l.status === "approved");
  document.getElementById("approvedCount").innerHTML = approved.length;
  let scores = getLogs()
    .filter((l) => l.academicScore)
    .map((l) => l.academicScore);
  document.getElementById("avgScore").innerHTML = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : "0";
  displayPendingAcademicLogs();
}
function displayPendingAcademicLogs() {
  let pending = getLogs().filter((l) => l.status === "reviewed_by_workplace");
  document.getElementById("pendingLogsList").innerHTML = pending.length
    ? pending
        .map((l) => {
          let s = getUsers().find((u) => u.id === l.studentId);
          return `<div class="pending-item"><div><strong>${s?.fullName}</strong> - Week ${l.week}</div><div>Workplace Score: ${l.workplaceScore}/10</div><button onclick="openAcademicModal(${l.id})">Approve</button></div>`;
        })
        .join("")
    : "<div>No pending approvals</div>";
}
function openAcademicModal(id) {
  let log = getLogs().find((l) => l.id === id);
  let student = getUsers().find((u) => u.id === log.studentId);
  document.getElementById("modalLogId").value = log.id;
  document.getElementById("modalStudentName").value = student?.fullName;
  document.getElementById("modalWeek").value = `Week ${log.week}`;
  document.getElementById("modalActivities").value = log.activities;
  document.getElementById("modalWorkplaceText").textContent =
    log.workplaceFeedback || "No feedback";
  document.querySelector("#reviewModal .modal-header h3").textContent =
    "Academic Review & Approval";
  document.getElementById("modalWorkplaceFeedback").style.display = "block";
  document.querySelector("label[for='modalAcademicFeedback']").textContent =
    "Academic Feedback";
  document.querySelector("label[for='modalAcademicScore']").textContent =
    "Academic Score (0-10)";
  document.getElementById("reviewModal").classList.add("active");
  document.getElementById("modalReviewForm").onsubmit = submitAcademicReview;
}
function submitAcademicReview(e) {
  e.preventDefault();
  let id = parseInt(document.getElementById("modalLogId").value);
  let fb = document.getElementById("modalAcademicFeedback").value.trim();
  let sc = parseFloat(document.getElementById("modalAcademicScore").value);
  if (fb.length < 5) {
    showMessage("Provide feedback", "error");
    return;
  }
  if (isNaN(sc) || sc < 0 || sc > 10) {
    showMessage("Enter score 0-10", "error");
    return;
  }
  if (
    updateLog(id, {
      academicFeedback: fb,
      academicScore: sc,
      status: "approved",
    })
  ) {
    showMessage("Approved!", "success");
    closeModal();
    displayPendingAcademicLogs();
  }
}

// ========== 11. ADMIN DASHBOARD ==========
function setupAdmin() {
  let user = getCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "welcome.html";
    return;
  }
  document.getElementById("welcomeName").innerHTML =
    user.fullName.split(" ")[0];
  let users = getUsers();
  let logs = getLogs();
  document.getElementById("totalUsers").innerHTML = users.length;
  document.getElementById("totalStudents").innerHTML = users.filter(
    (u) => u.role === "student",
  ).length;
  document.getElementById("totalWorkplace").innerHTML = users.filter(
    (u) => u.role === "workplace_supervisor",
  ).length;
  document.getElementById("totalAcademic").innerHTML = users.filter(
    (u) => u.role === "academic_supervisor",
  ).length;
  document.getElementById("totalLogs").innerHTML = logs.length;
  document.getElementById("pendingLogs").innerHTML = logs.filter(
    (l) => l.status === "pending",
  ).length;
  document.getElementById("usersTableBody").innerHTML = users
    .map(
      (u) =>
        `<tr><td>${u.username}</td><td>${u.fullName}</td><td>${u.email || "-"}</td><td>${u.role.replace("_", " ")}</td></tr>`,
    )
    .join("");
  document.getElementById("allLogs").innerHTML = logs
    .map((l) => {
      let s = users.find((u) => u.id === l.studentId);
      return `<div><strong>${s?.fullName}</strong> - Week ${l.week} - ${l.status}</div>`;
    })
    .join("");
}

// ========== 12. APPLICATION FORM -Multi-step ==========
let step = 1;
function setupApplicationForm() {
  updateStep();
  document.getElementById("nextBtn").onclick = nextStep;
  document.getElementById("prevBtn").onclick = prevStep;
  document.getElementById("submitBtn").onclick = submitApp;
}
function updateStep() {
  for (let i = 1; i <= 4; i++) {
    let s = document.getElementById(`section${i}`);
    if (s) s.classList.remove("active");
    let st = document.getElementById(`step${i}`);
    if (st) {
      st.classList.remove("active", "completed");
    }
  }
  document.getElementById(`section${step}`).classList.add("active");
  document.getElementById(`step${step}`).classList.add("active");
  for (let i = 1; i < step; i++)
    document.getElementById(`step${i}`).classList.add("completed");
  document.getElementById("prevBtn").style.display =
    step === 1 ? "none" : "inline-flex";
  document.getElementById("nextBtn").style.display =
    step === 4 ? "none" : "inline-flex";
  document.getElementById("submitBtn").style.display =
    step === 4 ? "inline-flex" : "none";
  if (step === 4) populateReview();
}
function validate(s) {
  if (s === 1) {
    if (!studentName.value) {
      alert("Enter name");
      return false;
    }
    if (!regNumber.value) {
      alert("Enter registration");
      return false;
    }
    if (!email.value.includes("@")) {
      alert("Valid email");
      return false;
    }
    return true;
  }
  if (s === 2) {
    if (!academicProgram.value) {
      alert("Enter program");
      return false;
    }
    return true;
  }
  if (s === 3) {
    if (!organization.value) {
      alert("Enter organization");
      return false;
    }
    return true;
  }
  return true;
}
function nextStep() {
  if (validate(step) && step < 4) {
    step++;
    updateStep();
  }
}
function prevStep() {
  if (step > 1) {
    step--;
    updateStep();
  }
}
function populateReview() {
  document.getElementById("reviewContainer").innerHTML =
    `<div>Name: ${studentName.value}</div><div>Registration: ${regNumber.value}</div><div>Email: ${email.value}</div><div>Program: ${academicProgram.value}</div><div>Organization: ${organization.value}</div>`;
}
function submitApp(e) {
  e.preventDefault();
  console.log("hello - Application form submission started");
  console.log("Processing form data...");
  console.log("Validating student information...");
  alert("Application submitted!");
  console.log("Application submitted successfully");
  console.log("Redirecting to student dashboard...");
  console.log("goodbye - Application form submission complete");
  setTimeout(() => (window.location.href = "student_dashboard.html"), 2000);
}

// ========== 13. MAIN CONTROLLER -This runs when page loads==========
document.addEventListener("DOMContentLoaded", function () {
  initDefaultData();
  let page = window.location.pathname.split("/").pop();

  console.log("ILES System loaded on:", page);

  if (page === "welcome.html") setupWelcome();
  else if (page === "student_dashboard.html") loadStudentDashboard();
  else if (page === "log.html") setupLogPage();
  else if (page === "workplace_supervisor.html") setupWorkplace();
  else if (page === "academic_supervisor.html") setupAcademic();
  else if (page === "admin.html") setupAdmin();
  else if (page ==="application.html" || page.includes("application")) setupApplicationForm();
});
