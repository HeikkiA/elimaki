import React from 'react'
import Bacon from 'baconjs'
import request from 'superagent-bluebird-promise'
import cookie from 'react-cookie';
import classnames from 'classnames'

export const renderPage = applicationState =>
    <div className="container">
        <div className="row">
            <div className="col-sm-12">
                <h1>Login</h1>
            </div>
            <div className="col-sm-12">
                <form className="form" method="post" onSubmit={(evt) => {
                    evt.preventDefault()
                    submitBus.push({email: evt.target.email.value, password: evt.target.password.value})
                }}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" className="form-control" required/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" className="form-control" required/>
                    </div>
                    <div>
                        <button className="btn btn-lg btn-primary" type="submit">
                            Login
                        </button>
                    </div>
                    {
                        applicationState.loginFailed ?
                            <div className="has-error">
                                <span className="help-block">Login failed, please try again.</span>
                            </div>
                            :
                            undefined
                    }
                </form>
            </div>
        </div>
        <hr/>
    </div>

const submitBus = new Bacon.Bus()

const loginSucceeded = submitBus
    .flatMap(({email, password}) =>
        Bacon.fromPromise(request.post('/auth/local').send({email, password}))
    )
    .doAction(response => {
        console.log(response.body.token)
        cookie.save('token', response.body.token);
        document.location.href = '/'
    })


const loginFailed = loginSucceeded
    .map(false)
    .mapError(true)

export const pagePath = '/login'

export const pageTitle = 'Login'

export const initialState = {}

export const applicationStateProperty = initialState => Bacon.update(
    initialState,
    loginFailed, (applicationState, loginFailed) => ({...applicationState, loginFailed})
).doLog('application state')
