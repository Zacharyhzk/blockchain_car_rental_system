const CarInfo = require('../models/CarInfo')

const carInfoService = {
    getAllCars: async () => {
        const allCars = await CarInfo.find()
        return allCars
    }
}
