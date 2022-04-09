const Express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

//SWAGGER
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Car Rental Company API",
            version: "1.0.0",
            description: "Car Rental Company API for Microfinance"
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
const userAuthRoute = require('./routes/userAuth');

//MIDDLEWARE
app.use(cors())

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.use('/loan-plans', plansRoute);
app.use('/loan-payments', paymentsRoute);
app.use('/user-auth', userAuthRoute);

//ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to Car Rental Company Server')
})

//Connect to DB
const url = 'mongodb://127.0.0.1:27017/car_rental_company'
mongoose.connect(
    url,
    { useNewUrlParser: true },
    () => {
        console.log('connected to Car Rental Company DB')
    })


//LISTENING
app.listen(9092)
