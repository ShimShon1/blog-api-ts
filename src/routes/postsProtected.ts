import { validationResult } from "express-validator";
import Post from "../models/Post";
import { postValidation } from "../validators";
import express from "express";
const router = express.Router();

router.get("/", async function (req, res) {
  try {
    const posts = await Post.aggregate([
      {
        $project: {
          title: 1,
          content: 1,
          views: 1,
          date: 1,
          comments_count: { $size: "$comments" },
          isPublic: 1,
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);

    if (!posts.length) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Couldn't find posts" }] });
    }
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Unexpected Error" }] });
  }
});

router.get("/:postId", async function (req, res) {
  try {
    if (req.params.postId.length !== 24) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Post Not Found" }] });
    }
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Post Not Found" }] });
    }
    post.views = post.views + 1;
    await post.save();
    res.json({ post });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Unexpected Error" }] });
  }
});

// POST a post
router.post(
  "/",
  postValidation,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        isPublic: req.body.isPublic,
        date: new Date(),
      });
      await newPost.save();
      return res.status(201).json({ post: newPost });
    } catch (error) {
      res.status(500).json({ errors: [{ msg: "Unexpected Error" }] });
    }
  }
);

// PUT a post
router.put(
  "/:postId",
  postValidation,
  async function (req: express.Request, res: express.Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.postId);
      post.title = req.body.title;
      post.content = req.body.content;
      post.isPublic = req.body.isPublic;
      await post.save();
      return res.json({ post });
    } catch (error) {
      res.status(500).json({ errors: [{ msg: "Unexpected Error" }] });
    }
  }
);
// DELETE a post
router.delete("/:postId", async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Post not found" }] });
    }

    await post.deleteOne();
    return res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: "Server error" }] });
  }
});

router.delete("/:postId/:commentId", async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.postId);
    post.comments = post.comments.filter(
      (comment) => !comment._id.equals(req.params.commentId)
    ) as any;
    await post.save();
    return res.status(200).json({
      msg: "Comment deleted",
      comments: post.comments,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: "Server error" }] });
  }
});

export default router;
