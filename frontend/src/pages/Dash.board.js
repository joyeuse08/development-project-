
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  student: 'Student',
  workplace: 'Workplace Supervisor',
  academic: 'Academic Supervisor',
  admin: 'Internship Administrator',
};

const StudentSection = () => (
  <section>
    <h2>My Internship</h2>
    <ul>
      <li>View / submit weekly logs</li>
      <li>View placement details</li>
      <li>View supervisor feedback</li>
      <li>Report an issue</li>
    </ul>
  </section>
);

const WorkplaceSection = () => (
  <section>
    <h2>Supervised Students</h2>
    <ul>
      <li>Review student weekly logs</li>
      <li>Submit feedback</li>
      <li>View placement list</li>
    </ul>
  </section>
);

const AcademicSection = () => (
  <section>
    <h2>Academic Oversight</h2>
    <ul>
      <li>Review student progress</li>
      <li>Submit academic feedback</li>
      <li>View placements</li>
    </ul>
  </section>
);

const AdminSection = () => (
  <section>
    <h2>Administration</h2>
    <ul>
      <li>Manage users</li>
      <li>Manage placements</li>
      <li>View issues</li>
      <li>View weighted scores</li>
    </ul>
  </section>
);

const ROLE_SECTIONS = {
  student: <StudentSection />,
  workplace: <WorkplaceSection />,
  academic: <AcademicSection />,
  admin: <AdminSection />,
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const roleLabel = ROLE_LABELS[user?.role] || user?.role || 'User';
  const roleSection = ROLE_SECTIONS[user?.role] || null;

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {user?.username}</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <p><strong>Role:</strong> {roleLabel}</p>
      {user?.department && <p><strong>Department:</strong> {user.department}</p>}
      {roleSection}
    </div>
  );
};

export default Dashboard;
