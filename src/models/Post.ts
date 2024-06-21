const { default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  isPublic: { type: Boolean, required: true },
  views: { type: Number, required: true, default: 0 },
  comments: [
    {
      type: {
        username: { type: String, required: true, minlength: 2 },
        title: { type: String, required: true, minlength: 2 },
        content: { type: String, required: true, minlength: 2 },
        date: { type: Date, required: true },
      },
    },
  ],
});

module.exports = mongoose.model("Post", PostSchema);
