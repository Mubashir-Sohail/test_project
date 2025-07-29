import dataSource from "../db/db.js";
import Comment from "../entities/comment.js";
import Product from "../entities/products.js";

const commentRepo = dataSource.getRepository("Comment");
const productRepo = dataSource.getRepository("Product");
const userRepo = dataSource.getRepository("User");

export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const productId = req.params.id;
    const userId = req.userId;

    const product = await productRepo.findOne({
      where: { id: productId },
      relations: ["user"],
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.user.id == userId) {
      return res.status(400).json({
        success: false,
        message: "User cannot comment on their own product",
      });
    }

    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newComment = commentRepo.create({ content, product, user });
    await commentRepo.save(newComment);

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const fetchComment = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("productId>>>", productId);

    const fetch = await commentRepo.find({
      where: { product: { id: productId } },
      relations: ["product", "user"],
    });

    const sortedComments = fetch.sort((a, b) => a.id - b.id);

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      fetch: sortedComments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const editComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;
    const { content } = req.body;

    const comment = await commentRepo.findOne({
      where: { id: commentId },
      relations: ["user", "product", "product.user"],
    });

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.product.user.id === userId) {
      return res.status(403).json({
        success: false,
        message: "Cannot update comment on own product",
      });
    }

    if (comment.user.id !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Cannot update others' comments" });
    }

    comment.content = content;
    await commentRepo.save(comment);

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const delComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;

    const comment = await commentRepo.findOne({
      where: { id: commentId },
      relations: ["user", "product", "product.user"],
    });

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.product.user.id === userId) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete comment on own product",
      });
    }

    if (comment.user.id !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Cannot delete others' comments" });
    }

    await commentRepo.remove(comment);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
