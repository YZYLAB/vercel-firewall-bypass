import axios from 'axios';

const BASE_URL: string = 'https://yzylab-news.vercel.app';

axios.get(BASE_URL).catch(async (err: any) => {
  const errorData: string = err.response.data;
  const _vcrct: string = errorData.split('window._vcrct="')[1].split('"')[0];

  try {
    const solution: string = await solveChallenge(_vcrct);
    await submitChallengeSolution(_vcrct, solution);
  } catch (error) {
    console.error(error);
  }
});

async function sha256(string: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

interface KeyHashPair {
  key: string;
  hash: string;
}

async function findMatchingKey(prefix: string, requiredPrefix: string): Promise<KeyHashPair> {
  while (true) {
    const key: string = Math.random().toString(36).substring(2, 15);
    const hash: string = await sha256(prefix + key);
    if (hash.startsWith(requiredPrefix)) {
      return { key, hash };
    }
  }
}

async function solveChallenge(challengeToken: string): Promise<string> {
  const decodedToken: string = atob(challengeToken.split('.')[3]);
  const [prefix, suffix, startHash, iterations]: string[] = decodedToken.split(';');
  let currentHash: string = startHash;
  const keys: string[] = [];

  for (let i = 0; i < Number(iterations); i++) {
    const { key, hash }: KeyHashPair = await findMatchingKey(suffix, currentHash);
    keys.push(key);
    currentHash = hash.slice(-currentHash.length);
  }

  return keys.join(';');
}

async function submitChallengeSolution(challengeToken: string, solution: string): Promise<void> {
  const headers = {
    'x-vercel-challenge-token': challengeToken,
    'x-vercel-challenge-solution': solution,
  };

  const response = await axios(BASE_URL + '/.well-known/vercel/security/request-challenge', { method: 'POST', headers });
  console.log('Challenge submission status:', response.status);
}
