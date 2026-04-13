// ============================================
// ILES SYSTEM - CORRECTED VERSION
// ============================================

console.log("ILES System Loading...");

// ============================================
// STORAGE FUNCTIONS (Global)
// ============================================

function getUsers() {
  const users = localStorage.getItem("iles_users");
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem("iles_users", JSON.stringify(users));
}

function getLogs() {
  const logs = localStorage.getItem("iles_logs");
  return logs ? JSON.parse(logs) : [];
}

function saveLogs(logs) {
  localStorage.setItem("iles_logs", JSON.stringify(logs));
}

function getCurrentUser() {
  const user = localStorage.getItem("current_user");
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  localStorage.setItem("current_user", JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem("current_user");
}

// ============================================
// UI FUNCTIONS (Global)
// ============================================

function showMessage(message, type) {
  const oldMsg = document.querySelector(".message");
  if (oldMsg) oldMsg.remove();

  const msgDiv = document.createElement("div");
  msgDiv.className = "message";
  msgDiv.textContent = message;

  if (type === "success") {
    msgDiv.style.backgroundColor = "#d4edda";
    msgDiv.style.color = "#155724";
    msgDiv.style.border = "1px solid #c3e6cb";
  } else {
    msgDiv.style.backgroundColor = "#f8d7da";
    msgDiv.style.color = "#721c24";
    msgDiv.style.border = "1px solid #f5c6cb";
  }

  msgDiv.style.padding = "10px";
  msgDiv.style.borderRadius = "5px";
  msgDiv.style.marginBottom = "15px";
  msgDiv.style.textAlign = "center";

  const container = document.querySelector(".container");
  if (container) {
    container.insertBefore(msgDiv, container.firstChild);
  }

  setTimeout(() => msgDiv.remove(), 3000);
}

function showError(element, message) {
  const existingError = element.parentNode.querySelector(".field-error");
  if (existingError) existingError.remove();

  element.style.borderColor = "red";

  const errorDiv = document.createElement("div");
  errorDiv.className = "field-error";
  errorDiv.textContent = message;
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "-10px";
  errorDiv.style.marginBottom = "10px";

  element.parentNode.insertBefore(errorDiv, element.nextSibling);
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((err) => err.remove());
  document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.style.borderColor = "#ddd";
  });
}

function logout() {
  clearCurrentUser();
  showMessage("Logged out successfully!", "success");
  setTimeout(() => {
    window.location.href = "welcome.html";
  }, 1000);
}

function addLogoutButton() {
  const header = document.querySelector("header");
  if (header && !document.querySelector(".logout-btn")) {
    const btn = document.createElement("button");
    btn.textContent = "Logout";
    btn.className = "logout-btn";
    btn.style.float = "right";
    btn.style.marginTop = "10px";
    btn.style.padding = "5px 15px";
    btn.style.backgroundColor = "#dc3545";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "3px";
    btn.style.cursor = "pointer";
    btn.onclick = logout;
    header.appendChild(btn);
  }
}

// ============================================
// PAGE DETECTION (Global - Runs when page loads)
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing...");

  const page = document.body.className;
  console.log("Page class:", page);

  if (page === "welcome-page") {
    initWelcomePage();
  } else if (page === "student-page") {
    initStudentPage();
  } else if (page === "workplace-page") {
    initWorkplacePage();
  } else if (page === "academic-page") {
    initAcademicPage();
  } else if (page === "admin-page") {
    initAdminPage();
  }

  const user = getCurrentUser();
  if (user && page !== "welcome-page") {
    addLogoutButton();
  }
});

// ============================================
// 1. WELCOME PAGE
// ============================================

function initWelcomePage() {
  console.log("Welcome page initialized");

  // Create default admin if no users exist
  const users = getUsers();
  if (users.length === 0) {
    console.log("Creating default admin user");
    users.push({
      id: 1,
      username: "admin",
      password: "admin123",
      name: "Administrator",
      email: "admin@iles.com",
      role: "Admin",
      created: new Date().toLocaleDateString(),
    });
    saveUsers(users);
    console.log("Default admin created: username='admin', password='admin123'");
  }

  // Show login form by default
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");

  if (loginForm && registerForm) {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  }

  // Tab switching
  if (loginTab && registerTab) {
    loginTab.onclick = () => {
      loginForm.style.display = "block";
      registerForm.style.display = "none";
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
    };

    registerTab.onclick = () => {
      loginForm.style.display = "none";
      registerForm.style.display = "block";
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
    };
  }

  // Login form submit
  if (loginForm) {
    loginForm.onsubmit = function (e) {
      e.preventDefault();
      login();
    };
  }

  // Register form submit
  if (registerForm) {
    registerForm.onsubmit = function (e) {
      e.preventDefault();
      register();
    };
  }
}

