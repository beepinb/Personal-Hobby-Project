const express = require("express");
const router = express.Router();
const tvSeriesController = require("../controllers/tvSeries.controller");
const actorController = require("../controllers/actor.controller");

router.route("/tvseries")
    .get(tvSeriesController.getAllSeries)//working
    .post(tvSeriesController.addOne)//working

router.route("/tvseries/:seriesId")
    .get(tvSeriesController.getOne)//working
    .put(tvSeriesController.updateOne) //working
    .delete(tvSeriesController.deleteOne);//working

router.route("/tvseries/:seriesId/cast")
    .get(actorController.getAll)//working
    .post(actorController.addOne);//working

router.route("/tvseries/:seriesId/cast/:actorId")
    .get(actorController.getOne)//working
    .delete(actorController.deleteOne)//working
    .put(actorController.updateOne) //working

module.exports = router;