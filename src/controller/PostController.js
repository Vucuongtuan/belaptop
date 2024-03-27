const { PostContent } = require("../models/");

// GET all post contents
const getAllPostContents = async (req, res) => {
  try {
    const postContents = await PostContent.find();
    res.json(postContents);
  } catch (error) {
    console.error("Error getting post contents:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET a specific post content by ID
const getPostContentById = async (req, res) => {
  const postId = req.query.id;
  try {
    const postContent = await PostContent.findById(postId);
    if (!postContent) {
      return res.status(404).json({ message: "Post content not found" });
    }
    res.json(postContent);
  } catch (error) {
    console.error("Error getting post content by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST a new post content
const createPostContent = async (req, res) => {
  const {
    name,
    description,
    content,
    productCollection,
    productCollectionRef,
  } = req.body;
  try {
    const newPostContent = new PostContent({
      name,
      description,
      content,
      productCollection,
      productCollectionRef,
    });

    const savedPostContent = await newPostContent.save();
    res.status(201).json(savedPostContent);
  } catch (error) {
    console.error("Error creating post content:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// PUT/UPDATE a post content by ID
const updatePostContentById = async (req, res) => {
  const postId = req.params.id;
  const {
    name,
    description,
    content,
    productCollection,
    productCollectionRef,
  } = req.body;

  try {
    const updatedPostContent = await PostContent.findByIdAndUpdate(
      postId,
      { name, description, content, productCollection, productCollectionRef },
      { new: true }
    );

    if (!updatedPostContent) {
      return res.status(404).json({ message: "Post content not found" });
    }

    res.json(updatedPostContent);
  } catch (error) {
    console.error("Error updating post content by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE a post content by ID
const deletePostContentById = async (req, res) => {
  const postId = req.params.id;

  try {
    const deletedPostContent = await PostContent.findByIdAndDelete(postId);

    if (!deletedPostContent) {
      return res.status(404).json({ message: "Post content not found" });
    }

    res.json(deletedPostContent);
  } catch (error) {
    console.error("Error deleting post content by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllPostContents,
  getPostContentById,
  createPostContent,
  updatePostContentById,
  deletePostContentById,
};
