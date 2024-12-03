const router = require("express").Router();
const userController = require("../controllers/userController");
const middlewareController = require("../controllers/middlewareController");
const apiConstants = require("../configs/ApiConstant");
const cloudinaryConfig = require("../configs/CloundinaryConfig");
const upload = require("../configs/MulterConfig");

router.get(apiConstants.API_GET_CURRENT_USER, middlewareController.verifyToken, userController.getCurrentUser);
router.patch(apiConstants.API_UPDATE_USER_PROFILE, middlewareController.verifyToken, userController.updateUser);
router.patch(apiConstants.API_UPDATE_USER_PASSWORD, middlewareController.verifyToken, userController.changePassword);
router.patch(apiConstants.API_UPDATE_USER_AVATAR, cloudinaryConfig.uploadToCloud, middlewareController.verifyToken, userController.changeAvatar);
router.get(apiConstants.API_LOAD_COMMENT_USER, userController.loadCommentOfUser);
router.get(apiConstants.API_LOAD_MATCH_USER, userController.loadMatchsOfUser);
router.get(apiConstants.API_GET_LIST_USER, userController.getListUser);
router.get(apiConstants.API_GET_USER_BY_ID, userController.getUserByID);
router.get(apiConstants.API_GET_USER_PROFILE, userController.getProfile);

module.exports = router;