<template>
	<div class="news_wrap pd15">
		<div class="tabs_item mb10">
			<ul class="clearfix">
				<li v-for="(item, index) of statusList" :key="index" :class="{ active: status == item.dictValue }" @click="tabsStatusChange(item)">
					{{ item.dictLabel }}
				</li>
			</ul>
		</div>

		<page-content
			:loading="loading"
			:listCount="listCount"
			:tableData="tableData"
			:contentTableConfig="contentTableConfig"
			:queryParams="queryParams"
		>
			<!-- 红点 -->
			<template #readUnread>
				<div class="redCircle"></div>
			</template>

			<template #handler="scope">
				<el-button type="text" @click="goDetails(scope.row.id, scope.row.businessType)">查看详情</el-button>
			</template>
		</page-content>

		<!-- 抽屉 -->
		<el-drawer :wrapperClosable="false" :title="detailTitle" :visible.sync="isDrawerShow">
			<TheDetail ref="TheDetail" @drawerClose="drawerClose"></TheDetail>
		</el-drawer>
	</div>
</template>
<script>
import { Session } from '@/utils/storage.js';
import { taskList, tabs } from '@/api/task/index';
import PageContent from '@/components/page-content';
import { contentTableConfig } from './config/content.config';
import TheDetail from './detail';

const constQueryParams = {
	pageSize: 10,
	pageNum: 1,
	userId: Session.get('userInfo').userId,
	taskType: '1',
};
export default {
	components: { PageContent, TheDetail },
	data() {
		return {
			contentTableConfig: {},
			queryParams: JSON.parse(JSON.stringify(constQueryParams)),
			status: 1, // 消息状态
			loading: true,
			listCount: 0,
			tableData: [],
			statusList: [],
			isDrawerShow: false,
			detailTitle: '', //抽屉的标题
			readStatus: '',
		};
	},
	created() {
		this.contentTableConfig = contentTableConfig;
		this.getTabs();
		this.getTaskList();
	},
	methods: {
		getTaskList() {
			taskList(this.queryParams)
				.then((res) => {
					if (res.code === 200) {
						this.tableData = res.rows;
						this.listCount = res.total;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		tabsStatusChange(i) {
			this.status = i.dictValue;
			this.queryParams.taskType = i.dictValue;
			this.getTaskList();
		},
		async getTabs() {
			const res = await tabs();
			this.statusList = res.data;
		},
		drawerClose(val) {
			this.isDrawerShow = val;
			this.getTaskList();
		},
		goDetails(id, businessType) {
			this.isDrawerShow = true;
			this.detailTitle = businessType;

			this.$nextTick(() => {
				this.$refs.TheDetail.getTaskdetail(id);
			});
		},
	},
};
</script>

<style scoped lang="scss">
.news_wrap {
	background-color: #fff;
	height: calc(100vh - 114px);
	.clearfix::after {
		content: '';
		display: block;
		height: 0;
		clear: both;
		/* 表示元素不可见 */
		visibility: hidden;
	}
	li {
		list-style: none;
	}
	.tabs_item {
		ul {
			height: 40px;
			width: 300px;
		}
		ul li:nth-child(2) {
			border-left: none;
			border-right: none;
		}
		li {
			float: left;
			line-height: 40px;
			width: 33%;
			margin: 0;
			text-align: center;
			border: 1px solid #e4e7ed;
		}
		li:hover {
			cursor: pointer;
			color: #409eff;
		}
	}
	.active {
		color: #409eff;
		border-bottom: none !important;
	}
	.type_active {
		color: #409eff;
		border: 1px solid #409eff !important;
	}

	.btn_item {
		ul li:nth-child(1) {
			margin-left: 0;
		}
		li {
			float: left;
			line-height: 35px;
			padding: 0 22px;
			margin: 0 15px;
			text-align: center;
			border: 1px solid #e4e7ed;
			border-radius: 4px;
			&:hover {
				cursor: pointer;
				color: #409eff;
			}
		}
	}
	.redCircle {
		width: 8px;
		height: 8px;
		background-color: red;
		border-radius: 100%;
	}
}
</style>
