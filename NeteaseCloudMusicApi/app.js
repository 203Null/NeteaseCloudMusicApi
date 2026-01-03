#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()
const generateConfig = require('./generateConfig')
const { consturctServer, serveNcmApi } = require('./server')

const anonymousTokenPath = path.resolve(tmpPath, 'anonymous_token')

function ensureAnonymousToken() {
  if (!fs.existsSync(anonymousTokenPath)) {
    fs.writeFileSync(anonymousTokenPath, '', 'utf-8')
  }
}

let cachedApp

async function createApp() {
  if (cachedApp) return cachedApp
  ensureAnonymousToken()
  await generateConfig()
  cachedApp = await consturctServer()
  return cachedApp
}

async function handler(req, res) {
  const app = await createApp()
  return app(req, res)
}

if (require.main === module) {
  ensureAnonymousToken()
  generateConfig()
    .then(() =>
      serveNcmApi({
        checkVersion: true,
      }),
    )
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
} else {
  module.exports = handler
}
