import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import basePage from '../client/app/basePage.js'
import * as pages from '../client/app/pages.js'
import path from 'path'
import sass from 'node-sass'
import compression from 'compression'
import crypto from 'crypto'
import Promise from 'bluebird'
import mongoose from 'mongoose'
import config from './config/environment'

import favicon from 'serve-favicon'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import errorHandler from 'errorhandler'
import passport from 'passport'

const fs = Promise.promisifyAll(require('fs'))

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options)

// Populate DB with sample data
if (config.seedDB) {
    require('./config/seed')
}

const server = express()
server.use(compression({threshold: 512}))
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(methodOverride())
server.use(cookieParser())
server.use(passport.initialize())

if ('production' === process.env.NODE_ENV) {
    server.use(favicon(path.join(config.root, 'public', 'favicon.ico')))
    server.set('appPath', config.root + '/public')
    server.use(morgan('dev'))
} else {
    server.use(require('connect-livereload')())
    server.set('appPath', 'client')
    server.use(morgan('dev'))
    server.use(errorHandler()) // Error handler - has to be last
}

const cssFilePath = path.resolve(`${__dirname}/../.generated/style.css`)
const bundleJsFilePath = path.resolve(`${__dirname}/../.generated/bundle.js`)

server.get('*', (req, res, next) => {
    const page = pages.findPage(req.url)
    if (page) {
        Promise
            .all([checksumPromise(cssFilePath), checksumPromise(bundleJsFilePath)])
            .then(([cssChecksum, bundleJsChecksum]) => {
                res.send(ReactDOMServer.renderToString(basePage(
                    page,
                    page.initialState,
                    { cssChecksum, bundleJsChecksum}
                )))
            })
            .catch(next)
    } else {
        next()
    }
})

const serveStaticResource = filePath => (req, res, next) => {
    checksumPromise(filePath)
        .then(checksum => {
            if (req.query.checksum == checksum) {
                const oneYearInSeconds = 60 * 60 * 24 * 356
                res.setHeader('Cache-Control', `public, max-age=${oneYearInSeconds}`)
                res.sendFile(filePath)
            } else {
                res.status(404).send()
            }
        })
        .catch(next)
}

server.get('/style.css', serveStaticResource(cssFilePath))

server.get('/bundle.js', serveStaticResource(bundleJsFilePath))

const checksumPromise = filePath =>
    fs
        .readFileAsync(filePath)
        .then(fileContent => crypto.createHash('md5').update(fileContent).digest('hex'))

export const start = port => {
    const reportPages = () => {
        pages.allPages.forEach(({pagePath}) => {
            console.log(`Page available at http://localhost:${port}${pagePath}`.green)
        })
    }
    return new Promise((resolve, reject) => {
        server.listen(port, resolve)
    }).then(reportPages)
}

const httpServer = require('http').createServer(server)
const socketio = require('socket.io')(httpServer, {
  serveClient: (process.env.NODE_ENV === 'production') ? false : true,
  path: '/socket.io-client'
})
require('./config/socketio')(socketio)
httpServer.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, server.get('env'))
})

// Expose app
exports = module.exports = server