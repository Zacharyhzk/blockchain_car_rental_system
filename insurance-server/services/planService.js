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
			months: req.body.months,
			loanAmount: req.body.loanAmount,
			payment: req.body.payment,
		})
		const savedPlan = await plan.save();
		return savedPlan;
	},
	updatePlan: async (req) => {
		const updatedPlan = await Plan.updateOne({ _id: req.params.planId },
			{
				$set: {
					months: req.body.months,
					loanAmount: req.body.loanAmount,
					payment: req.body.payment
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