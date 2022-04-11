const RentRecord = require('../models/RentRecord')

const rentRecordService = {
    getRentRecords: async () => {
        const records = await RentRecord.find();
        return records;
    },
    getRentRecordById: async (req) => {
        const record = await RentRecord.findById(req.params.renterRecordId);
        return record;

    },
    saveRentRecord: async (req) => {
        const rentRecord = new RentRecord({
            renterRecordId: req.body.renterRecordId,
            carId: req.body.carId,
            renterId: req.body.renterId,
            walletAddress: req.body.walletAddress,
            startDate: req.body.startDate,
            duration: req.body.duration,
            carRenturned: req.body.carRenturned,
            extraFee: req.body.extraFee,
            deposit: req.body.deposit,
            rentState: req.body.rentState,
        })
        const savedRecord = await rentRecord.save();
        return savedRecord;
    },
    updateRentRecord: async (req) => {
        const updatedRecord = await RentRecord.updateOne({_id: req.params.renterRecordId},
            {
                $set: {
                    renterRecordId: req.body.renterRecordId,
                    carId: req.body.carId,
                    renterId: req.body.renterId,
                    walletAddress: req.body.walletAddress,
                    startDate: req.body.startDate,
                    duration: req.body.duration,
                    carRenturned: req.body.carRenturned,
                    extraFee: req.body.extraFee,
                    deposit: req.body.deposit,
                    rentState: req.body.rentState,
                }
            });
            return updatedRecord;
    },
    deleteRentRecord: async (req) => {
        const delRecord = await RentRecord.deleteOne({_id: req.params.renterRecordId});
        return delRecord;
    }
}

module.exports = rentRecordService;