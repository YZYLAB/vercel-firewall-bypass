"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://yzylab-news.vercel.app';
axios_1.default.get(BASE_URL).catch(async (err) => {
    const errorData = err.response.data;
    const _vcrct = errorData.split('window._vcrct="')[1].split('"')[0];
    try {
        const solution = await solveChallenge(_vcrct);
        await submitChallengeSolution(_vcrct, solution);
    }
    catch (error) {
        console.error(error);
    }
});
async function sha256(string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}
async function findMatchingKey(prefix, requiredPrefix) {
    while (true) {
        const key = Math.random().toString(36).substring(2, 15);
        const hash = await sha256(prefix + key);
        if (hash.startsWith(requiredPrefix)) {
            return { key, hash };
        }
    }
}
async function solveChallenge(challengeToken) {
    const decodedToken = atob(challengeToken.split('.')[3]);
    const [prefix, suffix, startHash, iterations] = decodedToken.split(';');
    let currentHash = startHash;
    const keys = [];
    for (let i = 0; i < Number(iterations); i++) {
        const { key, hash } = await findMatchingKey(suffix, currentHash);
        keys.push(key);
        currentHash = hash.slice(-currentHash.length);
    }
    return keys.join(';');
}
async function submitChallengeSolution(challengeToken, solution) {
    const headers = {
        'x-vercel-challenge-token': challengeToken,
        'x-vercel-challenge-solution': solution,
    };
    const response = await (0, axios_1.default)(BASE_URL + '/.well-known/vercel/security/request-challenge', { method: 'POST', headers });
    console.log('Challenge submission status:', response.status);
}
