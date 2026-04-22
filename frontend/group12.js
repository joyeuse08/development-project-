
// ============================================
// SECTION 1: STORAGE FUNCTIONS
// ============================================

function getUsers() {
  const users = localStorage.getItem("iles_users");
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem("iles_users", JSON.stringify(users));
}

function getCurrentUser() {
  const user = localStorage.getItem("iles_current_user");
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  localStorage.setItem("iles_current_user", JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem("iles_current_user");
}

function getLogs() {
  const logs = localStorage.getItem("iles_logs");
  return logs ? JSON.parse(logs) : [];
}

function saveLogs(logs) {
  localStorage.setItem("iles_logs", JSON.stringify(logs));
}

// ============================================
// SECTION 2: HELPER FUNCTIONS
// ============================================

function showMessage(message, type) {
  const existingMsg = document.querySelector(".message");
  if (existingMsg) existingMsg.remove();

  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;
  msgDiv.textContent = message;
  msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        background: ${type === "success" ? "#d4edda" : "#f8d7da"};
        color: ${type === "success" ? "#155724" : "#721c24"};
        border-left: 4px solid ${type === "success" ? "#28a745" : "#dc3545"};
    `;
  document.body.appendChild(msgDiv);
  setTimeout(() => msgDiv.remove(), 3000);
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  if (!dateString) return "Not submitted";
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// ============================================
// SECTION 3: INITIALIZE DEFAULT DATA
// ============================================

function initDefaultData() {
  let users = getUsers();
  if (users.length === 0) {
    users = [
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
    ];
    saveUsers(users);
  }

  let logs = getLogs();
  if (logs.length === 0) {
    logs = [
      {
        id: 1,
        studentId: 1,
        studentName: "John Doe",
        week: 1,
        activities: "Worked on project setup",
        challenges: "Understanding codebase",
        learnings: "React components",
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
        learnings: "Auth flow",
        status: "pending",
        submittedAt: "2024-01-17",
      },
    ];
    saveLogs(logs);
  }
}

// ============================================
// SECTION 4: AUTHENTICATION
// ============================================

function login(username, password, role) {
  const users = getUsers();
  let expectedRole = "";
  if (role === "Student") expectedRole = "student";
  else if (role === "Workplace Supervisor")
    expectedRole = "workplace_supervisor";
  else if (role === "Academic Supervisor") expectedRole = "academic_supervisor";
  else if (role === "Admin") expectedRole = "admin";

  const user = users.find(
    (u) =>
      u.username === username &&
      u.password === password &&
      u.role === expectedRole,
  );

  if (user) {
    setCurrentUser(user);
    return { success: true, user: user };
  }
  return { success: false, message: "Invalid username, password, or role" };
}

function register(userData) {
  const users = getUsers();

  if (users.some((u) => u.username === userData.username)) {
    return { success: false, message: "Username already exists" };
  }

  let role = "";
  if (userData.role === "Student") role = "student";
  else if (userData.role === "Workplace Supervisor")
    role = "workplace_supervisor";
  else if (userData.role === "Academic Supervisor")
    role = "academic_supervisor";
  else if (userData.role === "Admin") role = "admin";

  const newUser = {
    id: users.length + 1,
    username: userData.username,
    password: userData.password,
    role: role,
    fullName: userData.fullName,
    email: userData.email,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  return { success: true, message: "Registration successful" };
}

function logout() {
  clearCurrentUser();
  showMessage("Logged out successfully!", "success");
  setTimeout(() => {
    window.location.href = "welcome.html";
  }, 1000);
}

// ============================================
// SECTION 5: LOG FUNCTIONS
// ============================================

function submitLog(logData) {
  const logs = getLogs();
  const newLog = {
    id: logs.length + 1,
    ...logData,
    submittedAt: new Date().toISOString(),
    status: "pending",
  };
  logs.push(newLog);
  saveLogs(logs);
  return { success: true };
}

function getStudentLogs(studentId) {
  const logs = getLogs();
  return logs
    .filter((log) => log.studentId === studentId)
    .sort((a, b) => b.week - a.week);
}

function updateLog(logId, updates) {
  const logs = getLogs();
  const index = logs.findIndex((l) => l.id === logId);
  if (index !== -1) {
    logs[index] = { ...logs[index], ...updates };
    saveLogs(logs);
    return { success: true };
  }
  return { success: false };
}

// ============================================
// SECTION 6: WELCOME PAGE
// ============================================

function initWelcomePage() {
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginFormElement = document.getElementById("loginFormElement");
  const registerFormElement = document.getElementById("registerFormElement");

  if (loginTab && registerTab) {
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      if (loginForm) loginForm.style.display = "block";
      if (registerForm) registerForm.style.display = "none";
    });

    registerTab.addEventListener("click", () => {
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
      if (registerForm) registerForm.style.display = "block";
      if (loginForm) loginForm.style.display = "none";
    });
  }

  if (loginFormElement) {
    loginFormElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      const role = document.getElementById("loginRole").value;

      if (!username || !password) {
        showMessage("Please enter username and password", "error");
        return;
      }

      if (!role || role === "Select Role") {
        showMessage("Please select your role", "error");
        return;
      }

      const result = login(username, password, role);
      if (result.success) {
        showMessage(`Welcome back, ${result.user.fullName}!`, "success");
        setTimeout(() => {
          if (result.user.role === "student")
            window.location.href = "student_dashboard.html";
          else if (result.user.role === "workplace_supervisor")
            window.location.href = "workplace_supervisor.html";
          else if (result.user.role === "academic_supervisor")
            window.location.href = "academic_supervisor.html";
          else if (result.user.role === "admin")
            window.location.href = "admin.html";
        }, 1500);
      } else {
        showMessage(result.message, "error");
      }
    });
  }

  if (registerFormElement) {
    registerFormElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("regUsername").value.trim();
      const password = document.getElementById("regPassword").value;
      const confirmPassword =
        document.getElementById("regConfirmPassword").value;
      const fullName = document.getElementById("regFullName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const role = document.getElementById("regRole").value;

      if (
        !username ||
        !password ||
        !confirmPassword ||
        !fullName ||
        !email ||
        !role
      ) {
        showMessage("Please fill all fields", "error");
        return;
      }

      if (password !== confirmPassword) {
        showMessage("Passwords do not match", "error");
        return;
      }

      const result = register({ username, password, fullName, email, role });
      if (result.success) {
        showMessage("Registration successful! Please login.", "success");
        registerFormElement.reset();
        if (loginTab) loginTab.click();
      } else {
        showMessage(result.message, "error");
      }
    });
  }
}

// ============================================
// SECTION 7: STUDENT DASHBOARD
// ============================================

function loadStudentDashboard() {
  const user = getCurrentUser();
  if (!user || user.role !== "student") {
    window.location.href = "welcome.html";
    return;
  }

  const welcomeSpan = document.getElementById("welcomeName");
  if (welcomeSpan) welcomeSpan.textContent = user.fullName.split(" ")[0];

  const logs = getStudentLogs(user.id);
  const totalLogs = logs.length;
  const pendingLogs = logs.filter((l) => l.status === "pending").length;
  const approvedLogs = logs.filter((l) => l.status === "approved").length;

  const totalEl = document.getElementById("totalLogs");
  const pendingEl = document.getElementById("pendingLogs");
  const approvedEl = document.getElementById("approvedLogs");

  if (totalEl) totalEl.textContent = totalLogs;
  if (pendingEl) pendingEl.textContent = pendingLogs;
  if (approvedEl) approvedEl.textContent = approvedLogs;

  const recentContainer = document.getElementById("recentActivity");
  if (recentContainer) {
    const recentLogs = logs.slice(-3).reverse();
    if (recentLogs.length === 0) {
      recentContainer.innerHTML =
        '<div class="activity-item">No logs yet</div>';
    } else {
      recentContainer.innerHTML = recentLogs
        .map(
          (log) => `
                <div class="activity-item">
                    <div class="activity-text">
                        <div class="activity-title">Week ${log.week}: ${log.activities.substring(0, 50)}</div>
                    </div>
                    <span class="status-badge status-${log.status}">${log.status === "pending" ? "Pending" : "Approved"}</span>
                </div>
            `,
        )
        .join("");
    }
  }
}

// ============================================
// SECTION 8: LOG PAGE
// ============================================

function initLogPage() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "welcome.html";
    return;
  }

  const welcomeSpan = document.getElementById("welcomeName");
  if (welcomeSpan) welcomeSpan.textContent = user.fullName.split(" ")[0];

  displayUserLogs();
  updateTotalLogs();

  const logForm = document.getElementById("logForm");
  if (logForm) {
    logForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const week = parseInt(document.getElementById("weekNumber").value);
      const activities = document.getElementById("activities").value.trim();
      const challenges = document.getElementById("challenges").value.trim();
      const learnings = document.getElementById("learnings").value.trim();

      if (!week || week < 1 || week > 52) {
        showMessage("Week must be between 1 and 52", "error");
        return;
      }

      if (!activities || activities.length < 10) {
        showMessage("Please describe your activities", "error");
        return;
      }

      if (!challenges || challenges.length < 5) {
        showMessage("Please describe challenges", "error");
        return;
      }

      const existingLogs = getStudentLogs(user.id);
      if (existingLogs.some((l) => l.week === week)) {
        showMessage(`Week ${week} already submitted!`, "error");
        return;
      }

      submitLog({
        studentId: user.id,
        studentName: user.fullName,
        week: week,
        activities: activities,
        challenges: challenges,
        learnings: learnings || "",
      });

      showMessage(`Week ${week} submitted!`, "success");
      logForm.reset();
      displayUserLogs();
      updateTotalLogs();
    });
  }
}

function displayUserLogs() {
  const user = getCurrentUser();
  if (!user) return;

  const logs = getStudentLogs(user.id);
  const container = document.getElementById("logsContainer");

  if (!container) return;

  if (logs.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No logs yet</p></div>';
    return;
  }

  container.innerHTML = logs
    .map(
      (log) => `
        <div class="log-item">
            <div class="log-header">
                <span class="log-week">Week ${log.week}</span>
                <span class="status-badge status-${log.status}">${log.status === "pending" ? "Pending" : "Approved"}</span>
            </div>
            <div class="log-content">
                <div><strong>Activities:</strong> ${escapeHtml(log.activities)}</div>
                <div><strong>Challenges:</strong> ${escapeHtml(log.challenges)}</div>
                ${log.learnings ? `<div><strong>Learnings:</strong> ${escapeHtml(log.learnings)}</div>` : ""}
                ${log.workplaceFeedback ? `<div><strong>Workplace Feedback:</strong> ${escapeHtml(log.workplaceFeedback)}</div>` : ""}
                <div><small>Submitted: ${formatDate(log.submittedAt)}</small></div>
            </div>
        </div>
    `,
    )
    .join("");
}

function updateTotalLogs() {
  const user = getCurrentUser();
  if (!user) return;

  const logs = getStudentLogs(user.id);
  const totalEl = document.getElementById("totalLogs");
  if (totalEl) totalEl.textContent = logs.length;
}

// ============================================
// SECTION 9: WORKPLACE SUPERVISOR
// ============================================

function initWorkplaceDashboard() {
  const user = getCurrentUser();
  if (!user || user.role !== "workplace_supervisor") {
    window.location.href = "welcome.html";
    return;
  }

  const welcomeSpan = document.getElementById("welcomeName");
  if (welcomeSpan) welcomeSpan.textContent = user.fullName.split(" ")[0];

  loadStudentSelect();
  displayPendingLogs();
}

function loadStudentSelect() {
  const users = getUsers();
  const students = users.filter((u) => u.role === "student");
  const select = document.getElementById("academicStudentSelect");

  if (select) {
    select.innerHTML = '<option value="">Select Student</option>';
    students.forEach((s) => {
      const option = document.createElement("option");
      option.value = s.id;
      option.textContent = s.fullName;
      select.appendChild(option);
    });
  }
}

function displayPendingLogs() {
  const logs = getLogs();
  const pendingLogs = logs.filter((l) => l.status === "pending");
  const container = document.getElementById("pendingLogsList");

  if (!container) return;

  const pendingCount = document.getElementById("pendingReviews");
  const pendingCountSpan = document.getElementById("pendingCount");
  if (pendingCount) pendingCount.textContent = pendingLogs.length;
  if (pendingCountSpan) pendingCountSpan.textContent = pendingLogs.length;

  if (pendingLogs.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><p>No pending logs</p></div>';
    return;
  }

  container.innerHTML = pendingLogs
    .map((log) => {
      const student = getUsers().find((u) => u.id === log.studentId);
      return `
            <div class="pending-item">
                <div class="pending-header">
                    <span class="student-name">${student?.fullName || log.studentName}</span>
                    <span class="week-badge">Week ${log.week}</span>
                </div>
                <div class="pending-activities">${log.activities.substring(0, 100)}...</div>
                <button class="review-btn" onclick="openReviewModal(${log.id})">Review Log</button>
            </div>
        `;
    })
    .join("");
}

function openReviewModal(logId) {
  const logs = getLogs();
  const log = logs.find((l) => l.id === logId);
  if (!log) return;

  const student = getUsers().find((u) => u.id === log.studentId);

  document.getElementById("reviewLogId").value = log.id;
  document.getElementById("reviewStudentName").value =
    student?.fullName || log.studentName;
  document.getElementById("reviewWeek").value = `Week ${log.week}`;
  document.getElementById("reviewActivities").value = log.activities;
  document.getElementById("feedback").value = "";
  document.getElementById("score").value = "";

  document.getElementById("reviewModal").classList.add("active");
}

function closeModal() {
  document.getElementById("reviewModal").classList.remove("active");
}

function submitWorkplaceReview(e) {
  e.preventDefault();

  const logId = parseInt(document.getElementById("reviewLogId").value);
  const feedback = document.getElementById("feedback").value.trim();
  const score = parseFloat(document.getElementById("score").value);

  if (!feedback || feedback.length < 5) {
    showMessage("Please provide meaningful feedback", "error");
    return;
  }

  if (isNaN(score) || score < 0 || score > 10) {
    showMessage("Please enter a valid score (0-10)", "error");
    return;
  }

  const result = updateLog(logId, {
    workplaceFeedback: feedback,
    workplaceScore: score,
    status: "reviewed_by_workplace",
  });

  if (result.success) {
    showMessage("Review submitted successfully!", "success");
    closeModal();
    displayPendingLogs();
  }
}

// ============================================
// SECTION 10: ACADEMIC SUPERVISOR
// ============================================

function initAcademicDashboard() {
  const user = getCurrentUser();
  if (!user || user.role !== "academic_supervisor") {
    window.location.href = "welcome.html";
    return;
  }

  const welcomeSpan = document.getElementById("welcomeName");
  if (welcomeSpan) welcomeSpan.textContent = user.fullName.split(" ")[0];

  loadAcademicStudentSelect();
  displayAcademicPendingLogs();
  updateAcademicStats();
}

function loadAcademicStudentSelect() {
  const users = getUsers();
  const students = users.filter((u) => u.role === "student");
  const select = document.getElementById("academicStudentSelect");

  if (select) {
    select.innerHTML = '<option value="">Select Student</option>';
    students.forEach((s) => {
      const option = document.createElement("option");
      option.value = s.id;
      option.textContent = s.fullName;
      select.appendChild(option);
    });
  }
}

function displayAcademicPendingLogs() {
  const logs = getLogs();
  const pendingLogs = logs.filter((l) => l.status === "reviewed_by_workplace");
  const container = document.getElementById("pendingLogsList");

  if (!container) return;

  const pendingCount = document.getElementById("pendingReviews");
  if (pendingCount) pendingCount.textContent = pendingLogs.length;

  if (pendingLogs.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><p>No pending approvals</p></div>';
    return;
  }

  container.innerHTML = pendingLogs
    .map((log) => {
      const student = getUsers().find((u) => u.id === log.studentId);
      return `
            <div class="pending-item" onclick="openAcademicModal(${log.id})">
                <div class="pending-header">
                    <span class="student-name">${student?.fullName || log.studentName}</span>
                    <span class="week-badge">Week ${log.week}</span>
                </div>
                <div class="pending-activities">${log.activities.substring(0, 100)}...</div>
                <div class="workplace-info">Workplace Score: ${log.workplaceScore || "N/A"}/10</div>
                <button class="review-btn" onclick="event.stopPropagation(); openAcademicModal(${log.id})">Review & Approve</button>
            </div>
        `;
    })
    .join("");
}

function openAcademicModal(logId) {
  const logs = getLogs();
  const log = logs.find((l) => l.id === logId);
  if (!log) return;

  const student = getUsers().find((u) => u.id === log.studentId);

  document.getElementById("modalLogId").value = log.id;
  document.getElementById("modalStudentName").value =
    student?.fullName || log.studentName;
  document.getElementById("modalWeek").value = `Week ${log.week}`;
  document.getElementById("modalActivities").value = log.activities;
  document.getElementById("modalWorkplaceText").innerHTML =
    log.workplaceFeedback || "No workplace feedback";
  document.getElementById("modalAcademicFeedback").value = "";
  document.getElementById("modalAcademicScore").value = "";

  document.getElementById("reviewModal").classList.add("active");
}

function submitAcademicReview(e) {
  e.preventDefault();

  const logId = parseInt(document.getElementById("modalLogId").value);
  const feedback = document
    .getElementById("modalAcademicFeedback")
    .value.trim();
  const score = parseFloat(document.getElementById("modalAcademicScore").value);

  if (!feedback || feedback.length < 5) {
    showMessage("Please provide meaningful feedback", "error");
    return;
  }

  if (isNaN(score) || score < 0 || score > 10) {
    showMessage("Please enter a valid score (0-10)", "error");
    return;
  }

  const result = updateLog(logId, {
    academicFeedback: feedback,
    academicScore: score,
    status: "approved",
  });

  if (result.success) {
    showMessage("Log approved successfully!", "success");
    closeModal();
    displayAcademicPendingLogs();
    updateAcademicStats();
  }
}

function updateAcademicStats() {
  const logs = getLogs();
  const approvedLogs = logs.filter((l) => l.status === "approved");
  const totalScore = approvedLogs.reduce(
    (sum, l) => sum + (l.academicScore || 0),
    0,
  );
  const avgScore =
    approvedLogs.length > 0 ? (totalScore / approvedLogs.length).toFixed(1) : 0;

  const approvedCount = document.getElementById("approvedCount");
  const avgScoreEl = document.getElementById("avgScore");

  if (approvedCount) approvedCount.textContent = approvedLogs.length;
  if (avgScoreEl) avgScoreEl.textContent = avgScore;
}

// ============================================
// SECTION 11: ADMIN DASHBOARD
// ============================================

function initAdminDashboard() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "welcome.html";
    return;
  }

  const welcomeSpan = document.getElementById("welcomeName");
  if (welcomeSpan) welcomeSpan.textContent = user.fullName.split(" ")[0];

  updateAdminStats();
  displayAdminUsers();
  displayAdminLogs();
}

function updateAdminStats() {
  const users = getUsers();
  const logs = getLogs();

  const students = users.filter((u) => u.role === "student").length;
  const workplace = users.filter(
    (u) => u.role === "workplace_supervisor",
  ).length;
  const academic = users.filter((u) => u.role === "academic_supervisor").length;
  const pending = logs.filter((l) => l.status === "pending").length;

  const totalUsers = document.getElementById("totalUsers");
  const totalStudents = document.getElementById("totalStudents");
  const totalWorkplace = document.getElementById("totalWorkplace");
  const totalAcademic = document.getElementById("totalAcademic");
  const totalLogs = document.getElementById("totalLogs");
  const pendingLogs = document.getElementById("pendingLogs");
  const userCount = document.getElementById("userCount");
  const logsCount = document.getElementById("logsCount");

  if (totalUsers) totalUsers.textContent = users.length;
  if (totalStudents) totalStudents.textContent = students;
  if (totalWorkplace) totalWorkplace.textContent = workplace;
  if (totalAcademic) totalAcademic.textContent = academic;
  if (totalLogs) totalLogs.textContent = logs.length;
  if (pendingLogs) pendingLogs.textContent = pending;
  if (userCount) userCount.textContent = users.length;
  if (logsCount) logsCount.textContent = logs.length;
}

function displayAdminUsers() {
  const users = getUsers();
  const tbody = document.getElementById("usersTableBody");

  if (!tbody) return;

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${user.email || "-"}</td>
            <td>${user.role.replace("_", " ")}</td>
        </tr>
    `,
    )
    .join("");
}

