const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
    createdAt: { type: Date, default : Date.now }
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
