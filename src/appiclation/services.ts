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

export function encryptedFileExists(encryptedDataPath: string) {
  return fs.existsSync(encryptedDataPath);
}

export function loadSecrets(encryptedDataPath: string, truncateValue = false) {
  const readStream = fs.readFileSync(encryptedDataPath);
  const data = readStream.toString().split('\n');
  const dataArray = [];

  data.forEach((line) => {
    if (!line) {
      return;
    }
    const lineArray = line.split('=');
    dataArray.push({
      key: lineArray[0],
      value: truncateValue ? truncate(lineArray[1]) : lineArray[1],
    });
  });

  return dataArray;
}
