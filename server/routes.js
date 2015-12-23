/**
 * Main application routes
 */
module.exports = app => {

    // Insert routes below
    app.use('/api/categories', require('./api/category'))
    app.use('/api/paybacks', require('./api/payback'))
    app.use('/api/purchases', require('./api/purchase'))
    app.use('/api/users', require('./api/user'))
    app.use('/auth', require('./auth'))

    // All undefined asset or api routes should return a 404
    // app.route('/:url(api|auth|components|app|images)/*')
    //     .get(errors[404])

    // All other routes should redirect to the index.html
    // app.route('/*')
    //     .get((req, res) => {
    //         res.sendFile(app.get('appPath') + '/index.html')
    //     })
}