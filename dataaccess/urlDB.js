const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;
const urlSchema = new Schema({
  original_url: String,
  short_url: Number
});

const Url = mongoose.model("Url", urlSchema);

const hashIt = (url) => {
  let hash = 0;
  if (url.length == 0) return hash;
  for (let i = 0; i < url.length; i++) {
    char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return (hash < 0) ? hash * -1 : hash
}


const createAndSaveUrl = (url) => {
  const newUrl = new Url({ original_url: url, short_url: hashIt(url) });
  newUrl.save((err) => {
    if (err) return console.log(err);
  })
  return { original_url: url, short_url: hashIt(url) };
}

const getUrl = (shorturl) => {
  return Url.findOne({ short_url: shorturl }).exec().then((result) => {
    return result;
  }).catch((err) => {
    console.error(err);
  })
}


module.exports = { createAndSaveUrl, getUrl }