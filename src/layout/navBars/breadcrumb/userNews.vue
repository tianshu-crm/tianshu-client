<template>
	<div class="layout-navbars-breadcrumb-user-news">
		<div class="head-box">
			<div class="head-box-title">{{ $t('message.user.newTitle') }}</div>
			<div class="head-box-btn" v-if="newsList.length > 0" @click="onAllReadClick">{{ $t('message.user.newBtn') }}</div>
		</div>
		<div class="content-box">
			<template v-if="newsList.length > 0">
				<!-- 0已读消息 1未读消息 -->
				<div
					class="content-box-item"
					@click="handleRowClick(item)"
					:class="{ activeContent: item.status == '0' }"
					v-for="(item, key) in newsList"
					:key="key"
				>
					<div>{{ item.title }}</div>
				</div>
			</template>
			<div class="content-box-empty" v-else>
				<div class="content-box-empty-margin">
					<i class="el-icon-s-promotion"></i>
					<div class="mt15">{{ $t('message.user.newDesc') }}</div>
				</div>
			</div>
		</div>
		<div class="foot-box" @click="GoNews">{{ $t('message.user.newGo') }}</div>
		<!-- 抽屉 -->
		<el-drawer :append-to-body="true" :wrapperClosable="false" :title="detailTitle" :visible.sync="isDrawerShow" :show-close="false">
			<TheDetail ref="TheDetail" :readStatus="readStatus" :newsInfo="newsInfo" @drawerClose="drawerClose"></TheDetail>
		</el-drawer>
	</div>
</template>

<script>
import { Session } from '@/utils/storage.js';
import { windowlist, readAllMessage } from '@/api/news';
import TheDetail from '@/views/news/detail';
export default {
	name: 'layoutBreadcrumbUserNews',
	data() {
		return {
			newsList: [],
			isDrawerShow: false, //抽屉是否显示
			newsInfo: '', //传给抽屉子组件的数据
			detailTitle: '', //抽屉的标题
			readStatus: '',
		};
	},
	components: {
		TheDetail,
	},
	mounted() {
		this.getWindowlist();
	},
	methods: {
		// 全部已读点击
		onAllReadClick() {
			readAllMessage(Session.get('userInfo').userId).then((res) => {
				if (res.code == 200) {
					this.getWindowlist();
					this.$message.success('已修改为全部已读');
				}
			});
		},
		// 前往通知中心点击
		GoNews() {
			this.$router.push('/news');
		},
		// 消息列表
		getWindowlist() {
			windowlist(Session.get('userInfo').userId).then((res) => {
				if (res.code == 200) {
					this.newsList = res.rows;
				}
			});
		},
		// 点击行
		handleRowClick(row) {
			this.detailTitle = row.type;
			this.newsInfo = row;

			if (row.status == '1') {
				this.readStatus = '1';
			}

			this.isDrawerShow = true;
		},
		//抽屉关闭
		drawerClose(val) {
			this.isDrawerShow = val;
			this.getWindowlist();
		},
	},
};
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user-news {
	.head-box {
		display: flex;
		border-bottom: 1px solid var(--prev-border-color-lighter);
		box-sizing: border-box;
		color: var(--prev-color-text-primary);
		justify-content: space-between;
		height: 35px;
		align-items: center;
		.head-box-btn {
			color: var(--prev-color-primary);
			font-size: 13px;
			cursor: pointer;
			opacity: 0.8;
			&:hover {
				opacity: 1;
			}
		}
	}
	.content-box {
		font-size: 13px;
		.content-box-item {
			cursor: pointer;
			padding: 12px 0 12px;
			border-bottom: 1px solid rgb(245, 245, 245);
		}
		.content-box-item:last-child {
			border-bottom: 0;
		}
		.content-box-item:hover {
			background-color: rgb(250, 250, 250);
			color: #409eff;
		}
		.activeContent {
			color: rgb(171, 171, 171);
		}
		.content-box-empty {
			height: 260px;
			display: flex;
			.content-box-empty-margin {
				margin: auto;
				text-align: center;
				i {
					font-size: 60px;
				}
			}
		}
	}
	.foot-box {
		height: 35px;
		color: var(--prev-color-primary);
		font-size: 13px;
		cursor: pointer;
		opacity: 0.8;
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 1px solid var(--prev-border-color-lighter);
		&:hover {
			opacity: 1;
		}
	}
	::v-deep(.el-empty__description p) {
		font-size: 13px;
	}
}
</style>
