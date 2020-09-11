const express = require("express");
const router = express.Router();
const userController = require("../controllers");

router.get("/", userController.doConnectAPI); // 서버 접속 연결 테스트
router.get("/post", userController.doPostAPI); // post 연결 테스트

module.exports = router;
