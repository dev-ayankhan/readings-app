const express = require("express");
const router = express.Router();
const path = require("path");

const multer = require("multer");
const Helper = require("../controllers/HelperController");
const ReadingsController = require("../controllers/ReadingsController");
const uploadDir = "assets/uploads/";
const extractDir = "assets/extracted/";

const helper = new Helper();

router.post("/upload", async (req, res) => {
  try {
    helper.__createDir(uploadDir);
    helper.__createDir(extractDir);

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });
    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 200,
      },
      fileFilter: (req, file, cb) => {
        const allowedFileTypes = /rar|zip/;
        const ext = allowedFileTypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        const mimeType = allowedFileTypes.test(file.mimetype);

        if (ext && mimeType) {
          return cb(null, true);
        } else {
          cb({
            statusCode: 400,
            status: false,
            message: "only .rar files are allowed",
            result: {},
          });
        }
      },
    });
    upload.single("file")(req, res, async (err) => {
      const serial = req?.body?.serial;
      if (!serial)
        return helper.__return(res, 400, "please provide a serial number");
      if (err instanceof multer.MulterError)
        return helper.__return(res, 400, err.message);
      else if (err) return helper.__return(res, 500);
      if (!req.file) return helper.__return(res, 400, "no file uploaded");

      const filePath = req.file.path;
      if (!filePath)
        return helper.__return(
          res,
          400,
          "file upload failed, please try again"
        );
      const readingsController = new ReadingsController();
      return readingsController.main(res, filePath, serial, extractDir);
    });
  } catch (error) {
    return helper.__return(res, 500);
  }
});

router.get("/get-readings/:serial", (req, res) => {
  try {
    const serial = req?.params?.serial;
    if (!serial) return __return(res, 400, "serial id is required");
    const readingsController = new ReadingsController();
    return readingsController.getReadings(res, serial);
  } catch (error) {
    return helper.__return(res, 500);
  }
});

module.exports = router;
