import prettyBytes from 'pretty-bytes';

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

export function requestsFormatter(requests: number) {
  if (requests >= 1e6) {
    return (requests / 1e6).toFixed(1) + 'M';
  }
  if (requests >= 1e3) {
    return (requests / 1e3).toFixed(1) + 'K';
  }
  return requests.toString();
}

export function bytesFormatter(bytes: number) {
  return prettyBytes(bytes);
}
