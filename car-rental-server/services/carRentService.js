const CarRent = require('../models/CarRent')

const carRentService = {
    getCarRent: async () => {
		const carRents = await CarRent.find();
		return carRents;
	},
    // find user's all rent request by his/her id
	getCarRentById: async (req) => {
		const carRent = await CarRent.findById(req.params.userId);
		return carRent;
	},
	saveCarRent: async (req) => {
		const carRent = new CarRent({
			userId: req.body.userId,
            socialId: req.body.socialId,
            userName: req.body.userName,
            userAge: req.body.userAge,
            walletAddress: req.body.walletAddress,
		})

		const savedCarRent = await carRent.save();
		return savedCarRent;
	},

    /* 
    这两个因为没有carRent的唯一标识符pk写不下去，如果要改就要从contract改到module到这里
	updateCarRent: async (req) => {
		const updatedCarRent = await CarRent.updateOne({ _id: req.params.Id },
			{
				$set: {
					userId: req.body.userId,
                    socialId: req.body.socialId,
                    userName: req.body.userName,
                    userAge: req.body.userAge,
                    walletAddress: req.body.walletAddress,
				}
			});
		return updatedCarRent;
	},
	dateletCarRent: async (req) => {
		const delCarRent = await CarRent.deleteOne({ _id: req.params.Id });
		return delCarRent;
	}
    */
}