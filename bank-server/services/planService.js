const Plan = require('../models/Plans')

const planService = {
	getPlans: async () => {
		const plans = await Plan.find()
		return plans;
	},
	getPlanById: async (req) => {
		const plans = await Plan.findById(req.params.planId);
		return plans;
	},
	createPlan: async (req) => {
		const plan = new Plan({
			minMonths: req.body.minMonths,
			maxMonths: req.body.maxMonths,
			minAmount: req.body.minAmount,
			maxAmount: req.body.maxAmount,
			interest: req.body.interest,
		})
		const savedPlan = await plan.save();
		return savedPlan;
	},
	updatePlan: async (req) => {
		const updatedPlan = await Plan.updateOne({ _id: req.params.planId },
			{
				$set: {
					minMonths: req.body.minMonths,
					maxMonths: req.body.maxMonths,
					minAmount: req.body.minAmount,
					maxAmount: req.body.maxAmount,
					interest: req.body.interest
				}
			});
		return updatedPlan;
	},
	deletePlan: async (req) => {
		const deletedPlan = await Plan.deleteOne({ _id: req.params.planId });
		return deletedPlan;
	},
}
  
module.exports = planService;