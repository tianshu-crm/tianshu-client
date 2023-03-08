<template>
	<div class="news_wrap pd15">
		<div class="tabs_item">
			<ul class="clearfix">
				<li v-for="(item, index) of statusList" :key="index" :class="{ active: status == item.value }" @click="tabsStatusChange(item)">
					{{ item.label }}
				</li>
			</ul>
		</div>
		<div class="mt15 btn_item flex-space-between">
			<ul class="clearfix">
				<li
					v-for="(item, index) of typeList"
					:key="index"
					:class="{ type_active: messageType == item.dictValue }"
					@click="tabsMessageTypeChange(item.dictValue)"
				>
					{{ item.dictLabel }}({{ item.number }})
				</li>
			</ul>
			<div v-if="contentTableConfig.showSelectColumn">
				<el-button type="primary" size="small" @click="batchDeleteMessageClick">批量删除</el-button>
				<el-button type="primary" size="small" @click="deleteAllMessagesClick">全部删除</el-button>
			</div>
		</div>

		<page-content
			:heigth="tableHeight"
			:loading="loading"
			:listCount="pageCount"
			:tableData="newsList"
			:contentTableConfig="contentTableConfig"
			:queryParams="queryParams"
			@currentChange="changePage"
			@sizeChange="handleSizeChange"
			@multipleChoiceEvent="handleSelectionChange"
			@handleRowClick="handleRowClick"
		>
			<!-- 红点 -->
			<template #readUnread>
				<div class="redCircle"></div>
			</template>
		</page-content>

		<!-- 抽屉 -->
		<el-drawer :wrapperClosable="false" :title="detailTitle" :visible.sync="isDrawerShow" :show-close="false">
			<TheDetail ref="TheDetail" :readStatus="readStatus" :newsInfo="newsInfo" @drawerClose="drawerClose"></TheDetail>
		</el-drawer>
	</div>
</template>
<script>
import { Session } from '@/utils/storage.js';
import { getMessageList, deleteMessage, dataDictionary } from '@/api/news/index';
import PageContent from '@/components/page-content';
import { contentTableConfig } from './config/content.config'; //搜索组件的配置文件
import TheDetail from './detail';

const constQueryParams = {
	pageSize: 10,
	pageNum: 1,
};
export default {
	components: { PageContent, TheDetail },
	data() {
		return {
			tableHeight: window.innerHeight - 290, //页面高度
			contentTableConfig: {},
			queryParams: JSON.parse(JSON.stringify(constQueryParams)),
			// 消息状态
			status: 2,
			statusList: [
				{
					value: 2,
					label: '全部消息',
				},
				{
					value: 1,
					label: '未读消息',
				},
				{
					value: 0,
					label: '已读消息',
				},
			],
			// 消息类别
			messageType: '',
			typeList: [], //消息数据字典的列表
			newsList: [], //列表
			page: 1, //当前页码
			pageSize: 10, //条数
			pageCount: null, //数量
			loading: false, //加载动画
			multipleSelection: [], //点击多选框的值
			valLength: '',
			isDrawerShow: false, //抽屉是否显示
			newsInfo: '', //传给抽屉子组件的数据
			detailTitle: '', //抽屉的标题
			readStatus: '',
			userId: '',
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			this.userId = Session.get('userInfo').userId;
			this.initMessageType();
			this.contentTableConfig = contentTableConfig;
			// 已读消息有批量删除功能
			if (this.status === 0) {
				this.contentTableConfig.showSelectColumn = true;
			} else {
				this.contentTableConfig.showSelectColumn = false;
			}
		},
		//多选框选中的值
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.valLength = val.length;
		},
		// 点击选择消息状态
		tabsStatusChange(item) {
			this.status = item.value;
			// this.messageType = 1;
			// 已读消息有批量删除功能
			if (this.status === 0) {
				this.contentTableConfig.showSelectColumn = true;
			} else {
				this.contentTableConfig.showSelectColumn = false;
			}
			this.initMessageList();
		},
		// 消息类别
		tabsMessageTypeChange(value) {
			this.messageType = value;
			this.initMessageList();
		},
		// 消息分类
		initMessageType() {
			dataDictionary('crm_message_type').then((res) => {
				if (res.code == 200) {
					this.typeList = res.data;
					this.messageType = res.data[0].dictValue; //默认选中第一个
					if (this.messageType) {
						this.initMessageList();
					}
				}
			});
		},
		// 消息中心列表查询
		initMessageList() {
			this.loading = true;
			getMessageList({
				...this.search,
				userId: this.userId,
				pageNum: this.page,
				pageSize: this.pageSize,
				status: this.status,
				messageType: this.messageType,
			})
				.then((res) => {
					if (res.code == 200) {
						this.newsList = res.rows;
						this.pageCount = res.total;

						this.typeList.forEach((type) => {
							if (type.dictLabel == '任务消息') {
								type.number = res.taskMsgCount;
							} else if (type.dictLabel == '系统消息') {
								type.number = res.sysMsgCount;
							} else if (type.dictLabel == '审批消息') {
								type.number = res.approvalCount;
							} else if (type.dictLabel == '进度提醒') {
								type.number = res.tpCount;
							}
						});
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//点击分页
		changePage(page) {
			this.page = page;
			this.initMessageList();
		},
		//调整每页显示条数
		handleSizeChange(pageSize) {
			this.pageSize = pageSize;
			this.initMessageList();
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
		// 批量删除
		batchDeleteMessageClick() {
			if (this.valLength) {
				this.deleteMessageFun(this.multipleSelection, '当前选中', 0);
			} else {
				this.$message.error('您当前还未选择需要操作的已读消息');
			}
		},
		// 全部删除
		deleteAllMessagesClick() {
			this.deleteMessageFun([], '全部', 1);
		},
		deleteMessageFun(messageId, title, isDeleteAll) {
			this.$confirm('确认要删除' + title + '的已读消息吗？', '提示', {
				type: 'warning',
			})
				.then(() => {
					deleteMessage({
						userId: this.userId,
						messageId,
						isDeleteAll,
					}).then((res) => {
						if (res.code == 200) {
							this.$message.success(res.msg);
							// if (this.bannerList.length === 1) {
							// 	this.page = parseInt(this.pageCount / this.pageSize); //解决删除后ID的问题
							// }
							this.initMessageList();
						}
					});
				})
				.catch(() => {
					this.$message('已取消操作');
				});
		},
		//抽屉关闭
		drawerClose(val) {
			this.isDrawerShow = val;
			this.initMessageList();
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
		height: 40px;
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
		position: relative;
		left: -5px;
		top: 0;
		width: 8px;
		height: 8px;
		background-color: red;
		border-radius: 100%;
	}
}
</style>
