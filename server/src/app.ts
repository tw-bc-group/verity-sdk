import bodyParser = require('body-parser')
import express = require('express')
import * as _sodium from 'libsodium-wrappers'
import { Agency } from './services/agency'
import { Configuration } from './services/agency/protocol-extensions/configuration'
import { Connection } from './services/agency/protocol-extensions/connection'
import { PaymentRuntime } from './services/libnullpay'
import { Vcx } from './services/vcx'

async function startServices() {
    try {
        const nullPay = new PaymentRuntime()
        await nullPay.initPayment()

        const vcx = new Vcx()
        await vcx.init()

    } catch (e) {
        throw e
    }
}

startServices().then(async () => {
    console.log('Services successfully started')
    console.log('Initializing Protocols in Agency')

    const blankConfig = {
        fromDID: '',
        fromVK: '',
        myDID: '',
        myVerkey: '',
        webhook: '',
    }

    /**
     * Initialize protocols here you would like to plug into the agency
     * All protocols must extend the abstract protocol class
     */
    const config = new Configuration(blankConfig)
    const connection = new Connection(blankConfig)

    const agency = new Agency([
        config,
        connection,
    ])

    await agency.Ready
    console.log('Agency services successfully started')

    const app = express()
    const port = 8080

    app.use(bodyParser.raw())
    app.use(bodyParser.urlencoded({
        extended: true,
    }))
    app.use((_R, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        next()
    })

    app.listen(port, () => console.log(`express server has started and is listening on port ${port}`))

    app.get('/agency', async (_R, res) => {
        res.send({ DID: agency.config.myDID, verKey: agency.config.myVerkey })
    })

    app.post('/agency', async ( req, res) => {
        agency.provision(req.body, res)
    })

    app.post('/msg', async (req, res) => {
        agency.newMessage(req.body)
        res.sendStatus(200)
    })
}).catch((e) => {
    console.log('Services NOT started! Error: ', e)
})
