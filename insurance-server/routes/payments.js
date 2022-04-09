const Express = require('express')
const LoanPayment = require('../models/PolicyPayment');
const { getPolicyPayments } = require('../services/policyPaymentService');

const router = Express.Router()

const policyPaymentService = require('../services/policyPaymentService');

/**
 * @swagger
 * components:
 *  schemas:
 *      PolicyPayment:
 *          type: object
 *          required:
 *              -policyId
 *              -amount
 *              -transactionHash
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto generated id from Mongo DB
 *              policyId:
 *                  type: number
 *                  description: Insurance Policy id
 *              amount:
 *                  type: number
 *                  description: Paid amount in tokens
 *              transactionHash:
 *                  type: sring
 *                  description: Blockchain transaction hash
 *          example:
 *              _id: 60d6ffbcc743bb4d6c69da68
 *              policyId: 1
 *              amount: 300
 *              transactionHash: '0x0025a9562a86021ec187a33d6c3ad65a5ee3538b52e383769fec675fd500387d'
 *              
 */


/**
 * @swagger
 * tags:
 *  name: Policy Payments
 *  description: The insurance Policy Payment API for the Microfinance
 */

//GET ALL INSURANCE POLICY PAYMENTS

/**
 * @swagger
 * /policy-payments:
 *  get:
 *      summary: Returns the list of all insurance policy payment transactions
 *      tags: [Policy Payments]
 *      responses:
 *          200:
 *              description: The list of the policy payments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/PolicyPayment'
 */
router.get('/', async (req, res) => {
    try {
		const policyPayments = await policyPaymentService.getPolicyPayments();
		res.json(policyPayments);
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
 * /policy-payments/{paymentId}:
 *  get:
 *      summary: Get Insurance Policy payment by id
 *      tags: [Policy Payments]
 *      parameters:
 *          - in: path
 *            name: paymentId
 *            schema:
 *              type: string
 *            required: true
 *            desciption: The insurance policy payment id
 *      responses:
 *          200:
 *              description: The insurance policy payment by id
 *              contents:
 *                  application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PolicyPayment'
 *          404:
 *              description: The insurance policy payment was not found
 *                      
 *                  
 *          
 */
 router.get('/:paymentId', async (req, res) => {
    try{
		const policyPayments = await policyPaymentService.getPolicyPaymentById(req);
		res.json(policyPayments);
    }
    catch(err){
        res.json({
            message: err
        })
    }
    
})

// SUBMIT A INSURANCE POLICY PAYMENT

/**
 * @swagger
 * /policy-payments:
 *  post:
 *      summary: Add new Insurance Policy payment entry
 *      tags: [Policy Payments]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PolicyPayment'
 *      responses:
 *          200:
 *              description: The insurance policy payment was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PolicyPayment'
 *          500:
 *              description: Some server error
 */
 router.post('/', async (req, res) => {
    try {
		const policyPayment = await policyPaymentService.savePolicyPayment(req);
		res.json(policyPayment);
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})

//UPDATE INSURANCE POLICY PAYMENT

/**
 * @swagger
 * /policy-payments/{paymentId}:
 *  patch:
 *      summary: Update the insurance policy payment by Id
 *      tags: [Policy Payments]
 *      parameters:
 *          - in: path
 *            name: paymentId
 *            schema:
 *              type: string
 *            required: true
 *            description: The insurance policy payment id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PolicyPayment'
 *      responses:
 *          200:
 *              description: The insurance policy paymentwas successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PolicyPayment'
 *          404:
 *              description: The loan payment is not found
 *          500:
 *              description: Some server error
 */
 router.patch('/:paymentId', async (req, res) => {
    console.log(req.params.paymentId);
    try {
        const updatedPayment = await policyPaymentService.updatePolicyPayment(req);
        res.json(updatedPayment);
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})

//DELETE INSURANCE POLICY PAYMENT

/**
 * @swagger
 * /policy-payments/{paymentId}:
 *  delete:
 *      summary: Remove the insurance policy payment by Id
 *      tags: [Policy Payments]
 *      parameters:
 *          - in: path
 *            name: paymentId
 *            schema:
 *              type: string
 *            required: true
 *            description: The insurance policy payment id
 *      responses:
 *          200:
 *              description: The insurance policy payment was successfully deleted
 *          404:
 *              description: The insurance policy payment is not found
 *          500:
 *              description: Some server error
 */
 router.delete('/:paymentId', async (req, res) => {
    console.log(req.params.paymentId);
    try {
        const payment = await policyPaymentService.deletePolicyPayment(req);
        if(payment.deletedCount==0){
            res.status(404).send('Insurance Policy Payment not found');
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
