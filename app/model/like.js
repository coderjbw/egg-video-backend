module.exports = (app) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const LikeSchema = new Schema({
        like: {
            type: Number,
            enum: [1, -1],
            required: true,
        },
        description: {
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
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    });

    return mongoose.model('Like', LikeSchema);
};