function displayAdminLogs() {
  const logs = getLogs();
  const container = document.getElementById("allLogs");

  if (!container) return;

  if (logs.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No logs yet</p></div>';
    return;
  }

  container.innerHTML = logs
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .map((log) => {
      const student = getUsers().find((u) => u.id === log.studentId);
      return `
            <div class="log-item">
                <div class="log-header">
                    <span class="log-student">${student?.fullName || log.studentName}</span>
                    <span class="log-week">Week ${log.week}</span>
                    <span class="log-status status-${log.status}">${log.status}</span>
                </div>
                <div class="log-activities">${log.activities.substring(0, 100)}...</div>
                <div class="log-date">${formatDate(log.submittedAt)}</div>
            </div>
        `;
    })
    .join("");
}
// ============================================
// SECTION 12: MULTI-STEP FORM FUNCTIONS
// ============================================

let currentStep = 1;
const totalSteps = 4;

function updateStepVisibility() {
  console.log("Updating step visibility to:", currentStep);

  for (let i = 1; i <= totalSteps; i++) {
    const section = document.getElementById(`section${i}`);
    const step = document.getElementById(`step${i}`);
    if (section) section.classList.remove("active");
    if (step) {
      step.classList.remove("active");
      step.classList.remove("completed");
    }
  }

  const currentSection = document.getElementById(`section${currentStep}`);
  if (currentSection) currentSection.classList.add("active");

  const currentStepElement = document.getElementById(`step${currentStep}`);
  if (currentStepElement) currentStepElement.classList.add("active");

  for (let i = 1; i < currentStep; i++) {
    const prevStep = document.getElementById(`step${i}`);
    if (prevStep) prevStep.classList.add("completed");
  }

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  if (prevBtn)
    prevBtn.style.display = currentStep === 1 ? "none" : "inline-flex";
  if (nextBtn)
    nextBtn.style.display = currentStep === totalSteps ? "none" : "inline-flex";
  if (submitBtn)
    submitBtn.style.display =
      currentStep === totalSteps ? "inline-flex" : "none";

  if (currentStep === totalSteps) {
    populateReview();
  }
}

