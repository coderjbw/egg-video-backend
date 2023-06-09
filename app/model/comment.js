module.exports = (app) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const CommentSchema = new Schema({
        content: {
            type: String,
            required: true,
        },
        video: {
            type: mongoose.ObjectId,
            ref: 'Video',
            required: true,
        },
        user: {
            type: mongoose.ObjectId,
            ref: 'User',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        uodatedAt: {
            type: Date,
            default: Date.now,
        },
    });

    return mongoose.model('Comment', CommentSchema);
};
