const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "D:/uploads/")
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "-" + file.originalname);
    }
})

// const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = upload;