let express = require("express");
let mongoosemodeluser = require("../schema/userhandle.schame");
const { JsonWebTokenError } = require("jsonwebtoken");
const axios = require("axios");
let mongoosemodelall = require("../schema/servicedata.schama");

// userlogin

const userEnter = async (req, res) => {
  try {
    let secratekey = require("../config/jwt");
    const userID = generateUserID();
    const token = jwt.sign({ userID: userID }, secratekey, {
      expiresIn: "550h",
    });
    const entranceTime = new Date().toISOString();
    const userData = {
      userID: userID,
      timeenter: entranceTime,
      totaltimewait: "",
    };

    const newUser = new mongoosemodeluser(userData);
    await newUser.save();
    res
      .status(201)
      .json({ message: "User data saved successfully!", token: token });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateUserID = () => {
  return "someGeneratedUserID";
};

// add
let adddata = async (req, res) => {
  let { name, email, message } = req.body;
  let datatoadd = new mongoosemodeluser({
    name,
    email,
    message,
  });
  let savedata = await datatoadd.save();
  if (!savedata) {
    console.log("error to save");
    return res.status(400).json({
      message: "error",
      savedata: savedata,
    });
  }
  res.status(200).json({
    message: "success",
    savedata: savedata,
  });
};

let updateddata = async (req, res) => {
  let { id } = req.params;
  let { name, email_Id, message } = req.body;
  let datatoupate = await mongoosemodeluser.findByIdAndUpdate(
    id,
    {
      name,
      email_Id,
      message,
    },
    { new: true }
  );
  if (!datatoupate) {
    console.log("error");
    return res.status(404).json({
      message: "updateerror",
      datatoupate: datatoupate,
    });
  }
  res.status(200).json({
    message: "succes",
    datatoupate: datatoupate,
  });
};

// delete

let deletedata = async (req, res) => {
  let { id } = req.params;
  let deleted = await mongoosemodeluser.findByIdAndDelete(id);
  if (!deleted) {
    console.log("error");
    return res.status(404).json({
      message: "error",
      deleted: deleted,
    });
  }
  res.status(200).json({
    message: "success",
    deleted: deleted,
  });
};

// get
let getdataalldata = async (req, res) => {
  const { Experience, Project, Clients } = req.query;
  let filterdata = {};
  if (Experience) filter.Experience = parseFloat(Experience);
  if (Project) filter.Project = parseInt(Project);
  if (Clients) filter.Clients = parseInt(Clients);
  let getalldata = await mongoosemodeluser.find(filterdata);
  res.status(200).json({
    message: "success",
    getalldata: getalldata,
  });
};

// get service data

let contentdata = async (req, res) => {
  let getresponce = await mongoosemodelall.find();
  if (!getresponce) {
    return res.status(404).json(getdataalldata);
  }
  res.status(200).json({
    status: "true",
    message: "success data receved",
    your: getresponce,
  });
};

// getsingle
let getsingledata = async (req, res) => {
  let { id } = req.params;
  let getsingleddata = await mongoosemodeluser.findById(id);
  res.status(200).json({
    message: "single data",
    getsingleddata: [getsingleddata],
  });
};

// donwload cv

let downloadcv = async (req, res, next) => {
  try {
    const response = await axios.get("https://easyupload.io/anlk4k", {
      responseType: "arraybuffer",
    });
    const pdfContent = response.data;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="downloaded.pdf"'
    );
    res.status(200).send(pdfContent);
  } catch (error) {
    console.error("Error while fetching file:", error);
    res.status(500).json({
      status: "false",
      message: "Internal server error",
    });
  }
};

module.exports = {
  adddata,
  userEnter,
  getdataalldata,
  updateddata,
  getsingledata,
  downloadcv,
  deletedata,
  contentdata,
};
