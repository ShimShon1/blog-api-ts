const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const { commentValidation } = require("../validators");

const router = require("express").Router();

router.get("/", async function (req, res) {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          isPublic: true,
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          views: 1,
          date: 1,
          comments_count: { $size: "$comments" },
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Couldn't find posts" }] });
    }
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

router.get("/:postId", async function (req, res) {
  try {
    if (req.params.postId.length !== 24) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Post Not Found" }] });
    }
    const post = await Post.findOne({
      _id: req.params.postId,
      isPublic: true,
    });
    if (!post) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Post Not Found" }] });
    }
    post.views = post.views + 1;
    await post.save();
    return res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

router.post(
  "/:postId/comments",
  commentValidation,
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Post not found" }] });
      }
      post.comments.push({
        username: req.body.username,
        title: req.body.title,
        content: req.body.content,
        date: new Date(),
      });
      await post.save();
      return res.status(201).json({ comments: post.comments });
    } catch (error) {
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

module.exports = router;
