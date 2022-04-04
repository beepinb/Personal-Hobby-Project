const mongoose = require("mongoose");
const Series = mongoose.model(process.env.SERIES_MODEL);

const _updateOne = function (req, res, seriesUpdateCallback) {
    console.log("Inside updateone callback");
    console.log(req.body);
    let response = {
        status: 204,
        message: series
    };
    const seriesId = req.params.seriesId;
    let valid = mongoose.isValidObjectId(seriesId);
    if (!valid) {
        console.log("invalid Id");
        response.status = 400;
        response.message = { message: "Invalid seriesId" }
        return res.status(response.status).json(response.message)
    }
    Series.findById(seriesId).exec(function (err, series) {
        console.log("Found Series: ", series.title);
        if (err) {
            response.status = 500;
            response.message = err;
        } else if (!series) {
            console.log("Series with given Id not found");
            response.status = 404;
            response.message = { message: "There is no Series with given id" };
        }
        seriesUpdateCallback(req, res, series);
        console.log("Updated Sucessfully");
        res.status(response.status).json(response.message);

    });
}

module.exports.getOne = function (req, res) {
    const seriesId = req.params.seriesId;
    let valid = mongoose.isValidObjectId(seriesId);
    if (valid) {
        Series.findById(seriesId).exec(function (err, series) {
            const response = { status: 200, message: {} };
            if (err) {
                response.status = 500;
                response.message = err;
            } else {
                if (series) {
                    console.log("Series Found");
                    response.status = 200;
                    response.message = series;
                } else {
                    console.log("Series is null");
                    response.status = 404;
                    response.message = { message: "There is no Series with given id" };
                }
            }
            res.status(response.status).json(response.message);
        })
    } else {
        console.log("Invalid Series Id");
        res.status(404).json({ message: "Invalid Series Id" });
    }
}

module.exports.getAllSeries = function (req, res) {
    console.log("Inside Series Controller");
    const response = {
        status: 200,
        message: {}
    };
    let offset = 0;
    let count = 5;
    const maxCount = 6;
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }
    if (isNaN(offset) || isNaN(count)) {
        console.log("Offset or count is not a number");
        response.status = 400;
        response.message = { message: "offset and count must be digits" };
    }
    else if (count > maxCount) {
        console.log("count greater than max");
        response.status = 400;
        response.message = { message: "count must be less than 10" };
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    } else {
        Series.find().skip(offset).limit(count).exec(function (err, series) {
            if (err) {
                console.log("Error reading Series");
                response.status = 500;
                response.message = err;
            } else {
                console.log("Tv Series Found");
                response.status = 200;
                response.message = series;
            }
            res.status(response.status).json(response.message);
        });
    }
}

module.exports.addOne = function (req, res) {
    console.log("Inside addone function of tvseries controller");
    let response = {
        status: 200,
        message: {}
    };
    const newSeries = {
        title: req.body.title, year: req.body.year, cast: req.body.cast
    };

    Series.create(newSeries, function (err, series) {
        if (err) {
            console.log("Error adding new series");
            response.status = 404;
            response.message = err;
        } else {
            console.log("New series added");
            response.status = 201;
            response.message = series;
        }
        res.status(response.status).json(response.message);
    });
}


module.exports.updateOne = function (req, res) {
    console.log("Inside update one of tvSeries controller");
    seriesUpdate = function (req, res, series, response) {
        if (req.body.title) { series.title = req.body.title; }
        if (req.body.year) { series.year = req.body.year; }
        if (req.body.cast) { series.cast = req.body.cast; }

        series.save(function (err, updatedSeries) {
            if (err) {
                response.status = 500;
                response.message = err;
                res.status(response.status).json(response.message);
            }
        });
    }
    _updateOne(req, res, seriesUpdate);

}

module.exports.deleteOne = function (req, res) {

    console.log("Inside deleteOne of Series Controller");
    const seriesId = req.params.seriesId;

    Series.findByIdAndDelete(seriesId).exec(function (err, deletedSeries) {
        const response = { status: 204, message: deletedSeries };
        if (err) {
            console.log("Error finding Series");
            response.status = 500;
            response.message = err;
        } else if (!deletedSeries) {
            console.log("Series id not found");
            response.status = 404;
            response.message = {
                "message": "Series ID not found"
            };
        }
        if(response.status==204){
            console.log("Series Deleted Successfully");
        }
        res.status(response.status).json(response.message);
    });

}