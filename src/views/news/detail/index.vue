<template>
	<div class="news-body">
		<div>{{ newsInfo.title }}</div>
		<div class="mt10">{{ newsInfo.sendTime }}</div>
		<el-divider></el-divider>
		<div style="text-align: right">
			<el-button type="primary" size="mini" class="el-icon-s-promotion" plain @click="handleTask">立即处理</el-button>
			<el-button size="mini" plain @click="close">关闭</el-button>
		</div>
	</div>
</template>
<script>
import { readMessage } from '@/api/news';
export default {
	props: {
		newsInfo: {
			type: Object,
		},
		readStatus: {
			type: String,
		},
	},
	data() {
		return {
			levelList: ['A', 'B', 'C', 'D', 'E'],
		};
	},
	watch: {
		// 未读的状态下改变为已读状态
		newsInfo: {
			handler() {
				if (this.newsInfo.status == '1') {
					this.readMessageFun();
				}
			},
		},
	},
	mounted() {
		// 未读的状态下改变为已读状态---解决第一次进来还没发生变化的时候不触发的问题
		if (this.readStatus == 1) {
			this.readMessageFun();
		}
	},
	methods: {
		handleTask() {
			// 跳转到该条消息对应的任务
			this.$router.push({
				path: '/task',
			});
		},
		close() {
			this.$emit('drawerClose', false);
		},
		readMessageFun() {
			readMessage(this.newsInfo.id);
		},
	},
};
</script>
<style lang="scss" scoped>
.news-body {
	padding: 30px;
	box-sizing: border-box;
	.main-title {
		margin-top: 20px;
	}
}
</style>