function validateStep(step) {
  if (step === 1) {
    const studentName = document.getElementById("studentName")?.value.trim();
    const regNumber = document.getElementById("regNumber")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const address = document.getElementById("address")?.value.trim();

    if (!studentName) {
      alert("Please enter your full name");
      return false;
    }
    if (!regNumber) {
      alert("Please enter registration number");
      return false;
    }
    if (!email || !email.includes("@")) {
      alert("Please enter valid email");
      return false;
    }
    if (!phone) {
      alert("Please enter phone number");
      return false;
    }
    if (!address) {
      alert("Please enter address");
      return false;
    }
    return true;
  }

  if (step === 2) {
    const academicProgram = document
      .getElementById("academicProgram")
      ?.value.trim();
    const department = document.getElementById("department")?.value.trim();
    const yearOfStudy = document.getElementById("yearOfStudy")?.value.trim();
    const courseCode = document.getElementById("courseCode")?.value.trim();
    const expectedGraduation =
      document.getElementById("expectedGraduation")?.value;

    if (!academicProgram) {
      alert("Please enter academic program");
      return false;
    }
    if (!department) {
      alert("Please enter department");
      return false;
    }
    if (!yearOfStudy) {
      alert("Please enter year of study");
      return false;
    }
    if (!courseCode) {
      alert("Please enter course code");
      return false;
    }
    if (!expectedGraduation) {
      alert("Please select expected graduation date");
      return false;
    }
    return true;
  }

  if (step === 3) {
    const organization = document.getElementById("organization")?.value.trim();
    const orgSupervisor = document
      .getElementById("orgSupervisor")
      ?.value.trim();
    const internshipWeeks = document.getElementById("internshipWeeks")?.value;
    const internshipDuration =
      document.getElementById("internshipDuration")?.value;

    if (!organization) {
      alert("Please enter organization name");
      return false;
    }
    if (!orgSupervisor) {
      alert("Please enter supervisor name");
      return false;
    }
    if (!internshipWeeks) {
      alert("Please select internship weeks");
      return false;
    }
    if (!internshipDuration) {
      alert("Please select internship duration");
      return false;
    }
    return true;
  }

  return true;
}

