const fs = require("fs");

class Helper {
  __return = (res, statusCode, message = null, data = {}) => {
    if (statusCode === 500) message = "server error";
    const response = {
      statusCode: statusCode,
      status: String(statusCode)[0] == 2 ? true : false,
      message: message,
      result: data,
    };
    return res.status(statusCode).json(response);
  };

  __createDir = (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };
}

module.exports = Helper;
