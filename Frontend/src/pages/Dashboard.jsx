import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { get } from "../api";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ count: 0, totalHours: 0, recent: [], overview: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const total = await get("/api/dashboard/getTotalJournal");
        const hours = await get("/api/dashboard/getTotalStudyHour");
        const recent = await get("/api/dashboard/getRecentJournal");
        const overview = await get("/api/dashboard/productivity");

        setStats({
          count: total.count || 0,
          totalHours: hours.totalStudyHours || 0,
          recent: recent.recentTopics || [],
          overview: overview.overview || [],
        });
      } catch (err) {
        setError(err.message || "Unable to load dashboard.");
      }
    };

    loadStats();
  }, []);

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h1>Welcome back, {user?.name}</h1>
          <p>Review your journals and study metrics.</p>
        </div>
      </div>

      <div className="grid cards">
        <div className="card">
          <h2>Total Journals</h2>
          <p>{stats.count}</p>
        </div>
        <div className="card">
          <h2>Total Study Hours</h2>
          <p>{stats.totalHours}</p>
        </div>
      </div>

      <div className="grid cards">
        <div className="card card-full">
          <h2>Recent Topics</h2>
          {stats.recent.length ? (
            <ul>
              {stats.recent.map((item) => (
                <li key={item._id}>{item.topicName}</li>
              ))}
            </ul>
          ) : (
            <p>No recent journals yet.</p>
          )}
        </div>
        <div className="card card-full">
          <h2>Productivity Overview</h2>
          {stats.overview.length ? (
            <ul>
              {stats.overview.map((item) => (
                <li key={item._id}>
                  {item._id}: {item.count}
                </li>
              ))}
            </ul>
          ) : (
            <p>No productivity data available.</p>
          )}
        </div>
      </div>

      {error && <p className="error">{error}</p>}
    </section>
  );
}
