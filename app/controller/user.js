'use strict';

const { Controller } = require('egg');

class UserController extends Controller {
    async create() {
        const { ctx } = this;
        const { body } = ctx.request;
        // 校验参数
        ctx.validate({
            userName: { type: 'string' },
            password: { type: 'string' },
            email: { type: 'string' },
        });

        const userService = this.service.user;
        if (await userService.findByUsername(body.userName)) {
            ctx.throw(422, '用户已存在');
        }

        if (await userService.findByEmail(body.email)) {
            this.ctx.throw(422, '邮箱已存在');
        }

        const user = await userService.createUser(body);

        const token = await userService.createToken({ userId: user._id });

        ctx.body = {
            user: {
                email: user.email,
                username: user.username,
                token,
                channelDescription: user.channelDescription,
                avator: user.avator,
            },
        };
    }

    async login() {
        const { ctx } = this;
        const { body } = ctx.request;
        // 验证数据正确性
        ctx.validate(
            {
                password: { type: 'string' },
                email: { type: 'string' },
            },
            body,
        );
        // 校验邮箱是否存在
        const userService = this.service.user;
        const user = await userService.findByEmail(body.email);

        if (!user) {
            ctx.throw(422, '用户不存在');
        }

        // 校验密码正确性
        if (this.ctx.helper.md5(body.password) !== user.password) {
            ctx.throw(422, '密码不正确');
        }

        // 生成token
        const token = await userService.createToken({
            userId: user._id,
        });

        // 发送响应数据
        ctx.body = {
            user: {
                email: user.email,
                username: user.username,
                token,
                channelDescription: user.channelDescription,
                avator: user.avator,
            },
        };
    }

    async getCurrentUser() {
        const { ctx } = this;
        const { user } = ctx;
        // 发送响应
        console.log(user);
        ctx.body = {
            user: {
                email: user.email,
                username: user.username,
                token: ctx.headers.authorization,
                channelDescription: user.channelDescription,
                avator: user.avator,
            },
        };
    }

    async update() {
        const { ctx } = this;
        const { body } = ctx.request;

        ctx.validate(
            {
                userName: { type: 'string', required: false },
                password: { type: 'string', required: false },
                email: { type: 'email', required: false },
                avator: { type: 'string', required: false },
                channelDescription: { type: 'string', required: false },
            },
            body,
        );

        const userService = this.service.user;
        if (body.email) {
            if (body.email === ctx.user.email && (await userService.findByEmail(body.email))) {
                ctx.throw(422, 'email已存在');
            }
        }

        if (body.userName) {
            if (body.userName === ctx.user.userName && (await userService.findByUsername(body.userName))) {
                ctx.throw(422, 'username已存在');
            }
        }

        if (body.password) {
            body.password = this.ctx.helper.md5(body.password);
        }

        const user = await userService.updateUser(body);

        ctx.body = {
            user: {
                email: user.email,
                username: user.username,
                password: user.password,
                channelDescription: user.channelDescription,
                avator: user.avator,
            },
        };
    }

    // 订阅
    async subscribe() {
        const { ctx } = this;
        const userId = ctx.user._id;
        const channelId = ctx.params.userId;
        // 用户不能订阅自己
        if (userId.eaquels(channelId)) {
            ctx.throw(422, '不能订阅自己');
        }
        // 添加订阅
        const user = await this.service.user.subscribe(userId, channelId);
        // 发送响应
        ctx.body = {
            user: {
                ...this.ctx.helper._.pick(user, [
                    'username',
                    'email',
                    'avatar',
                    'cover',
                    'channelDescription',
                    'subscribersCount',
                ]),
                isSubscribed: true,
            },
        };
    }

    // 取消订阅
    async unsubscribe() {
        const { ctx } = this;
        const userId = ctx.user._id;
        const channelId = ctx.params.userId;
        // 用户不能订阅自己
        if (userId.eaquels(channelId)) {
            ctx.throw(422, '不能订阅自己');
        }
        // 添加订阅
        const user = await this.service.user.unsubscribe(userId, channelId);
        // 发送响应
        ctx.body = {
            user: {
                ...this.ctx.helper._.pick(user, [
                    'username',
                    'email',
                    'avatar',
                    'cover',
                    'channelDescription',
                    'subscribersCount',
                ]),
                isSubscribed: false,
            },
        };
    }

    async getUser() {
        const { ctx } = this;
        let isSubscribed = false;
        if (ctx.user) {
            const record = await this.app.model.Subscription.findOne({
                user: ctx.user._id,
                channel: ctx.params.userId,
            });

            if (record) {
                isSubscribed = true;
            }
        }

        const user = await this.app.model.User.findById(ctx.params.userId);

        ctx.body = {
            user: {
                ...this.ctx.helper._.pick(user, [
                    'userName',
                    'email',
                    'avatar',
                    'cover',
                    'channelDescription',
                    'subscribersCount',
                ]),
                isSubscribed,
            },
        };
    }

    async getSubscriptions() {
        const { ctx } = this;
        const Subscription = this.app.model.Subscription;
        let subscriptions = await Subscription.find({
            user: ctx.params.userId,
        }).populate('channel');

        subscriptions = subscriptions.map((item) => {
            return ctx.helper._.pick(item.channel, ['_id', 'userName', 'avatar']);
        });

        ctx.body = {
            subscriptions,
        };
    }
}

module.exports = UserController;
