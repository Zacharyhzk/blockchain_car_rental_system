const Express = require('express')
const Plan = require('../models/Plans')

const router = Express.Router()

const planService = require('../services/planService');

//GET ALL POLICY PLANS

/**
 * @swagger
 * components:
 *  schemas:
 *      PolicyPlan:
 *          type: object
 *          required:
 *              -amount
 *              -loanAmoount
 *              -iitialPayment
 *              -finalPayment
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto generated id from Mongo DB
 *              months:
 *                  type: number
 *                  description: Time period for the loan
 *              loanAmount:
 *                  type: number
 *                  description: Token amount of the loan
 *              payment:
 *                  type: number
 *                  description: Fee for the insurance. Pay by Bank
 *          example:
 *              _id: 60d6ffbcc743bb4d6c69da68
 *              months: 12
 *              loanAmount: 1000
 *              payment: 20
 *              
 */

/**
 * @swagger
 * tags:
 *  name: Policy Plans
 *  description: The Insurance Policy Plans API for the Microfinance
 */

/**
 * @swagger
 * /policy-plans:
 *  get:
 *      summary: Returns the list of all policy plans
 *      tags: [Policy Plans]
 *      responses:
 *          200:
 *              description: The list of all policy plans
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/PolicyPlan'
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

//GET SPECIFIC POLICY PLAN

/**
 * @swagger
 * /policy-plans/{planId}:
 *  get:
 *      summary: Get policy plan by id
 *      tags: [Policy Plans]
 *      parameters:
 *          - in: path
 *            name: planId
 *            schema:
 *              type: string
 *            required: true
 *            desciption: The policy plan id
 *      responses:
 *          200:
 *              description: The policy plan by id
 *              contents:
 *                  application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PolicyPlan'
 *          404:
 *              description: The policy pan was not found
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

// SAVE A POLICY PLAN

/**
 * @swagger
 * /policy-plans:
 *  post:
 *      summary: Create a new policy plan
 *      tags: [Policy Plans]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PolicyPlan'
 *      responses:
 *          200:
 *              description: The policy plan was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PolicyPlan'
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

//UPDATE POLICY PLAN

/**
 * @swagger
 * /policy-plans/{planId}:
 *  patch:
 *      summary: Update the policy plan by Id
 *      tags: [Policy Plans]
 *      parameters:
 *          - in: path
 *            name: planId
 *            schema:
 *              type: string
 *            required: true
 *            description: The policy plan id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PolicyPlan'
 *      responses:
 *          200:
 *              description: The policy plan was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PolicyPlan'
 *          404:
 *              description: The policy plan is not found
 *          500:
 *              description: Some server error
 */
router.patch('/:planId', async (req, res) => {
    console.log(req.params.planId);
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

//DELETE POLICY PLAN

/**
 * @swagger
 * /policy-plans/{planId}:
 *  delete:
 *      summary: Remove the policy plan by Id
 *      tags: [Policy Plans]
 *      parameters:
 *          - in: path
 *            name: planId
 *            schema:
 *              type: string
 *            required: true
 *            description: The loan plan id
 *      responses:
 *          200:
 *              description: The policy plan was successfully deleted
 *          404:
 *              description: The policy plan is not found
 *          500:
 *              description: Some server error
 */
router.delete('/:planId', async (req, res) => {
    console.log(req.params.planId);
    try {
        const plan = await planService.deletePlan(req);
        if(plan.deletedCount==0){
            res.status(404).send('Policy Plan not found');
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