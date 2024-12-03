const router = require("express").Router();
const apiConstants = require("../configs/ApiConstant");
const middlewareController = require("../controllers/middlewareController");
const adminController = require("../controllers/adminController");
const cloudinaryConfig = require("../configs/CloundinaryConfig");

router.get(apiConstants.API_ADMIN_GET_LIST_USER, middlewareController.verifyAdminToken, adminController.getListUser);
router.post(
    apiConstants.API_ADMIN_ADD_USER,
    middlewareController.verifyAdminToken,
    cloudinaryConfig.uploadToCloud,
    adminController.addUser,
);
router.put(
    apiConstants.API_ADMIN_UPDATE_USER,
    middlewareController.verifyAdminToken,
    cloudinaryConfig.uploadToCloud,
    adminController.updateUser,
);
router.delete(apiConstants.API_ADMIN_DELETE_USER, middlewareController.verifyAdminToken, adminController.deleteUser);

module.exports = router;