function nextStep() {
  console.log("Next button clicked! Current step:", currentStep);
  if (validateStep(currentStep)) {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepVisibility();
      console.log("Now at step:", currentStep);
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepVisibility();
  }
}

function getStepNumber(fieldId) {
  const step1Fields = ["studentName", "regNumber", "email", "phone", "address"];
  const step2Fields = [
    "academicProgram",
    "department",
    "yearOfStudy",
    "courseCode",
    "expectedGraduation",
    "gpa",
  ];
  if (step1Fields.includes(fieldId)) return 1;
  if (step2Fields.includes(fieldId)) return 2;
  return 3;
}

function populateReview() {
  const container = document.getElementById("reviewContainer");
  if (!container) return;

  const fields = [
    { label: "Student Name", id: "studentName" },
    { label: "Registration Number", id: "regNumber" },
    { label: "Email", id: "email" },
    { label: "Phone", id: "phone" },
    { label: "Address", id: "address" },
    { label: "Academic Program", id: "academicProgram" },
    { label: "Department", id: "department" },
    { label: "Year of Study", id: "yearOfStudy" },
    { label: "Course Code", id: "courseCode" },
    { label: "Expected Graduation", id: "expectedGraduation" },
    { label: "GPA", id: "gpa" },
    { label: "Organization", id: "organization" },
    { label: "Organization Address", id: "orgAddress" },
    { label: "Supervisor", id: "orgSupervisor" },
    { label: "Supervisor Email", id: "supervisorEmail" },
    { label: "Internship Weeks", id: "internshipWeeks" },
    { label: "Internship Duration", id: "internshipDuration" },
  ];

  let html = "";
  for (const field of fields) {
    const element = document.getElementById(field.id);
    let value = element ? element.value : "Not provided";
    if (value === "") value = "Not provided";
    if (field.id === "internshipWeeks" && element) {
      value = element.options[element.selectedIndex]?.text || "Not provided";
    }
    if (field.id === "internshipDuration" && element) {
      value = element.options[element.selectedIndex]?.text || "Not provided";
    }
    html += `
            <div class="review-item">
                <span class="review-label">${field.label}:</span>
                <span class="review-value">${escapeHtml(value)}</span>
                <span class="review-edit" onclick="goToStep(${getStepNumber(field.id)})">Edit</span>
            </div>
        `;
  }
  container.innerHTML = html;
}

