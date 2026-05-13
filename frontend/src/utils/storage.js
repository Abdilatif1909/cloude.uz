const ACCESS_TOKEN_KEY = 'webedu_access';
const REFRESH_TOKEN_KEY = 'webedu_refresh';
const USER_KEY = 'webedu_user';
const THEME_KEY = 'webedu_theme';
const DOWNLOADED_FILES_KEY = 'webedu_downloads';
const TEST_SESSION_PREFIX = 'webedu_test_session_';
const TEST_RESULT_PREFIX = 'webedu_test_result_';

const parse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const sessionStorageUtil = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUser: () => parse(localStorage.getItem(USER_KEY)),
  setSession: ({ access, refresh, user }) => {
    if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setUser: (user) => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const themeStorage = {
  getTheme: () => 'light',
  setTheme: () => localStorage.setItem(THEME_KEY, 'light'),
};

export const downloadStorage = {
  getDownloads: () => parse(localStorage.getItem(DOWNLOADED_FILES_KEY), []),
  trackDownload: (item) => {
    const items = downloadStorage.getDownloads();
    const record = {
      id: `${item.type}-${item.id ?? item.title}`,
      type: item.type,
      title: item.title,
      fileUrl: item.file_url || item.fileUrl || item.download_url,
      downloadedAt: new Date().toISOString(),
    };
    const next = [record, ...items.filter((entry) => entry.id !== record.id)].slice(0, 20);
    localStorage.setItem(DOWNLOADED_FILES_KEY, JSON.stringify(next));
    return next;
  },
};

export const testSessionStorage = {
  getSession: (testId) => parse(localStorage.getItem(`${TEST_SESSION_PREFIX}${testId}`), null),
  setSession: (testId, value) => localStorage.setItem(`${TEST_SESSION_PREFIX}${testId}`, JSON.stringify(value)),
  clearSession: (testId) => localStorage.removeItem(`${TEST_SESSION_PREFIX}${testId}`),
};

export const testResultStorage = {
  getResult: (resultId) => parse(localStorage.getItem(`${TEST_RESULT_PREFIX}${resultId}`), null),
  setResult: (resultId, value) => localStorage.setItem(`${TEST_RESULT_PREFIX}${resultId}`, JSON.stringify(value)),
  clearResult: (resultId) => localStorage.removeItem(`${TEST_RESULT_PREFIX}${resultId}`),
};
