module.exports = (app) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const SubscriptionSchema = new Schema({
        channel: {
            type: mongoose.ObjectId,
            ref: 'User',
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

    return mongoose.model('Subscription', SubscriptionSchema);
};
