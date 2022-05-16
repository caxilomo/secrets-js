import fs from 'fs';

export function keysExists(privateKeyPath: string, publicKeyPath: string) {
  return fs.existsSync(privateKeyPath) || fs.existsSync(publicKeyPath);
}

export function truncate(string, limit = 20) {
  if (string.length <= limit) {
    return string;
  }

  return string.slice(0, limit) + '...';
}
