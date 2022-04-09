const LoanPayment = require('../models/LoanPayment')

const loanPaymentService = {
	getLoanPayments: async () => {
		const loanPayments = await LoanPayment.find()
		return loanPayments;
	},
	getLoanPaymentById: async (req) => {
		const loanPayment = await LoanPayment.findById(req.params.paymentId);
		return loanPayment;
	},
	saveLoanPayment: async (req) => {
		const loanPayment = new LoanPayment({
			loanId: req.body.loanId,
			amount: req.body.amount,
			transactionHash: req.body.transactionHash,
		})

		const savedLoanPayment = await loanPayment.save();
		return savedLoanPayment;
	},
	updateLoanPayment: async (req) => {
		const updatedPayment = await LoanPayment.updateOne({ _id: req.params.paymentId },
			{
				$set: {
					loanId: req.body.loanId,
					amount: req.body.amount,
					transactionHash: req.body.transactionHash,
				}
			});
		return updatedPayment;
	},
	deleteLoanPayment: async (req) => {
		const payment = await LoanPayment.deleteOne({ _id: req.params.paymentId });
		return payment;
	}

}
  
module.exports = loanPaymentService;