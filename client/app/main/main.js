import React from 'react'
import Bacon from 'baconjs'
import classnames from 'classnames'

export const renderPage = applicationState =>
    <div>
        <header className="hero-unit" id="banner">
          <div className="container">
            <h1>Elimäki</h1>
            <p className="lead">plop</p>
          </div>
        </header>
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="page-header">Stats:</h1>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Count</th>
                                <th>Sum</th>
                              </tr>
                        </thead>
                        <tbody>
                            <tr className={classnames({
                                    clickable: applicationState.stats.purchasesMade.count > 0
                                })}
                                onClick={(evt) => goto(evt, '/purchase/made')}
                            >
                                <td>Purchases made</td>
                                <td>{applicationState.stats.purchasesMade.count}</td>
                                <td>{applicationState.stats.purchasesMade.total} €</td>
                            </tr>
                            <tr className={classnames({
                                    clickable: applicationState.stats.purchasesIncluded.count > 0
                                })}
                                onClick={(evt) => goto(evt, '/purchase/included')}
                            >
                                <td>Purchases included</td>
                                <td>{applicationState.stats.purchasesIncluded.count}</td>
                                <td>{applicationState.stats.purchasesIncluded.total} €</td>
                            </tr>
                            <tr className={classnames({
                                    clickable: applicationState.stats.paybacksSent.count > 0
                                })}
                                onClick={(evt) => goto(evt, '/payback/sent')}
                            >
                                <td>Paybacks sent</td>
                                <td>{applicationState.stats.paybacksSent.count}</td>
                                <td>{applicationState.stats.paybacksSent.total} €</td>
                            </tr>
                            <tr className={classnames({
                                    clickable: applicationState.stats.paybacksReceived.count > 0
                                })}
                                onClick={(evt) => goto(evt, '/payback/received')}
                            >
                                <td>Paybacks received</td>
                                <td>{applicationState.stats.paybacksReceived.count}</td>
                                <td>{applicationState.stats.paybacksReceived.total} €</td>
                            </tr>
                            <tr>
                                <td>Balance</td>
                                <td></td>
                                <td>{applicationState.stats.balance} €</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

export const pagePath = '/'

export const pageTitle = 'Stats'

const noTransactions = { count: 0, total: 0 }
export const initialState = {
    stats: {
        purchasesMade: noTransactions,
        purchasesIncluded: noTransactions,
        paybacksSent: noTransactions,
        paybacksReceived: noTransactions,
        balance: 0
    }
}

export const applicationStateProperty = initialState => Bacon.update(
    initialState
).doLog('application state')
