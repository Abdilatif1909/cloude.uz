export const formatDate = (value) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('uz-UZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const getFileName = (url = '') => decodeURIComponent(url.split('/').pop() || 'file');

export const normalizePaginated = (payload) => {
  if (Array.isArray(payload)) return payload;
  return payload?.results || [];
};

export const countPaginated = (payload) => {
  if (Array.isArray(payload)) return payload.length;
  return payload?.count ?? payload?.results?.length ?? 0;
};

export const formatDuration = (seconds = 0) => {
  const total = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const toPercent = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};
