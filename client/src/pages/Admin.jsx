import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch("/api/admin/stats", { credentials: "include" }),
          fetch("/api/admin/users", { credentials: "include" }),
        ]);

        if (statsRes.status === 403 || usersRes.status === 403) {
          navigate("/home");
          return;
        }

        setStats(await statsRes.json());
        setUsers(await usersRes.json());
      } catch (err) {
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return (
    <div style={styles.page}>
      <p style={{ color: "#555" }}>Loading...</p>
    </div>
  );

  if (error) return (
    <div style={styles.page}>
      <p style={{ color: "red" }}>{error}</p>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoCircle}>🥗</div>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Nutriventure management panel</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={styles.statsGrid}>
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Active Today" value={stats.activeToday} />
        <StatCard label="New Signups This Month" value={stats.newSignups} />
      </div>

      {/* Users Table */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Recent Users</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Last Active</th>
              <th style={styles.th}>Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={styles.row}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </td>
                <td style={styles.td}>
                  {user.lastLoggedDate
                    ? new Date(user.lastLoggedDate).toLocaleDateString()
                    : "Never"}
                </td>
                <td style={styles.td}>
                  {user.isAdmin ? (
                    <span style={styles.badgeGreen}>Admin</span>
                  ) : (
                    <span style={styles.badgeGray}>User</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#e6f4ea",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  logoCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#4caf50",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "800",
    color: "#1a1a1a",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#555",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  statLabel: {
    margin: "0 0 6px",
    fontSize: "13px",
    color: "#777",
  },
  statValue: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#4caf50",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    margin: "0 0 1rem",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#777",
    borderBottom: "1px solid #eee",
    fontWeight: "600",
  },
  td: {
    padding: "10px 12px",
    fontSize: "14px",
    color: "#333",
    borderBottom: "1px solid #f5f5f5",
  },
  row: {
    transition: "background 0.15s",
  },
  badgeGreen: {
    background: "#e6f4ea",
    color: "#2e7d32",
    fontSize: "12px",
    padding: "3px 10px",
    borderRadius: "99px",
    fontWeight: "600",
  },
  badgeGray: {
    background: "#f5f5f5",
    color: "#777",
    fontSize: "12px",
    padding: "3px 10px",
    borderRadius: "99px",
    fontWeight: "600",
  },
};