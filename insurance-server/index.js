const Express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

//SWAGGER
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Insurance API",
            version: "1.0.0",
            description: "Insurance API for Microfinance"
        },
        servers: [
            {
                url: "http://localhost:9092"
            }
        ],
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options)

const app = Express()

//Import Routed
const plansRoute = require('./routes/plans');
const paymentsRoute = require('./routes/payments');

//MIDDLEWARE
app.use(cors())

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.use('/policy-plans', plansRoute);
app.use('/policy-payments', paymentsRoute);

//ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to Insurance Server')
})

//Connect to DB
const url = 'mongodb://127.0.0.1:27017/insurance-db-level2'
mongoose.connect(
    url,
    { useNewUrlParser: true },
    () => {
        console.log('connected to Insurance DB')
    }
)


//LISTENING
app.listen(9092)
