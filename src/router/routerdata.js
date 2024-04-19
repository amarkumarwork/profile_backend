const express = require("express");
const employeeController = require("../controller/employee.crud");
const router = express.Router();

router.post("/adddatanew", employeeController.adddata);

router.get("/getall", employeeController.getdataalldata);
router.post("/enteruser", employeeController.userEnter);
router.post("/downloadcv", employeeController.downloadcv);
router.get("/getsingle/:id", employeeController.getsingledata);
router.patch("/updated/:id", employeeController.updateddata);
router.delete("/deleted/:id", employeeController.deletedata);
router.get("/getservice", employeeController.contentdata);

module.exports = router;
