const initialSubscribers = [
  {
    id: 1,
    name: 'Alicia Johnson',
    email: 'alicia@example.com',
    status: 'active',
    lastPaid: '2026-10-01',
    dueDate: '2026-11-01',
    plan: '$300 / month',
    country: 'United States',
  },
  {
    id: 2,
    name: 'Nadia Brooks',
    email: 'nadia@example.com',
    status: 'pending',
    lastPaid: '2026-09-24',
    dueDate: '2026-10-24',
    plan: '$300 / month',
    country: 'Canada',
  },
  {
    id: 3,
    name: 'Camila Ortiz',
    email: 'camila@example.com',
    status: 'overdue',
    lastPaid: '2026-09-18',
    dueDate: '2026-10-18',
    plan: '$300 / month',
    country: 'Mexico',
  },
  {
    id: 4,
    name: 'Sarah Lee',
    email: 'sarah@example.com',
    status: 'suspended',
    lastPaid: '2026-08-25',
    dueDate: '2026-09-25',
    plan: '$300 / month',
    country: 'United Kingdom',
  },
  {
    id: 5,
    name: 'Mia Clark',
    email: 'mia@example.com',
    status: 'active',
    lastPaid: '2026-10-03',
    dueDate: '2026-11-03',
    plan: '$300 / month',
    country: 'Australia',
  },
];

function AdminSubscriptionPage() {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [rules, setRules] = useState({
    reminder: 3,
    suspend: 7,
    deactivate: 14,
  });

  const updateSubscriberStatus = (id, nextStatus) => {
    setSubscribers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: nextStatus } : user
      )
    );
  };

  const runStandardPolicy = () => {
    setSubscribers((prev) =>
      prev.map((user) => {
        if (user.status === 'pending') return { ...user, status: 'overdue' };
        if (user.status === 'overdue') return { ...user, status: 'suspended' };
        if (user.status === 'suspended') return { ...user, status: 'inactive' };
        return user;
      })
    );
  };

  const handleRuleChange = (key, value) => {
    setRules((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="admin-header">
          <div>
            <div className="eyebrow">Admin control</div>
            <h2>Subscriber payment management</h2>
          </div>
          <button className="btn btn-primary" onClick={runStandardPolicy}>
            Run payment policy
          </button>
        </div>

        <div className="admin-grid">
          <div className="rule-panel">
            <div className="panel-title">Standard rules</div>

            <div className="rule-item">
              <label>Reminder after (days)</label>
              <input
                type="number"
                value={rules.reminder}
                onChange={(e) => handleRuleChange('reminder', e.target.value)}
              />
            </div>

            <div className="rule-item">
              <label>Suspend after (days)</label>
              <input
                type="number"
                value={rules.suspend}
                onChange={(e) => handleRuleChange('suspend', e.target.value)}
              />
            </div>

            <div className="rule-item">
              <label>Deactivate after (days)</label>
              <input
                type="number"
                value={rules.deactivate}
                onChange={(e) => handleRuleChange('deactivate', e.target.value)}
              />
            </div>

            <div className="rule-summary">
              <div className="rule-box">
                <span>Reminder</span>
                <strong>{rules.reminder} days</strong>
              </div>
              <div className="rule-box">
                <span>Suspend</span>
                <strong>{rules.suspend} days</strong>
              </div>
              <div className="rule-box">
                <span>Deactivate</span>
                <strong>{rules.deactivate} days</strong>
              </div>
            </div>
          </div>

          <div className="summary-panel">
            <div className="panel-title">Quick stats</div>

            <div className="stats-grid">
              <div className="stat-box">
                <span>Total</span>
                <strong>{subscribers.length}</strong>
              </div>
              <div className="stat-box">
                <span>Active</span>
                <strong>{subscribers.filter((s) => s.status === 'active').length}</strong>
              </div>
              <div className="stat-box">
                <span>Pending</span>
                <strong>{subscribers.filter((s) => s.status === 'pending').length}</strong>
              </div>
              <div className="stat-box">
                <span>Overdue</span>
                <strong>{subscribers.filter((s) => s.status === 'overdue').length}</strong>
              </div>
              <div className="stat-box">
                <span>Suspended</span>
                <strong>{subscribers.filter((s) => s.status === 'suspended').length}</strong>
              </div>
              <div className="stat-box">
                <span>Inactive</span>
                <strong>{subscribers.filter((s) => s.status === 'inactive').length}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="subscriber-table-wrap">
          <div className="panel-title">Subscribers</div>

          <table className="subscriber-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Plan</th>
                <th>Last paid</th>
                <th>Due date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {subscribers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.country}</td>
                  <td>{user.plan}</td>
                  <td>{user.lastPaid}</td>
                  <td>{user.dueDate}</td>
                  <td>
                    <span className={`status-pill status-${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="table-btn"
                      onClick={() => updateSubscriberStatus(user.id, 'pending')}
                    >
                      Reminder
                    </button>
                    <button
                      className="table-btn"
                      onClick={() => updateSubscriberStatus(user.id, 'suspended')}
                    >
                      Suspend
                    </button>
                    <button
                      className="table-btn success"
                      onClick={() => updateSubscriberStatus(user.id, 'active')}
                    >
                      Re-activate
                    </button>
                    <button
                      className="table-btn danger"
                      onClick={() => updateSubscriberStatus(user.id, 'inactive')}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

export default AdminSubscriptionPage;
