const CarInfo = require('../models/CarInfo')

const carInfoService = {
    getAllCars: async () => {
        const allCars = await CarInfo.find();
        return allCars
    },
    getCarInfoByID: async (req) => {
        const carInfo = await CarInfo.findById(req.params.carId);
        return carInfo;
    },
    saveCarInfo: async (req) => {
        const carInfo = new carInfo({
            carId: req.body.carId,
            carBrand: req.body.carId,
            carDescription: req.body.carDescription,
            carVin: req.body.carVin,
            carSeat: req.body.carSeat,
            carAvailable: req.body.carAvailable,
            carPrice: req.body.carPrice
        })
        const savedCarInfo = await carInfo.save();
        return savedCarInfo;
    },
    updateCarInfo: async (req) => {
        const updatedCarInfo = await CarInfo.updateOne({ _id: req.params.carId },
			{
				$set: {
					carId: req.body.carId,
                    carBrand: req.body.carId,
                    carDescription: req.body.carDescription,
                    carVin: req.body.carVin,
                    carSeat: req.body.carSeat,
                    carAvailable: req.body.carAvailable,
                    carPrice: req.body.carPrice
				}
			});
		return updatedCarInfo;
    },
    deleteCarInfo: async (req) => {
        const delcarInfo = await CarIndo.deleteOne({
            _id: req.params.carId 
        });
        return delcarInfo;
    }
}

module.exports = carInfoService;
