const Service = require('egg').Service;
const jwt = require('jsonwebtoken');

class UserService extends Service {
    get User() {
        return this.app.model.User;
    }

    findByUsername(userName) {
        return this.User.findOne({ userName });
    }

    findByEmail(email) {
        return this.User.findOne({ email }).select('+password');
    }

    async createUser(data) {
        // 加密处理
        data.password = this.ctx.helper.md5(data.password);
        const user = new this.User(data);
        await user.save();
        return user;
    }

    async createToken(data) {
        return jwt.sign(data, this.app.config.jwt.secret, {
            expiresIn: this.app.config.jwt.expiresIn,
        });
    }

    verifyToken(data) {
        return jwt.verify(data, this.app.config.jwt.secret);
    }

    updateUser(data) {
        return this.User.findByIdAndUpdate(this.ctx.user._id, data, { new: true });
    }

    async subscribe(userId, channelId) {
        const { User, Subscription } = this.app.model;
        // 检查是否已经订阅
        const record = await Subscription.findOne({
            user: userId,
            channel: channelId,
        });
        const user = await User.findById(channelId);
        // 没有订阅，订阅
        if (!record) {
            await new Subscription({
                user: userId,
                channel: channelId,
            }).save();

            user.subscribersCount++;
            await user.save();
        }
        // 返回用户信息
        return user;
    }

    async unsubscribe(userId, channelId) {
        const { User, Subscription } = this.app.model;
        // 检查是否已经订阅
        const record = await Subscription.findOne({
            user: userId,
            channel: channelId,
        });
        const user = await User.findById(channelId);
        // 没有订阅，订阅
        if (record) {
            await record.remove();

            user.subscribersCount--;
            await user.save();
        }
        // 返回用户信息
        return user;
    }
}

module.exports = UserService;
