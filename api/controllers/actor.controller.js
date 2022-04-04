const mongoose = require("mongoose");

Series = mongoose.model(process.env.SERIES_MODEL);

const getAll = function (req, res) {
    console.log("Inside getAll function of Actor controller");
    const seriesId = req.params.seriesId;
    const response = {
        status: 200,
        message: {}
    }
    let valid = mongoose.isValidObjectId(seriesId);
    if (!valid) {
        console.log("invalid Id");
        response.status = 400;
        response.message = { message: "Invalid seriesId" }
        return res.status(response.status).json(response.message)
    }
    Series.findById(seriesId).select('cast').exec(function (err, series) {
        if (err) {
            console.log("Error finding casts ", err);
            response.status=400;
            response.message="Error finding casts";
        }else if(!series){
            response.status = 404;
            response.message = "Casts doesn't exist for the given Series";
            console.log("There are no casts in this series");
        }else{
            response.status=200;
            response.message=series.cast;
        }
        res.status(response.status).json(response.message);
    });
}
const getOne = function (req, res) {
    console.log("Inside getOne function of Actor controller");
    const actorId = req.params.actorId;
    const seriesId = req.params.seriesId;
    const response = {
        status: 200,
        message: {}
    }
    let valid = mongoose.isValidObjectId(seriesId)&&mongoose.isValidObjectId(actorId);
    if (!valid) {
        console.log("invalid Id");
        response.status = 400;
        response.message = { message: "Invalid seriesId or ActorId" }
        return res.status(response.status).json(response.message)
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
    else{
        Series.findById(seriesId).select("cast").exec(function (err, series) {
            if (err) {
                console.log("Error reading cast");
                response.status = 500;
                response.message = err;
            } else {
                if(series.cast.id(actorId)===null){
                    console.log("Cast is null");
                    response.status = 404;
                    response.message = { message: "There is no Cast with given id" };
                }
                else if(series){
                    console.log("Found Cast");
                    response.status = 200;
                    response.message = series.cast.id(actorId);
                }
            }
            res.status(response.status).json(response.message);
        });
    }
}

const addOne = function (req, res) {
    console.log("Add one function in actor controller");
    const seriesId = req.params.seriesId;
    const response = {
        status: 200,
        message: {}
    }
    let valid = mongoose.isValidObjectId(seriesId);
    if (!valid) {
        console.log("invalid Id");
        response.status = 404;
        response.message = { message: "Invalid seriesId" }
        return res.status(response.status).json(response.message)
    }
    Series.findById(seriesId).select("cast").exec(function (err, series) {
        console.log("Found series ", series);
        const response = { status: 200, message: series };
        if (err) {
            console.log("Error finding series");
            response.status = 500;
            response.message = err;
        } else if (!series) {
            console.log("Error finding series");
            response.status = 404;
            response.message = { "message": "series ID not found " + seriesId };
        }
        if (series) {
            console.log("Series: ", series);
            console.log("Body Name:", req.body.name);
            _addActor(req, res, series);
        } else {
            res.status(response.status).json(response.message);
        }
    });
}

const _addActor = function (req, res, series) {
    const newCast = {};
    if (req.body.name) { newCast.name = req.body.name };
    if (req.body.age) { newCast.age = req.body.age };
    console.log(newCast);
    series.cast.push(newCast);
    _saveSeries(res, series);
}


const deleteOne = function (req, res) {
    console.log("Inside Deleteone of actor controller");
    const seriesId = req.params.seriesId;
    const actorId = req.params.actorId;
    const response = { status: 200, message: {} };
    const valid = mongoose.isValidObjectId(seriesId) && mongoose.isValidObjectId(actorId);
    if (!valid) {
        console.log("invalid Id");
        response.status = 404;
        response.message = { message: "Invalid seriesId or CastId" }
        return res.status(response.status).json(response.message)
    }
    Series.findById(seriesId).select("cast").exec(function (err, series) {
        if (err) {
            console.log("Error finding series ", err);
            response.status = 500;
            response.message = "Error Finding series";
        } else if (!series) {
            response.status = 404;
            response.message = "Error Finding series";
            console.log("series doesn't exist for the id", seriesId);
        }
        if (series) {
            _deleteCast(req, res, series, actorId);
        } else {
            res.status(response.status).json(response.message);
        }
    });


}

const _deleteCast = function (req, res, series, actorId) {
    if (!series.cast.id(actorId)) {
        console.log("author doesn't exist");
        return res.status(404).json({ "message": "author not found for given author Id" });
    }
    series.cast = series.cast.filter(author => author._id != actorId);
    _saveSeries(res, series);

}


const updateOne = function (req, res) {
    const seriesId = req.params.seriesId;
    const actorId = req.params.actorId;
    const validId = mongoose.isValidObjectId(seriesId) && mongoose.isValidObjectId(actorId);
    if (!validId) {
        console.log("invalid  seriesId or castId");
        return res.status(404).json({ "message": "Please provide valid id for series and actor" });
    }
    Series.findById(seriesId).select("cast").exec(function (err, series) {
        const response = { status: 200, message: series };
        if (err) {
            console.log("Error finding Series ", err);
            response.status = 500;
            response.message = "Error Finding Series";
        } else if (!series) {
            response.status = 404;
            response.message = "Error Finding Series";
            console.log("Series doesn't exist for this id");
        }
        if (series) {
            _updateActor(req, res, series);
        } else {
            res.status(response.status).json(response.message);
        }
    });
}

const _updateActor = function (req, res, series) {
    const actorId = req.params.actorId;
    if (!series.cast.id(actorId)) {
        console.log("author doesn't exist");
        return res.status(404).json({ "message": "author not found for given author Id" });
    }
    if (!req.body.name) {
        console.log("new author doesn't contains name");
        return res.status(400).json({ message: "Author name is required" });
    }
    series.cast =
        series.cast.map(cast => {
            if (cast._id == actorId) {
                return { ...req.body, ...cast };
            } return cast;

        });
    _saveSeries(res, series);
}
const _saveSeries = function (res, series) {
    series.save(function (err, updatedSeries) {
        const response = { status: 200, message: [] };
        if (err) {
            response.status = 500;
            response.message = err;
        } else {
            response.status = 201;
            response.message = updatedSeries.authors;
        }
        res.status(response.status).json(response.message);
    })
}


module.exports = {
    getAll,
    getOne,
    addOne,
    updateOne,
    deleteOne
}