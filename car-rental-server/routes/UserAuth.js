const Express = require("express");
const User = require("../models/UserAuth");

const router = Express.Router();

const planService = require("../services/userAuthService");

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
  try {
    // console.log(req,"123",res)
    var username = req.body.username;
    var password = req.body.password;
    var type = req.body.type;
    // 判断用户名是否为空
    if (username == "" || password == "") {
      responseData.code = 2;
      responseData.message = "username and password cannot be null";
      res.json(responseData);
      return;
    }

    // 判断type是否为空
    if (type !== "admin" && type !== "user") {
      responseData.code = 2;
      responseData.message = "type must be user or admin";
      res.json(responseData);
      return;
    }

    // 判断用户名是否已经注册
    User.findOne(
      {
        username: username,
      },
      async function (err, doc) {
        if (doc) {
          responseData.code = 3;
          responseData.message = "username existed!";
          res.json(responseData);
          return;
        }
        await planService.createUser(req);
        // res.json(savedPlan);
        responseData.code = 4;
        responseData.message = "register successfully";
        // res.json(responseData);
        res.json(responseData);
        return;
      }
    );

    // const savedPlan = await planService.createUser(req);
    // res.json(savedPlan);
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var type = req.body.type;
    if(password == ''|| username==''){
        responseData.code = 2;
        responseData.message = 'usename or password cannot be null ';
        res.json(responseData);
        return
    }
    if(type !== "admin" && type !== "user"){
        responseData.code = 2;
        responseData.message = 'type must be user or admin';
        res.json(responseData);
        return
    }
    // define username register or not
    User.findOne({
        username:username,
        password:password,
        type:type,
    },function (err,doc) {
        if(doc){
            responseData.code = 4;
            responseData.message = 'log in successfully';
            responseData.userInfo = {
                _id: doc._id,
                username: doc.username
            };
            res.json(responseData);
            return
        }
        responseData.code = 2;
        responseData.message = 'log in fail, please enter valid info';
        res.json(responseData);
        return
    });

    // const plans = await planService.getUser(req);
    // res.json(plans);
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

module.exports = router;
