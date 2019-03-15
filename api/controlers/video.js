const fs = require("fs");
const _ = require("lodash");
const Video = require("../models/Video");

module.exports.getBasicVideoInfoById = (req, res) => {
  Video.findById(req.params.id)
      .then(rVideo => {
        if(!rVideo) return res.send({ error: true, msg: "No Video"});
        const video = _.pick(rVideo, ["name","size","duration"]);
        res.send({error: false, video });
      })
      .catch(err => res.send({ error: true, msg: err}))
};

module.exports.getDefaultImageCoverById = (req, res) => {
  Video.findById(req.params.id)
      .then(rVideo => {
        if(!rVideo) return res.send({ error: true, msg: "No Video"});
        fs.readFile(rVideo.defaultCoverPhoto, "base64", (err, base64) => {
          if(err) return console.log("err",err);
          const data = `data:image/png;base64, ${base64}`;
          res.send({ error: false, coverPhoto: data});
        });
      })
      .catch(err => res.send({ error: true, msg: err}))
};

module.exports.updateVideo = (req, res) => {
  Video.findByIdAndUpdate(req.params.id, req.body)
      .then(() => res.send({ error: false }) )
      .catch(err => {
        res.send({ error: true, msg: err})
      })
};

// TODO: basic AI for recommended video(user preference..)...
module.exports.getRecommended = (req, res) => {
  Video.find()
      .sort({ viewCount: -1})
      .limit(8)
      .then(rVideos => {
        res.send({ error: false, videos: rVideos})
      })
      .catch(err => {
        res.send({ error: true, msg: err});
      });
};

// Right now we temporary just fetch the last videos... TODO: Refactoring and Take into account the new uploaded video...
module.exports.getVideos = async (req, res) => {
  const { limit, offset } = req.query;

  Video.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .then(rVideos => res.send({ error: false, videos: rVideos}))
      .catch(err => res.send({ error: true, msg: err }));
};
