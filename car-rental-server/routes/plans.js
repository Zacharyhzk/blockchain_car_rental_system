const Express = require('express')
const Plan = require('../models/Plans')

const router = Express.Router()

const planService = require('../services/planService');

//GET ALL Plans

/**
 * @swagger
 * components:
 *  schemas:
 *      LoanPlan:
 *          type: object
 *          required:
 *              -minMonths
 *              -maxMonths
 *              -minAmount
 *              -maxAmount
 *              -interest
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto generated id from Mongo DB
 *              minMonths:
 *                  type: number
 *                  description: Minimum time period for the loan
 *              maxMonths:
 *                  type: number
 *                  description: Maximum time period for the loan
 *              minAmount:
 *                  type: number
 *                  description: Minimum amount of the loan
 *              maxAmount:
 *                  type: number
 *                  description: Maximum amount of the loan
 *              interest:
 *                  type: number
 *                  description: Monthly interest rate for the loan
 *          example:
 *              _id: 60d6ffbcc743bb4d6c69da68
 *              minMonths: 10
 *              maxMonths: 12
 *              minAmount: 300
 *              maxAmount: 500
 *              interest: 10
 *              
 */

/**
 * @swagger
 * tags:
 *  name: Loan Plans
 *  description: The Bank Loan Plans API for the Microfinance
 */

/**
 * @swagger
 * /loan-plans:
 *  get:
 *      summary: Returns the list of all loan plans
 *      tags: [Loan Plans]
 *      responses:
 *          200:
 *              description: The list of the loan plans
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/Plan'
 */
router.get('/', async (req, res) => {
    try {
		const plans = await planService.getPlans();
		res.json(plans);
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})



//GET SPECIFIC LOAN PLAN

/**
 * @swagger
 * /loan-plans/{planId}:
 *  get:
 *      summary: Get loan plan by id
 *      tags: [Loan Plans]
 *      parameters:
 *          - in: path
 *            name: planId
 *            schema:
 *              type: string
 *            required: true
 *            desciption: The loan plan id
 *      responses:
 *          200:
 *              description: The loan plan by id
 *              contents:
 *                  application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoanPlan'
 *          404:
 *              description: The loan pan was not found
 *                      
 *                  
 *          
 */
router.get('/:planId', async (req, res) => {
    try{
        const plan = await planService.getPlanById(req);
        res.json(plan);
    }
    catch(err){
        res.json({
            message: err
        })
    }
    
})

// SUBMIT A LOAN PLAN

/**
 * @swagger
 * /loan-plans:
 *  post:
 *      summary: Create a new loan plan
 *      tags: [Loan Plans]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoanPlan'
 *      responses:
 *          200:
 *              description: The loan plan was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LoanPlan'
 *          500:
 *              description: Some server error
 */
router.post('/', async (req, res) => {
    try {
        const savedPlan = await planService.createPlan(req);
        res.json(savedPlan);
    }
    catch (err) {
        res.json({
            message: err
        })
    }


})

//UPDATE LOAN PLAN

/**
 * @swagger
 * /loan-plans/{planId}:
 *  patch:
 *      summary: Update the loan plan by Id
 *      tags: [Loan Plans]
 *      parameters:
 *          - in: path
 *            name: planId
 *            schema:
 *              type: string
 *            required: true
 *            description: The loan plan id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoanPlan'
 *      responses:
 *          200:
 *              description: The loan plan was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LoanPlan'
 *          404:
 *              description: The loan plan is not found
 *          500:
 *              description: Some server error
 */
 router.patch('/:planId', async (req, res) => {
    try {
        const updatedPlan = await planService.updatePlan(req)
        res.json(updatedPlan);
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})

//DELETE LOAN PLAN

/**
 * @swagger
 * /loan-plans/{planId}:
 *  delete:
 *      summary: Remove the loan plan by Id
 *      tags: [Loan Plans]
 *      parameters:
 *          - in: path
 *            name: planId
 *            schema:
 *              type: string
 *            required: true
 *            description: The loan plan id
 *      responses:
 *          200:
 *              description: The loan plan was successfully deleted
 *          404:
 *              description: The loan plan is not found
 *          500:
 *              description: Some server error
 */
router.delete('/:planId', async (req, res) => {
    try {
        const plan = await planService.deletePlan(req);
        if(plan.deletedCount==0){
            res.status(404).send('Loan Plan not found');
        }
        res.json(plan);
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})

module.exports = router;