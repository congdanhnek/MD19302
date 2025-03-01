var express = require('express');
var router = express.Router();

var userModel= require("../models/userModel");
const JWT = require('jsonwebtoken');
const config = require("../ultil/config");

//localhost:3000/users/all
// lay toan bo danh sach user
router.get("/all", async function(req, res){
 var list = await userModel.find(); //lay tat ca
 res.json(list);
});

//lay toan bo danh sach user co do tuoi x,
//voi x la so ma nguoi dung nhap vao

// query localhost:3000/users/findOld?oldX=xxx
router.get("/findOld", async function(req,res){
//query
const{oldX} = req.query;
var list = await userModel.find({old:{$gt: oldX}});
res.json(list);

});

// params: //localhost:3000/users/findOld2/xx

router.get("/findOld2/:oldX", async function(req,res){
    //query
    const{oldX} = req.params;
    var list = await userModel.find({old:{$gt: oldX}});
    res.json(list);
});

router.post("/login", async function (req, res) {
    try{

        const{username, password}= req.body;
        const checkUser = await userModel.findOne({username: username, password: password});
        if(checkUser== null){
            res.status(200).json({status: false, message:"mat khau khong dung"});
        }else{
            const token = JWT.sign({username: username}, config.SECRETKEY, {expiresIn:'30s' });
            const refreshToken = JWT.sign({username: username}, config.SECRETKEY, {expiresIn:'1d' });
            res.status(200).json({status: true, message: "dang nhap thanh cong", token: token, refreshToken: refreshToken});
        }
    }catch(e){
        res.status(400).json({status: false, message:" co loi xay ra"});
    }
    
})


module.exports = router;



