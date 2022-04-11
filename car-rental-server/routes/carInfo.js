const Express = require('express')
const Plan = require('../models/Plans')

const router = Express.Router()

const planService = require('../services/planService');


// 统一返回格式
var responseData;

router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: "",
  };
  next();
});

router.post("/register", async (req, res) => {

});

router.post("/signin", async (req, res) => {
});

module.exports = router;
