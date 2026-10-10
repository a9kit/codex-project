const calculateAverage = (values) => {
  if (!values.length) return 0;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const sortByPriority = (items) => {
  return [...items].sort((a, b) => b.priority - a.priority);
};

const getDashboardSummary = (data) => {
  return {
    total: data.length,
    completed: data.filter((item) => item.completed).length,
    pending: data.filter((item) => !item.completed).length,
  };
};

function Dashboard() {
  return null;
}

export default Dashboard;