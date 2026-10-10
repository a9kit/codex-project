const generateReference = (prefix = 'REF') => {
  return `${prefix}-${Date.now()}`;
};

const calculatePercentage = (value, total) => {
  if (!total) return 0;

  return Number(((value / total) * 100).toFixed(2));
};

const normalizeRecord = (record) => {
  return {
    ...record,
    name: record.name?.trim() || 'Unknown',
    updatedAt: record.updatedAt || new Date().toISOString(),
  };
};

const groupRecordsByStatus = (records) => {
  return records.reduce((groups, record) => {
    const status = record.status || 'pending';

    if (!groups[status]) {
      groups[status] = [];
    }

    groups[status].push(record);
    return groups;
  }, {});
};

const createOperationSummary = (operations) => {
  return {
    total: operations.length,
    successful: operations.filter((item) => item.success).length,
    failed: operations.filter((item) => !item.success).length,
  };
};

module.exports = {
  generateReference,
  calculatePercentage,
  normalizeRecord,
  groupRecordsByStatus,
  createOperationSummary,
};