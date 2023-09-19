const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: { type: String, trim: true},
    postedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    pinned: Boolean,
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    retweetUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    retweetData: {type: Schema.Types.ObjectId, ref: 'Post'}

}, {timestamps: true}); //timestamps to tell when a user created an account

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;