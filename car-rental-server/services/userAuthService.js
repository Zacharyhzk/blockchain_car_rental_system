const UserAuth = require('../models/UserAuth')

const UserAuthService = {
	getUser: async (req) => {
		const user = new UserAuth({
			username: req.body.username,
			password: req.body.password,
			type:req.body.type,
		})
		const savedPlan = await user.save();
		return savedPlan;
		// const users = await UserAuth.find()
		// return users;
	},
	createUser: async (req) => {
		const user = new UserAuth({
			username: req.body.username,
			password: req.body.password,
			emailAddress: req.body.emailAddress,
			type:req.body.type,
		})
		const savedPlan = await user.save();
		return savedPlan;
	},
}
  
module.exports = UserAuthService;