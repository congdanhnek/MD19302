var express = require('express');
var router = express.Router();
var product = require("../models/productModels");
const productModels = require('../models/productModels');
var upload = require("../ultil/uploadConfig");
var sendemail = require("../ultil/sendEmail");
const JWT = require('jsonwebtoken');
const config = require("../ultil/config");
const e = require('express');

// Lấy danh sách tất cả các sản phẩm
router.get("/All", async function (req , res) {
    try{
        const token = req.header("Authorization"). split(' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if(err){
                    res.status(403).json({status: false, message: "co loi xay ra"+ err});
                }else{
                    var list = await productModels.find(). populate("category");
                    res.status(200).json(list);
                }
                
            });
        }else{
            res.status(401).json({status: false, message:"khong xac thuc"});
        }
    }catch(e){
      res.status(400).json({status: false, message:"co loi xay ra" +e})  
    }
    
})
//lấy danh sách sp co so luong lớn hơn 20
// localhost:3000/product/sp-lon-hon?soluong=200
router.get("/sp-lon-hon", async function (req, res) {
    try {
        const token = req.header("Authorization"). split(' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if(err){
                    res.status(403).json({status: false, message: "co loi xay ra"+ err});
                }else{
                    var list = await productModels.find(). populate("category");
                    res.status(200).json(list);
                }
                
            });
        }else{
            res.status(401).json({status: false, message:"khong xac thuc"});
        }
        const { soluong } = req.query;
        var list = await productModels.find({ quantity: { $gt: soluong } });
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

// Lấy danh sách sản phẩm có giá từ 20000 đến 50000
// localhoat: 3000/product/sp-trong-khoang-gia?min=20000&max=50000
router.get("/sp-trong-khoang-gia", async function (req, res) {
    try {
        const token = req.header("Authorization"). split(' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if(err){
                    res.status(403).json({status: false, message: "co loi xay ra"+ err});
                }else{
                    var list = await productModels.find(). populate("category");
                    res.status(200).json(list);
                }
                
            });
        }else{
            res.status(401).json({status: false, message:"khong xac thuc"});
        }
        const { min, max } = req.query;
        var list = await productModels.find({ price: { $gte: min, $lte: max } });
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

// Lấy danh sách sản phẩm có số lượng nhỏ hơn 10 hoặc giá lớn hơn 15000
// localhost: 3000/product/so-sanh?soluong=10&gia=15000
router.get("/so-sanh", async function (req, res) {
    try {
        const token = req.header("Authorization"). split(' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if(err){
                    res.status(403).json({status: false, message: "co loi xay ra"+ err});
                }else{
                    var list = await productModels.find(). populate("category");
                    res.status(200).json(list);
                }
                
            });
        }else{
            res.status(401).json({status: false, message:"khong xac thuc"});
        }
        const { soluong, gia } = req.query;
        var list = await productModels.find({
            $or: [
                { quantity: { $lt: soluong } },
                { price: { $gt: gia } }
            ]
        });
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

// Lấy thông tin chi tiết của sản phẩm
// localhost:3000/product /chi-tiet-sp/:id
router.get("/chi-tiet-sp/:id", async function (req, res) {
    try {
        const { id } = req.params;
        var detail = await productModels.findById(id);
        res.status(200).json(detail);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

// thêm sản phẩm mới
router.post("/add", async function (req, res) {
    try {
        const { tensp, gia, soluong } = req.body;
        const newItem = { tensp, gia, soluong };
        await collectionModel.create(newItem);
        res.status(200).json({ status: true, message: "thành công" });
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

//chinh sua sp
router.put("/edit", async function (req, res) {
    try {
        const { id, tensp, gia, soluong } = req.body;
        // tim san pham can chinh sua
        const findProduct = await collectionModel.findById(id);
        if (findProduct) {
            // chinh sua
            findProduct.tensp = tensp ? tensp : findProduct.tensp;
            findProduct.gia = gia ? gia : findProduct.gia;
            findProduct.soluong = soluong ? soluong : findProduct.soluong;
            await findProduct.save();
            res.status(400).json({ status: true, message: "thanh cong " });

        } else {
            res.status(400).json({ status: false, message: "hong tim thay sp" });
        }
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});
// xoa
router.delete("/delete/:id", async function (req, res) {
    try {
        const { id } = req.params;
        await productModels.findByIdAndDelete(id);
        res.status(200).json({ status: true, message: "thanh cong" });
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

//uploadfile
//localhost:3000/product/upload
router.post('/upload', [upload.single('image')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
                return res.json({ status: 0, link: "" });
            } else {
                const url = `http://localhost:3000/images/${file.filename}`;
                return res.json({ status: 1, url: url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({ status: 0, link: "" });
        }
    });





//sendemail

//localhost:3000/product/send-email
router.post("/send-mail", async function (req, res, next) {
    try {
        const { to, subject, content } = req.body;

        const mailOptions = {
            from: "tridinhne <admin@dinhnt.com>",
            to: to,
            subject: subject,
            html: content
        };
        await sendMail.transporter.sendMail(mailOptions);
        res.json({ status: 1, message: "Gửi mail thành công" });
    } catch (err) {
        res.json({ status: 0, message: "Gửi mail thất bại" });
    }
});









module.exports = router;
