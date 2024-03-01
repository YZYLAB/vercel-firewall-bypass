# Vercel Firewall Bypass


![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## Description

Easy way to bypass vercels new 'firewall'. 

![License](https://i.gyazo.com/a88a9c65d3a1d9ca1a348567b74235e8.png)


## How to run?

```
git clone https://github.com/YZYLAB/vercel-firewall-bypass.git
cd vercel-firewall-bypass
npm install
npx tsc
node index.js

204 means it returned a valid cookie. Use this cookie in any request to bypass the firewall screen.
