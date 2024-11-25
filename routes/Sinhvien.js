var express = require('express');
var router = express.Router();
var Sinhvien = require("../models/sinhvienModels");
const sinhvienModels = require('../models/sinhvienModels');
const JWT = require('jsonwebtoken');
const config = require("../ultil/config");
const e = require('express');
//Láy tất cả danh sách sinh viên
// localhost: 3000/Sinhvien/all
router.get("/all", async function (req, res) {
    try{
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ status: false, message: "có lỗi xẩy ra" + err });
                } else {
                    var list = await productModels.find().populate("category");
                    res.status(200).json(list);
                }
            });
        } else {
            res.status(401).json({ status: false, message: "có lỗi xẩy ra" + e });
        }
       
        var list = await sinhvienModels.find();
        res.status(200).json(list);
    }catch(e){
        res.status(400).json({status: false, message: "có lỗi xẩy ra"});
    }
    
});
// Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
// localhost:3000/Sinhvien/danh-sach-cntt
router.get("/danh-sach-cntt", async function (req, res) {
    try {
        // Tìm tất cả các sinh viên có khoa là "CNTT"
        const list = await sinhvienModels.find({ subject: "CNTT" });
        res.status(200).json(list);
    } catch (e) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra trong quá trình truy xuất dữ liệu" });
    }
});
//lấy danh sách sẩn phảma có điẻm trung bình từ 6.5 đén 8.5
// localhost: 3000/Sinhvien/diem
// Lấy danh sách sinh viên có điểm từ 6.5 đến 8.5
router.get("/diem", async function(req, res) {
    try {
        var list = await Sinhvien.find({ diemtb: { $gte: 6.5, $lte: 8.5 } });
        res.json(list);
    } catch (e) {
        res.status(404).json({ status: false, message: "Lỗi server" });
    }
});
// tìm kiém thông tin sinh viên theo MSSV
//localhost:3000/Sinhvien/thong-tin-sinh-vien/:id
router.get("/thong-tin-sinh-vien/:mssv", async function(req, res) {
    try {
        const { id } = req.params;
        var detail = await sinhvienModels.findById(id);
        res.status(200).json(detail);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});
// them 1 sv moi
router.post("/add", async function(req, res) {
    try {
        const { id, subject, old, averagescore, name } = req.body;
        const newItem =  {id, subject ,old , averagescore, name};
        await collectionModel.create(newItem);
        res.status(200).json({status: true, message :"thành công"});
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

//thay đổi thông tin sinh viên theo mssv
router.put("/edit", async function(req, res) {
    try {
        const { id,averagescore, subject, old, name } = req.body;
       // tim san pham can chinh sua
       const findSinhvien = await collectionModel.findById(id);
       if(findSinhvien){
        // chinh sua
      
        
        findSinhvien.id= id ? id: findSinhvien.id;
      
        await findSinhvien.save();
        res.status(400).json({status : true, message: "thanh cong "});

       }else{
        res.status(400).json({status : false, message: "hong tim thay sv"});
       }
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

//xoa sv ra khoir danhsach

router.delete("/delete/:id", async function(req, res) {
    try {
        const { id } = req.params;
        await sinhvienModels. findByIdAndDelete(id);
        res.status(200).json({status : true, message: "thanh cong"});
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});
//lay danh sach sv thuoocj mon cntt diem tb tu 9.0 tro len
router.get("/mon", async function(req, res) {
    try {
        
        var list = await sinhvienModels.find($and [{subject:{$lte: CNtt}}, {averagescore:{$gte: averagescore}}]);
        res.status(200).json(list);
    } catch (e) {      
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

//
// Lấy sinh viên CNTT, tuổi 18-20, DTB >= 6.5
router.get("/CNTT&T&DTB", async function(req, res) {
    try {
        const list = await Sinhvien.find({
            subject: "CNTT",
            averagescore: { $gte: 6.5 },
            old: { $gte: 18, $lte: 20 },
        });
        res.json(list);
    } catch (e) {
        res.status(404).json({ status: false, message: "Lỗi server" });
    }
});

// Lấy danh sách sinh viên, điểm tăng dần
router.get("/tangdan", async function(req, res) {
    try {
        const list = await Sinhvien.find().sort({ averagescore: 1});
        res.json(list);
    } catch (e) {
        res.status(404).json({ status: false, message: "Lỗi server" });
    }
});

// Lấy sinh viên có điểm cao nhất, BM CNTT
router.get("/diemtbcaonhat", async function(req, res) {
    try {
        const list = await Sinhvien.find({ subject: "CNTT" }).sort({ averagescore: -1 }).limit(1);
        res.json(list);
    } catch (e) {
        res.status(404).json({ status: false, message: "Lỗi server" });
    }
});




module.exports = router;