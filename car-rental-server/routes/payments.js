const Express = require('express')
const LoanPayment = require('../models/LoanPayment');

const router = Express.Router()

// const planService = require('../services/planService');
const loanPaymentService = require('../services/loanPaymentService');

//GET ALL Loan Payments
/**
 * @swagger
 * components:
 *  schemas:
 *      LoanPayment:
 *          type: object
 *          required:
 *              -borrower
 *              -loanId
 *              -amount
 *              -transactionHash
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto generated id from Mongo DB
 *              borrower:
 *                  type: string
 *                  description: Borrower address
 *              loanId:
 *                  type: number
 *                  description: Loan id
 *              amount:
 *                  type: number
 *                  description: Paid amount
 *              transactionHash:
 *                  type: sring
 *                  description: Blockchain transaction hash
 *          example:
 *              _id: 60d6ffbcc743bb4d6c69da68
 *              borrower: '0x940028a249EB48446dA6E68DD9A1927Cd4822A9f'
 *              loanId: 1
 *              amount: 300
 *              transactionHash: '0x0025a9562a86021ec187a33d6c3ad65a5ee3538b52e383769fec675fd500387d'
 *              
 */


/**
 * @swagger
 * tags:
 *  name: Loan Payments
 *  description: The Bank Loan Payment API for the Microfinance
 */

/**
 * @swagger
 * /loan-payments:
 *  get:
 *      summary: Returns the list of all loan payment transactions
 *      tags: [Loan Payments]
 *      responses:
 *          200:
 *              description: The list of the loan plans
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/LoanPayment'
 */
router.get('/', async (req, res) => {
    try {
		const loanPayments = await loanPaymentService.getLoanPayments();
		res.json(loanPayments);
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})

//GET SPECIFIC PAYMENT DETAILS

/**
 * @swagger
 * /loan-payments/{paymentId}:
 *  get:
 *      summary: Get loan plan by id
 *      tags: [Loan Payments]
 *      parameters:
 *          - in: path
 *            name: paymentId
 *            schema:
 *              type: string
 *            required: true
 *            desciption: The loan payment id
 *      responses:
 *          200:
 *              description: The loan payment by id
 *              contents:
 *                  application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoanPayment'
 *          404:
 *              description: The loan payment was not found
 *                      
 *                  
 *          
 */
 router.get('/:paymentId', async (req, res) => {
    console.log(req.params.paymentId);
    try{
		const loanPayments = await loanPaymentService.getLoanPaymentById(req);
		res.json(loanPayments);
    }
    catch(err){
        res.json({
            message: err
        })
    }
    
})

// SUBMIT A LOAN PAYMENT

/**
 * @swagger
 * /loan-payments:
 *  post:
 *      summary: Add new loan payment entry
 *      tags: [Loan Payments]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoanPayment'
 *      responses:
 *          200:
 *              description: The loan plan was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LoanPayment'
 *          500:
 *              description: Some server error
 */
 router.post('/', async (req, res) => {
    try {
		const loanPayment = await loanPaymentService.saveLoanPayment(req);
		res.json(loanPayment);
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})

//UPDATE LOAN PAYMENT

/**
 * @swagger
 * /loan-payments/{paymentId}:
 *  patch:
 *      summary: Update the loan plan by Id
 *      tags: [Loan Payments]
 *      parameters:
 *          - in: path
 *            name: paymentId
 *            schema:
 *              type: string
 *            required: true
 *            description: The loan payment id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoanPayment'
 *      responses:
 *          200:
 *              description: The loan plan was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LoanPayment'
 *          404:
 *              description: The loan payment is not found
 *          500:
 *              description: Some server error
 */
 router.patch('/:paymentId', async (req, res) => {
    console.log(req.params.paymentId);
    try {
        const updatedPayment = await loanPaymentService.updateLoanPayment(req);
        res.json(updatedPayment);
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})

//DELETE LOAN PAYMENT

/**
 * @swagger
 * /loan-payments/{paymentId}:
 *  delete:
 *      summary: Remove the loan payment by Id
 *      tags: [Loan Payments]
 *      parameters:
 *          - in: path
 *            name: paymentId
 *            schema:
 *              type: string
 *            required: true
 *            description: The loan payment id
 *      responses:
 *          200:
 *              description: The loan payment was successfully deleted
 *          404:
 *              description: The loan payment is not found
 *          500:
 *              description: Some server error
 */
 router.delete('/:paymentId', async (req, res) => {
    console.log(req.params.paymentId);
    try {
        const payment = await loanPaymentService.deleteLoanPayment(req);
        if(payment.deletedCount==0){
            res.status(404).send('Loan Payment not found');
        }
        res.json(payment);
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})

module.exports = router;
