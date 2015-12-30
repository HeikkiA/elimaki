import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import path from 'path'
import sass from 'node-sass'
import compression from 'compression'
import crypto from 'crypto'
import Promise from 'bluebird'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import config from './config/environment'
import basePage from '../client/app/basePage.js'
import * as pages from '../client/app/pages.js'

const fs = Promise.promisifyAll(require('fs'))

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options)

// Populate DB with sample data
if (config.seedDB) {
    require('./config/seed')
}

const server = express()
// const httpServer = require('http').createServer(server)
// const socketio = require('socket.io')(httpServer, {
//   serveClient: (process.env.NODE_ENV === 'production') ? false : true,
//   path: '/socket.io-client'
// })
// require('./config/socketio')(socketio)

server.use(compression({threshold: 512}))
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(cookieParser())
server.use(passport.initialize())

require('./routes')(server)

const cssFilePath = path.resolve(`${__dirname}/../.generated/style.css`)
const bundleJsFilePath = path.resolve(`${__dirname}/../.generated/bundle.js`)

server.get('*', (req, res, next) => {
    const session = req.cookies.token && jwt.verify(req.cookies.token, config.secrets.session)
    console.log(session)

    var page = pages.findPage(req.url)
    if (page) {
        if (!(session && session._id) && req.url !== '/login')
            return res.redirect('/login')
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
            if (req.query.checksum) {
                if (req.query.checksum == checksum) {
                    const oneYearInSeconds = 60 * 60 * 24 * 356
                    res.setHeader('Cache-Control', `public, max-age=${oneYearInSeconds}`)
                    res.sendFile(filePath)
                } else {
                    res.status(404).send()
                }
            } else {
                res.sendFile(filePath)
            }
        })
        .catch(next)
}

server.get('/style.css', serveStaticResource(cssFilePath))
server.get('/bundle.js', serveStaticResource(bundleJsFilePath))
server.get('/images/:name', (req, res, next) =>
    serveStaticResource(path.resolve(`${__dirname}/../client/images/${req.params.name}`))(req, res, next)
)

const checksumPromise = filePath =>
    fs
        .readFileAsync(filePath)
        .then(fileContent => crypto.createHash('md5').update(fileContent).digest('hex'))

export const start = () => {
    const reportPages = () => {
        pages.allPages.forEach(({pagePath}) => {
            console.log(`Page available at http://localhost:${config.port}${pagePath}`.green)
        })
    }
    return new Promise((resolve, reject) => {
        server.listen(config.port, resolve)
        // httpServer.listen(config.port, config.ip, () => {
        //     console.log('Express server listening on %d, in %s mode', config.port, server.get('env'))
        // })
    }).then(reportPages)
}
