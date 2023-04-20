module.exports = (app) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const VideoSchema = new Schema({
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        playUrl: {
            type: String,
            required: true,
        },
        cover: {
            type: String,
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

    return mongoose.model('Video', VideoSchema);
};
