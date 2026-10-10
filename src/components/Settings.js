const DEFAULT_SETTINGS = {
  theme: 'light',
  notifications: true,
  pageSize: 10,
};

const mergeSettings = (current, updates) => {
  return {
    ...DEFAULT_SETTINGS,
    ...current,
    ...updates,
  };
};

const isValidPageSize = (size) => {
  return Number.isInteger(size) && size > 0 && size <= 100;
};

const resetSettings = () => {
  return { ...DEFAULT_SETTINGS };
};

function Settings() {
  return null;
}

export default Settings;