function goToStep(step) {
  currentStep = step;
  updateStepVisibility();
}

function submitApplicationForm(e) {
  e.preventDefault();

  if (!validateStep(3)) return;

  const user = getCurrentUser();
  if (!user) {
    alert("Please login first");
    window.location.href = "welcome.html";
    return;
  }

  const applicationData = {
    studentId: user.id,
    studentName: document.getElementById("studentName")?.value,
    regNumber: document.getElementById("regNumber")?.value,
    email: document.getElementById("email")?.value,
    phone: document.getElementById("phone")?.value,
    address: document.getElementById("address")?.value,
    academicProgram: document.getElementById("academicProgram")?.value,
    department: document.getElementById("department")?.value,
    yearOfStudy: document.getElementById("yearOfStudy")?.value,
    courseCode: document.getElementById("courseCode")?.value,
    expectedGraduation: document.getElementById("expectedGraduation")?.value,
    gpa: document.getElementById("gpa")?.value,
    organization: document.getElementById("organization")?.value,
    orgAddress: document.getElementById("orgAddress")?.value,
    orgSupervisor: document.getElementById("orgSupervisor")?.value,
    supervisorEmail: document.getElementById("supervisorEmail")?.value,
    internshipWeeks: document.getElementById("internshipWeeks")?.value,
    internshipDuration: document.getElementById("internshipDuration")?.value,
    startDate: document.getElementById("startDate")?.value,
    submittedAt: new Date().toISOString(),
  };

  let applications = JSON.parse(
    localStorage.getItem("iles_applications") || "[]",
  );
  applications.push(applicationData);
  localStorage.setItem("iles_applications", JSON.stringify(applications));

  const formBody = document.querySelector(".form-body");
  if (formBody) {
    formBody.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>Application Submitted Successfully! 🎉</h3>
                <p>Your internship application has been received.</p>
                <a href="student_dashboard.html" class="btn" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 30px; border-radius: 12px; text-decoration: none; display: inline-block;">Go to Dashboard</a>
            </div>
        `;
    const progressSteps = document.querySelector(".progress-steps");
    if (progressSteps) progressSteps.style.display = "none";
  }

  alert("Application submitted successfully!");
}

function initApplicationForm() {
  console.log("Initializing application form...");

  // Check if we're on the right page
  const hasForm = document.getElementById("applicationForm");
  if (!hasForm) {
    console.log("No application form found on this page");
    return;
  }

  console.log("Found application form, setting up event listeners...");

  updateStepVisibility();

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const form = document.getElementById("applicationForm");

  console.log(
    "Buttons found - Prev:",
    !!prevBtn,
    "Next:",
    !!nextBtn,
    "Submit:",
    !!submitBtn,
  );

  if (prevBtn) {
    prevBtn.addEventListener("click", prevStep);
    console.log("Previous button listener added");
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", nextStep);
    console.log("Next button listener added");
  }
  if (submitBtn) {
    submitBtn.addEventListener("click", submitApplicationForm);
    console.log("Submit button listener added");
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }
}
// ============================================
// SECTION 13: MAIN INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Initializing...");

  initDefaultData();

  const path = window.location.pathname;
  const fileName = path.split("/").pop();
  const pageUrl = window.location.href;

  console.log("Current page:", fileName);
  console.log("Full URL:", pageUrl);

  // Check for welcome page
  if (
    fileName === "welcome.html" ||
    fileName === "" ||
    document.body.classList.contains("welcome-page")
  ) {
    initWelcomePage();
  }
  // Check for student dashboard
  else if (fileName === "student_dashboard.html") {
    loadStudentDashboard();
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) logoutBtn.onclick = logout;
  }
  // Check for log page
  else if (fileName === "log.html") {
    initLogPage();
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) logoutBtn.onclick = logout;
  }
  // Check for workplace supervisor
  else if (fileName === "workplace_supervisor.html") {
    initWorkplaceDashboard();
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) logoutBtn.onclick = logout;
    const reviewForm = document.getElementById("reviewForm");
    if (reviewForm)
      reviewForm.addEventListener("submit", submitWorkplaceReview);
  }
  // Check for academic supervisor
  else if (fileName === "academic_supervisor.html") {
    initAcademicDashboard();
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) logoutBtn.onclick = logout;
    const modalForm = document.getElementById("modalReviewForm");
    if (modalForm) modalForm.addEventListener("submit", submitAcademicReview);
  }
  // Check for admin dashboard
  else if (fileName === "admin.html") {
    initAdminDashboard();
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) logoutBtn.onclick = logout;
  }
  // ✅ FIXED: Check for application page - MORE FLEXIBLE
  else if (
    fileName.includes("application") ||
    fileName.includes("internship") ||
    document.getElementById("applicationForm")
  ) {
    console.log("Application page detected!");
    initApplicationForm();
  }

  console.log("ILES System loaded on:", fileName);
});
