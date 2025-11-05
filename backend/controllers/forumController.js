import asyncHandler from 'express-async-handler';
import Forum from '../models/Forum.js';

// @desc    Get forum posts
// @route   GET /api/forum
// @access  Public
export const getPosts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const category = req.query.category;
  const search = req.query.search;

  let query = { status: 'active' };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const count = await Forum.countDocuments(query);
  const posts = await Forum.find(query)
    .populate('author', 'name profilePicture')
    .select('-replies') // Exclude replies for performance
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Add reply count and last reply info
  const postsWithMeta = await Promise.all(
    posts.map(async (post) => {
      const replyCount = post.replies.length;
      const lastReply = replyCount > 0 ? post.replies[replyCount - 1] : null;

      return {
        ...post.toObject(),
        replyCount,
        lastReply: lastReply ? {
          author: lastReply.author,
          createdAt: lastReply.createdAt,
        } : null,
      };
    })
  );

  res.json({
    posts: postsWithMeta,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single post with replies
// @route   GET /api/forum/:id
// @access  Public
export const getPost = asyncHandler(async (req, res) => {
  const post = await Forum.findById(req.params.id)
    .populate('author', 'name profilePicture')
    .populate('replies.author', 'name profilePicture')
    .populate('moderatedBy', 'name');

  if (post && post.status === 'active') {
    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Create new post
// @route   POST /api/forum
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags, isAnonymous } = req.body;

  const post = new Forum({
    title,
    content,
    category,
    tags,
    author: req.user._id,
    isAnonymous,
  });

  const createdPost = await post.save();
  await createdPost.populate('author', 'name profilePicture');

  res.status(201).json(createdPost);
});

// @desc    Update post
// @route   PUT /api/forum/:id
// @access  Private
export const updatePost = asyncHandler(async (req, res) => {
  const post = await Forum.findById(req.params.id);

  if (post) {
    // Check authorization
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this post');
    }

    Object.assign(post, req.body);
    const updatedPost = await post.save();
    await updatedPost.populate('author', 'name profilePicture');

    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete post
// @route   DELETE /api/forum/:id
// @access  Private
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Forum.findById(req.params.id);

  if (post) {
    // Check authorization
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this post');
    }

    post.status = 'deleted';
    await post.save();

    res.json({ message: 'Post deleted' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Add reply to post
// @route   POST /api/forum/:id/reply
// @access  Private
export const addReply = asyncHandler(async (req, res) => {
  const { content, isAnonymous } = req.body;
  const post = await Forum.findById(req.params.id);

  if (post && post.status === 'active' && !post.isLocked) {
    const reply = {
      author: req.user._id,
      content,
      isAnonymous,
    };

    post.replies.push(reply);
    await post.save();
    await post.populate('replies.author', 'name profilePicture');

    res.status(201).json(post.replies[post.replies.length - 1]);
  } else {
    res.status(404);
    throw new Error('Post not found or locked');
  }
});

// @desc    Like/unlike post
// @route   PUT /api/forum/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Forum.findById(req.params.id);

  if (post) {
    const likeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push({
        user: req.user._id,
      });
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Like/unlike reply
// @route   PUT /api/forum/:postId/reply/:replyId/like
// @access  Private
export const toggleReplyLike = asyncHandler(async (req, res) => {
  const post = await Forum.findById(req.params.postId);

  if (post) {
    const reply = post.replies.id(req.params.replyId);

    if (reply) {
      const likeIndex = reply.likes.findIndex(
        (like) => like.user.toString() === req.user._id.toString()
      );

      if (likeIndex > -1) {
        // Unlike
        reply.likes.splice(likeIndex, 1);
      } else {
        // Like
        reply.likes.push({
          user: req.user._id,
        });
      }

      await post.save();
      res.json({ likes: reply.likes.length });
    } else {
      res.status(404);
      throw new Error('Reply not found');
    }
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Get forum categories
// @route   GET /api/forum/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Forum.distinct('category', { status: 'active' });
  res.json(categories);
});

// @desc    Get forum statistics
// @route   GET /api/forum/stats
// @access  Public
export const getForumStats = asyncHandler(async (req, res) => {
  const totalPosts = await Forum.countDocuments({ status: 'active' });
  const totalReplies = await Forum.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: null, total: { $sum: { $size: '$replies' } } } },
  ]);

  const categoryStats = await Forum.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    totalPosts,
    totalReplies: totalReplies[0]?.total || 0,
    categoryStats,
  });
});

// @desc    Moderate post (Admin only)
// @route   PUT /api/forum/:id/moderate
// @access  Private/Admin
export const moderatePost = asyncHandler(async (req, res) => {
  const { action, reason } = req.body; // action: 'hide', 'lock', 'pin', 'unpin'
  const post = await Forum.findById(req.params.id);

  if (post) {
    switch (action) {
      case 'hide':
        post.status = 'hidden';
        break;
      case 'lock':
        post.isLocked = true;
        break;
      case 'unlock':
        post.isLocked = false;
        break;
      case 'pin':
        post.isPinned = true;
        break;
      case 'unpin':
        post.isPinned = false;
        break;
      default:
        res.status(400);
        throw new Error('Invalid moderation action');
    }

    post.moderatedBy = req.user._id;
    post.moderationReason = reason;
    await post.save();

    res.json({ message: `Post ${action}ed successfully` });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});
