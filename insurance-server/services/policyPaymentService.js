const PolicyPayment = require('../models/PolicyPayment')

const policyPaymentService = {
	getPolicyPayments: async () => {
		const policyPayments = await PolicyPayment.find()
		return policyPayments;
	},
	getPolicyPaymentById: async (req) => {
		const policyPayment = await PolicyPayment.findById(req.params.paymentId);
		return policyPayment;
	},
	savePolicyPayment: async (req) => {
		const policyPayment = new PolicyPayment({
			policyId: req.body.policyId,
			amount: req.body.amount,
			transactionHash: req.body.transactionHash,
		})

		const savedPolicyPayment = await policyPayment.save();
		return savedPolicyPayment;
	},
	updatePolicyPayment: async (req) => {
		const updatedPayment = await PolicyPayment.updateOne({ _id: req.params.paymentId },
			{
				$set: {
					policyId: req.body.policyId,
					amount: req.body.amount,
					transactionHash: req.body.transactionHash,
				}
			});
		return updatedPayment;
	},
	deletePolicyPayment: async (req) => {
		const payment = await PolicyPayment.deleteOne({ _id: req.params.paymentId });
		return payment;
	}

}
  
module.exports = policyPaymentService;