function login() {
  console.log("Login function called");

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const role = document.getElementById("loginRole").value;

  clearErrors();

  if (!username || !password || role === "Select Role") {
    showMessage("Please fill all fields", "error");
    return;
  }

  const users = getUsers();
  const user = users.find(
    (u) =>
      u.username === username && u.password === password && u.role === role,
  );

  if (user) {
    setCurrentUser({
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    });
    showMessage("Login successful!", "success");
    console.log("Login successful for:", username);

    setTimeout(() => {
      if (role === "Student") window.location.href = "student.html";
      else if (role === "Workplace Supervisor")
        window.location.href = "workplace_supervisor.html";
      else if (role === "Academic Supervisor")
        window.location.href = "academic_supervisor.html";
      else if (role === "Admin") window.location.href = "admin.html";
    }, 1000);
  } else {
    showMessage("Invalid username, password, or role", "error");
    console.log("Login failed");
  }
}

function register() {
  console.log("Register function called");

  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const confirm = document.getElementById("regConfirmPassword").value.trim();
  const name = document.getElementById("regFullName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const role = document.getElementById("regRole").value;

  clearErrors();

  if (
    !username ||
    !password ||
    !confirm ||
    !name ||
    !email ||
    role === "Select Role"
  ) {
    showMessage("Please fill all fields", "error");
    return;
  }

  if (username.length < 3) {
    showMessage("Username must be at least 3 characters", "error");
    return;
  }

  if (password.length < 4) {
    showMessage("Password must be at least 4 characters", "error");
    return;
  }

  if (password !== confirm) {
    showMessage("Passwords do not match", "error");
    return;
  }

  if (!email.includes("@")) {
    showMessage("Invalid email address", "error");
    return;
  }

  const users = getUsers();
  if (users.find((u) => u.username === username)) {
    showMessage("Username already exists", "error");
    return;
  }

  const newUser = {
    id: Date.now(),
    username: username,
    password: password,
    name: name,
    email: email,
    role: role,
    created: new Date().toLocaleDateString(),
  };

  users.push(newUser);
  saveUsers(users);

  showMessage("Registration successful! You can now login.", "success");
  console.log("New user registered:", username);

  // Clear form
  document.getElementById("regUsername").value = "";
  document.getElementById("regPassword").value = "";
  document.getElementById("regConfirmPassword").value = "";
  document.getElementById("regFullName").value = "";
  document.getElementById("regEmail").value = "";
  document.getElementById("regRole").value = "Select Role";

  // Switch to login tab
  const loginTab = document.getElementById("loginTab");
  if (loginTab) loginTab.click();
}

// ============================================
// 2. STUDENT PAGE
// ============================================

function initStudentPage() {
  console.log("Student page initialized");

  const user = getCurrentUser();
  if (!user || user.role !== "Student") {
    showMessage("Please login as Student", "error");
    setTimeout(() => (window.location.href = "welcome.html"), 1500);
    return;
  }

  const userNameSpan = document.getElementById("userName");
  if (userNameSpan) {
    userNameSpan.textContent = user.name || user.username;
  }

  const logForm = document.getElementById("logForm");
  if (logForm) {
    logForm.onsubmit = function (e) {
      e.preventDefault();
      submitLog();
    };
  }

  displayStudentLogs();
}

function submitLog() {
  console.log("Submitting log");

  const week = document.getElementById("weekNumber").value.trim();
  const activities = document.getElementById("activities").value.trim();
  const challenges = document.getElementById("challenges").value.trim();

  clearErrors();

  if (!week || week < 1 || week > 52) {
    showMessage("Week number must be between 1 and 52", "error");
    return;
  }

  if (!activities || activities.length < 10) {
    showMessage(
      "Please describe your activities (minimum 10 characters)",
      "error",
    );
    return;
  }

  if (!challenges) {
    showMessage("Please describe challenges faced", "error");
    return;
  }

  const user = getCurrentUser();
  const logs = getLogs();

  if (logs.find((l) => l.student === user.username && l.week == week)) {
    showMessage(`You already submitted a log for Week ${week}`, "error");
    return;
  }

  const newLog = {
    id: Date.now(),
    week: parseInt(week),
    activities: activities,
    challenges: challenges,
    student: user.username,
    studentName: user.name,
    date: new Date().toLocaleString(),
    status: "pending",
    workplaceFeedback: "",
    workplaceScore: "",
    academicFeedback: "",
    academicScore: "",
  };

  logs.push(newLog);
  saveLogs(logs);

  showMessage(`Week ${week} log submitted successfully!`, "success");

  document.getElementById("weekNumber").value = "";
  document.getElementById("activities").value = "";
  document.getElementById("challenges").value = "";

  displayStudentLogs();
}

function displayStudentLogs() {
  const user = getCurrentUser();
  const logs = getLogs();
  const myLogs = logs
    .filter((l) => l.student === user.username)
    .sort((a, b) => b.week - a.week);

  const container = document.getElementById("myLogs");
  if (!container) return;

  if (myLogs.length === 0) {
    container.innerHTML = "<p>No logs submitted yet.</p>";
    return;
  }

  let html = "<h3>My Submitted Logs</h3>";

  myLogs.forEach((log) => {
    let statusColor = "#6c757d";
    let statusText = "Pending";

    if (log.status === "approved") {
      statusColor = "#28a745";
      statusText = "Approved";
    } else if (log.status === "reviewed_by_workplace") {
      statusColor = "#ffc107";
      statusText = "Workplace Reviewed";
    }

    html += `
            <div style="border:1px solid #ddd; border-radius:8px; padding:15px; margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between;">
                    <h4>Week ${log.week}</h4>
                    <span style="color:${statusColor}">${statusText}</span>
                </div>
                <p><strong>Date:</strong> ${log.date}</p>
                <p><strong>Activities:</strong> ${log.activities}</p>
                <p><strong>Challenges:</strong> ${log.challenges}</p>
            </div>
        `;
  });

  container.innerHTML = html;
}

// ============================================
// 3. WORKPLACE SUPERVISOR PAGE
// ============================================

function initWorkplacePage() {
  console.log("Workplace page initialized");

  const user = getCurrentUser();
  if (!user || user.role !== "Workplace Supervisor") {
    showMessage("Please login as Workplace Supervisor", "error");
    setTimeout(() => (window.location.href = "welcome.html"), 1500);
    return;
  }

  const userNameSpan = document.getElementById("userName");
  if (userNameSpan) {
    userNameSpan.textContent = user.name || user.username;
  }

  loadStudentDropdown();

  const reviewForm = document.getElementById("reviewForm");
  if (reviewForm) {
    reviewForm.onsubmit = function (e) {
      e.preventDefault();
      submitWorkplaceReview();
    };
  }

  displayPendingLogs("workplace");
}

function loadStudentDropdown() {
  const users = getUsers();
  const students = users.filter((u) => u.role === "Student");
  const select = document.getElementById("studentSelect");

  if (!select) return;

  select.innerHTML = '<option value="">Select Student</option>';
  students.forEach((s) => {
    select.innerHTML += `<option value="${s.username}">${s.name || s.username}</option>`;
  });

  select.onchange = function () {
    loadStudentWeeks(this.value);
  };
}

function loadStudentWeeks(username) {
  const logs = getLogs();
  const studentLogs = logs.filter(
    (l) => l.student === username && l.status === "pending",
  );
  const weekSelect = document.getElementById("weekSelect");

  if (!weekSelect) return;

  weekSelect.innerHTML = '<option value="">Select Week</option>';
  studentLogs.forEach((log) => {
    weekSelect.innerHTML += `<option value="${log.week}">Week ${log.week}</option>`;
  });
}

function submitWorkplaceReview() {
  const student = document.getElementById("studentSelect").value;
  const week = document.getElementById("weekSelect").value;
  const feedback = document.getElementById("feedback").value.trim();
  const score = document.getElementById("score").value.trim();

  if (!student || !week || !feedback || !score) {
    showMessage("Please fill all fields", "error");
    return;
  }

  if (score < 0 || score > 10) {
    showMessage("Score must be between 0 and 10", "error");
    return;
  }

  const logs = getLogs();
  const logIndex = logs.findIndex(
    (l) => l.student === student && l.week == week && l.status === "pending",
  );

  if (logIndex === -1) {
    showMessage("Log not found", "error");
    return;
  }

  logs[logIndex].workplaceFeedback = feedback;
  logs[logIndex].workplaceScore = score;
  logs[logIndex].status = "reviewed_by_workplace";

  saveLogs(logs);

  showMessage(`Review submitted for ${student} - Week ${week}`, "success");

  document.getElementById("feedback").value = "";
  document.getElementById("score").value = "";
  document.getElementById("studentSelect").value = "";

  const weekSelect = document.getElementById("weekSelect");
  if (weekSelect)
    weekSelect.innerHTML = '<option value="">Select Week</option>';

  displayPendingLogs("workplace");
}

function displayPendingLogs(type) {
  const logs = getLogs();
  let pendingLogs = [];

  if (type === "workplace") {
    pendingLogs = logs.filter((l) => l.status === "pending");
  } else if (type === "academic") {
    pendingLogs = logs.filter((l) => l.status === "reviewed_by_workplace");
  }

  const container = document.getElementById("pendingLogs");
  if (!container) return;

  if (pendingLogs.length === 0) {
    container.innerHTML = "<p>No pending logs to review.</p>";
    return;
  }

  let html = "<h3>Pending Logs</h3>";

  pendingLogs.forEach((log) => {
    html += `
            <div style="border:1px solid #ffc107; border-radius:8px; padding:15px; margin-bottom:15px; background:#fff3cd;">
                <h4>${log.studentName || log.student} - Week ${log.week}</h4>
                <p><strong>Submitted:</strong> ${log.date}</p>
                <p><strong>Activities:</strong> ${log.activities.substring(0, 200)}...</p>
            </div>
        `;
  });

  container.innerHTML = html;
}

// ============================================
// 4. ACADEMIC SUPERVISOR PAGE (Simplified)
// ============================================

function initAcademicPage() {
  console.log("Academic page initialized");

  const user = getCurrentUser();
  if (!user || user.role !== "Academic Supervisor") {
    showMessage("Please login as Academic Supervisor", "error");
    setTimeout(() => (window.location.href = "welcome.html"), 1500);
    return;
  }

  const userNameSpan = document.getElementById("userName");
  if (userNameSpan) {
    userNameSpan.textContent = user.name || user.username;
  }

  showMessage("Academic Supervisor page ready", "success");
}

// ============================================
// 5. ADMIN PAGE (Simplified)
// ============================================

function initAdminPage() {
  console.log("Admin page initialized");

  const user = getCurrentUser();
  if (!user || user.role !== "Admin") {
    showMessage("Please login as Admin", "error");
    setTimeout(() => (window.location.href = "welcome.html"), 1500);
    return;
  }

  const userNameSpan = document.getElementById("userName");
  if (userNameSpan) {
    userNameSpan.textContent = user.name || user.username;
  }

  displayAdminStats();
  displayAllUsers();
}

function displayAdminStats() {
  const users = getUsers();
  const logs = getLogs();

  const stats = {
    students: users.filter((u) => u.role === "Student").length,
    workplace: users.filter((u) => u.role === "Workplace Supervisor").length,
    academic: users.filter((u) => u.role === "Academic Supervisor").length,
    totalLogs: logs.length,
    pending: logs.filter((l) => l.status === "pending").length,
    approved: logs.filter((l) => l.status === "approved").length,
  };

  const container = document.getElementById("adminStats");
  if (!container) return;

  container.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:15px;">
            <div style="background:#667eea; color:white; padding:15px; border-radius:8px; text-align:center;">
                <h3>Students</h3>
                <p style="font-size:2em;">${stats.students}</p>
            </div>
            <div style="background:#f093fb; color:white; padding:15px; border-radius:8px; text-align:center;">
                <h3>Workplace</h3>
                <p style="font-size:2em;">${stats.workplace}</p>
            </div>
            <div style="background:#4facfe; color:white; padding:15px; border-radius:8px; text-align:center;">
                <h3>Academic</h3>
                <p style="font-size:2em;">${stats.academic}</p>
            </div>
            <div style="background:#43e97b; color:white; padding:15px; border-radius:8px; text-align:center;">
                <h3>Total Logs</h3>
                <p style="font-size:2em;">${stats.totalLogs}</p>
            </div>
        </div>
    `;
}

function displayAllUsers() {
  const users = getUsers();
  const container = document.getElementById("allUsers");
  if (!container) return;

  if (users.length === 0) {
    container.innerHTML = "<p>No users registered.</p>";
    return;
  }

  let html =
    '<h3>All Users</h3><table style="width:100%; border-collapse:collapse;">';
  html +=
    '<tr style="background:#f4f4f4;"><th style="padding:10px; border:1px solid #ddd;">Username</th><th style="padding:10px; border:1px solid #ddd;">Name</th><th style="padding:10px; border:1px solid #ddd;">Role</th><th style="padding:10px; border:1px solid #ddd;">Registered</th>\\n</tr>';

  users.forEach((u) => {
    html += `\\n<tr>
            <td style="padding:10px; border:1px solid #ddd;">${u.username}</td>
            <td style="padding:10px; border:1px solid #ddd;">${u.name}</td>
            <td style="padding:10px; border:1px solid #ddd;">${u.role}</td>
            <td style="padding:10px; border:1px solid #ddd;">${u.created}</td>
        </tr>`;
  });

  html += "</table>";
  container.innerHTML = html;
}

console.log("ILES System Loaded Successfully!");
