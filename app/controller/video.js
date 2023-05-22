'use strict';

const { Controller } = require('egg');

class VideoController extends Controller {
    async createVideo() {
        const { ctx, app } = this;
        const { body } = ctx.request.body;
        const { Video } = app.model;
        ctx.validate(
            {
                title: { type: 'string' },
                description: { type: 'string' },
                vodVideoId: { type: 'string' },
                cover: { type: 'string' },
            },
            body,
        );

        body.user = ctx.user._id;

        const video = await new Video(body).save();
        ctx.status = 201;
        ctx.body = {
            video,
        };
    }
    // 获取视频信息
    async getVideo() {
        const { Video, Like, Subscription } = this.app.model;
        const { videoId } = this.ctx.params;
        let video = await Video.findById(videoId).populate('user', '_id username avatar subscribersCount');

        if (!video) {
            this.ctx.throw(404, 'Video Not Found');
        }

        video = video.toJSON();

        video.isLiked = false;
        video.idDisliked = false;
        video.user.isSubscribed = false;

        if (this.ctx.user) {
            const userId = this.ctx.user._id;
            if (await Like.findOne({ user: userId, video: videoId, like: 1 })) {
                video.isLiked = true;
            }
            if (await Like.findOne({ user: userId, video: videoId, like: -1 })) {
                video.idDisliked = true;
            }
            if (await Subscription.findOne({ user: userId, channel: video.user._id })) {
                video.user.isSubscribed = true;
            }
        }

        this.cyx.body = {
            video,
        };
    }

    // 获取视频列表
    async getVideos() {
        const { Video } = this.app.model;
        let { pageNum = 1, pageSize = 10 } = this.ctx.query;
        pageNum = Number.parseInt(pageNum);
        pageSize = Number.parseInt(pageSize);
        const getVideos = Video.find()
            .populate('user')
            .sort({ createAt: -1 })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize);
        const getVideoCount = Video.countDocuments();
        const [videos, videoCount] = await Promise.all([getVideos, getVideoCount]);
        this.ctx.body = {
            videos,
            videoCount,
        };
    }

    // 获取某一用户的视频列表
    async getUserVideos() {
        const { Video } = this.app.model;
        let { pageNum = 1, pageSize = 10 } = this.ctx.query;
        const { userId } = this.ctx.params;
        pageNum = Number.parseInt(pageNum);
        pageSize = Number.parseInt(pageSize);
        const getVideos = Video.find({ user: userId })
            .populate('user')
            .sort({ createAt: -1 })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize);
        const getVideoCount = Video.countDocuments({ user: userId });
        const [videos, videoCount] = await Promise.all([getVideos, getVideoCount]);
        this.ctx.body = {
            videos,
            videoCount,
        };
    }

    // 获取用户收藏列表
    async getUserFeedVideos() {
        const { Video, Subscription } = this.app.model;
        let { pageNum = 1, pageSize = 10 } = this.ctx.query;
        const { userId } = this.ctx.user._id;
        pageNum = Number.parseInt(pageNum);
        pageSize = Number.parseInt(pageSize);
        const channels = await Subscription.find({ user: userId }).populate('channel');
        const getVideos = Video.find({
            user: {
                $in: channels.map((item) => {
                    return item.channel._id;
                }),
            },
        })
            .populate('user')
            .sort({ createAt: -1 })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize);
        const getVideoCount = Video.countDocuments({
            user: {
                $in: channels.map((item) => {
                    return item.channel._id;
                }),
            },
        });
        const [videos, videoCount] = await Promise.all([getVideos, getVideoCount]);
        this.ctx.body = {
            videos,
            videoCount,
        };
    }
}

module.exports = VideoController;
