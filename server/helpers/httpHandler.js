const errorHandler = require("../configs/ErrorHandler");
require("dotenv").config();

const httpHandler = {
  Success: (res, data, messages = "") => {
    return res.status(errorHandler.CODE_200).json({
      data: data,
      message: messages || errorHandler.MSG_200,
      code: errorHandler.CODE_200,
    });
  },
  Created: (res, data, messages = "") => {
    return res.status(errorHandler.CODE_201).json({
      data: data,
      message: messages || errorHandler.MSG_201,
      code: errorHandler.CODE_201
    });
  },
  Servererror: (res, data, message) => {
    return res.status(errorHandler.CODE_500).json({
      data: data,
      message: message || errorHandler.MSG_500,
      code: errorHandler.CODE_500,
    });
  },
  Forbidden: (res, message) => {
    return res.status(errorHandler.CODE_403).json({
      message: message || errorHandler.MSG_403,
      code: errorHandler.CODE_403,
    });
  },

  Fail: (res, data, message = "") => {
    const logMsg = message !== "" ? message : data;
    return res.status(errorHandler.CODE_400).json({
      data: data,
      message: message || errorHandler.MSG_400,
      code: errorHandler.CODE_400,
    });
  },

  Unauthorized: (res, data) => {
    return res.status(errorHandler.CODE_401).json({
      data: data,
      message: errorHandler.MSG_401,
      code: errorHandler.CODE_401,
    });
  },

  Notfound: (res, data) => {
    return res.status(errorHandler.CODE_403).json({
      data: data,
      message: errorHandler.MSG_403,
      code: errorHandler.CODE_403,
    });
  },
};


module.exports = httpHandler;
