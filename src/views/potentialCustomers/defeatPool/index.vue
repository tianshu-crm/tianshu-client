<template>
	<!-- 战败池 -->
	<div class="content-body">
		<!-- 头部 -->
		<el-form size="small" label-width="80px">
			<!-- 搜索框 -->
			<div class="flex-warp header-content">
				<el-form-item label="关键字" label-width="60px">
					<el-input v-model="search.key" placeholder="姓名/微信号/手机号"></el-input>
				</el-form-item>
				<el-form-item label="意向车系">
					<el-input v-model="search.intentionCarSeries" placeholder="请输入意向车系"></el-input>
				</el-form-item>
				<el-form-item label="战败顾问">
					<el-select filterable size="small" placeholder="请选择战败顾问" v-model="search.userId">
						<el-option v-for="item in nameList" :key="item.userId" :value="item.userId" :label="item.userName"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="战败时间">
					<el-date-picker :clearable="false" v-model="search.failureTime" type="date" value-format="yyyy-MM-dd" placeholder="选择战败时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="战败原因">
					<el-select filterable size="small" placeholder="请选择战败原因" v-model="search.reason">
						<el-option v-for="item in failureReasonList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
					</el-select>
				</el-form-item>
			</div>
			<!-- 功能按钮 -->
			<div class="table-action flex-space-between">
				<div class="lf">
					<el-button type="primary" size="small" @click="selectCustomer">查询</el-button>
					<el-button size="small" @click="resetSearch">清空</el-button>
				</div>
				<div class="rt">
					<el-button v-hasPermi="['crm:customer:activateAll']" type="primary" size="small" @click="batchActivateClue">批量激活线索</el-button>
					<el-button v-hasPermi="['crm:customer:failureExport']" type="primary" size="small" @click="exportData">导出数据</el-button>
				</div>
			</div>
		</el-form>
		<!-- 表格 -->
		<el-table
			row-key="id"
			ref="multipleTable"
			:data="failureList"
			style="width: 100%"
			:height="tableHeight"
			v-loading="loading"
			@selection-change="handleSelectionChange"
			element-loading-text="拼命加载中"
			element-loading-background="rgba(255, 255, 255, 0.8)"
			:header-cell-style="{ background: '#F6F6F6' }"
		>
			<el-table-column type="selection" width="80" fixed :reserve-selection="true"></el-table-column>
			<el-table-column label="序号" type="index" width="80">
				<template slot-scope="scope">
					<div>{{ (page - 1) * pageSize + scope.$index + 1 }}</div>
				</template>
			</el-table-column>
			<el-table-column label="客户姓名" prop="name"></el-table-column>
			<el-table-column label="手机号码" prop="phonenumber"></el-table-column>
			<el-table-column label="业务类型" prop="businessType"></el-table-column>
			<el-table-column label="意向车系" prop="intentionCarType"></el-table-column>
			<el-table-column label="意向车型" prop="intentionCarSeries"></el-table-column>
			<el-table-column label="战败顾问" prop="userName"></el-table-column>
			<el-table-column label="战败时间" prop="failureTime" width="170"></el-table-column>
			<el-table-column label="战败原因" prop="reason"></el-table-column>
			<el-table-column label="战败说明" prop="remark">
				<template slot-scope="scope">
					<el-tooltip class="schoolSynopsis" effect="light" :content="scope.row.remark" placement="bottom" show-overflow-tooltip="true">
						<div v-if="scope.row.remark">
							<div v-if="scope.row.remark.length > 8">{{ scope.row.remark.substring(0, 8) }}...</div>
							<div v-else>
								{{ scope.row.remark }}
							</div>
						</div>
						<div v-else>/</div>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100" fixed="right">
				<template slot-scope="scope">
					<el-button v-hasPermi="['crm:customer:activate']" type="text" @click="activateClue(scope.row.customerId)">激活</el-button>
					<el-button v-hasPermi="['crm:customer:failureQuery']" type="text" @click="reviewClue(scope.row.customerId)">查看</el-button>
				</template>
			</el-table-column>
			<template slot="empty">
				<img src="@/assets/img/no_data.png" style="width: 260px; height: 260px" />
				<p class="emptyText" style="line-height: 0">暂无数据</p>
			</template>
		</el-table>
		<!-- 分页 -->
		<div class="table-page__action">
			<el-pagination
				background
				layout="total, sizes, prev, pager, next, jumper"
				:total="pageCount"
				:page-size="pageSize"
				:page-sizes="[10, 20, 50]"
				@current-change="changePage"
				@size-change="handleSizeChange"
			></el-pagination>
		</div>
		<!-- 激活 -->
		<el-dialog :title="activateClueTitle" width="700px" :close-on-click-modal="false" :visible.sync="isActivateClueShow">
			<TheForm ref="TheForm" :type="type" :customerId="customerId"></TheForm>
			<!-- 查看线索时不显示 -->
			<div slot="footer" class="flex-justify-content-center" v-if="type != 2">
				<el-button size="small" @click="confirmActivateClueClick" type="primary" :loading="confirmActivateClueLoading">激活</el-button>
				<el-button size="small" @click="isActivateClueShow = false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { failureList, customerFailureExport, customerFailureDetail, customerActivate, customerActivateAll } from '@/api/defeatPool';
import { getUserList } from '@/api/clue';
import TheForm from './form/index.vue';
import { dataDictionary } from '@/api/news';
export default {
	data() {
		return {
			search: {
				key: '', //关键字
				intentionCarSeries: '', //意向车系
				failureTime: '', //战败时间
				userId: '', //战败顾问
				reason: '', //战败原因
			},
			failureList: [], //列表
			nameList: [], // 顾问下拉列表
			failureReasonList: [], // 战败原因列表
			tableHeight: window.innerHeight - 290, //页面高度
			page: 1, //当前页码
			pageSize: 10, //条数
			pageCount: null, //数量
			loading: false, //加载动画
			activateClueTitle: '',
			confirmActivateClueLoading: false,
			isActivateClueShow: false,
			multipleSelection: [], //点击多选框的值
			valLength: '',
			type: '',
			customerId: '',
		};
	},
	components: {
		TheForm,
	},
	watch: {},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.getUserList();
			this.initReasonList();
			this.initFailureList();
		},
		// 列表查询
		initFailureList() {
			this.loading = true;
			failureList({
				...this.search,
				pageNum: this.page,
				pageSize: this.pageSize,
			})
				.then((res) => {
					if (res.code == 200) {
						this.failureList = res.rows;
						this.pageCount = res.total;
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 所属顾问
		getUserList() {
			getUserList().then((res) => {
				if (res.code == 200) {
					this.nameList = res.data;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		//战败原因列表
		initReasonList() {
			dataDictionary('crm_customer_failure').then((res) => {
				this.failureReasonList = res.data;
			});
		},
		//多选框选中的值
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.valLength = val.length;
		},
		//点击分页
		changePage(page) {
			this.page = page;
			this.initFailureList();
		},
		//调整每页显示条数
		handleSizeChange(pageSize) {
			this.pageSize = pageSize;
			this.initFailureList();
		},
		//搜索
		selectCustomer() {
			this.page = 1;
			this.initFailureList();
		},
		//重置
		resetSearch() {
			this.page = 1;
			this.search = {
				key: '', //关键字
				intentionCarSeries: '', //意向车系
				failureTime: '', //战败时间
				userId: '', //战败顾问
				reason: '', //战败原因
			};
			this.initFailureList();
		},
		// 导出数据
		exportData() {
			this.$notify({
				title: '导出数据',
				message: '正在导出，请稍后~',
				type: 'success',
				showClose: false,
				duration: 2000,
			});
			customerFailureExport({
				...this.search,
			});
		},
		// 批量激活线索
		batchActivateClue() {
			if (this.valLength) {
				this.activateClueTitle = '批量激活线索';
				this.customerId = this.multipleSelection.map((clue) => clue.failureId).join(',');
				this.activateClueFun(0);
			} else {
				this.$message.error('您当前还未选择需要操作的线索信息');
			}
		},
		//激活线索
		activateClue(customerId) {
			this.customerId = customerId;
			this.activateClueTitle = '激活线索';
			this.activateClueFun(1);
		},
		// 查看线索
		reviewClue(customerId) {
			this.customerId = customerId;
			this.activateClueTitle = '查看线索';
			this.activateClueFun(2);
		},
		activateClueFun(type) {
			this.type = type;
			if (type) {
				this.initFailureInfo();
			} else {
				this.isActivateClueShow = true;
				this.$nextTick(() => {
					this.$refs.TheForm.reset();
					this.$refs.TheForm.setValue({});
				});
			}
		},
		//线索详情
		initFailureInfo() {
			customerFailureDetail(this.customerId).then((res) => {
				if (res.code == 200) {
					this.isActivateClueShow = true;
					this.$nextTick(() => {
						this.$refs.TheForm.reset();
						this.$refs.TheForm.setValue(res.data);
					});
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		async confirmActivateClueClick() {
			// 校验
			let isPass = await this.$refs.TheForm.isPass();
			if (isPass == false) {
				return;
			}

			let formData = this.$refs.TheForm.getValue();
			this.confirmActivateClueLoading = true;
			if (this.type) {
				this.customerActivate(formData);
			} else {
				this.customerActivateAll(formData);
			}
		},
		//激活
		customerActivate(formData) {
			customerActivate({
				failureId: formData.failureId,
				activateReason: formData.activateReason,
			})
				.then((res) => {
					if (res.code == 200) {
						this.isActivateClueShow = false;
						this.$message.success(res.msg);
						this.initFailureList();
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.confirmActivateClueLoading = false;
				});
		},
		//批量激活
		customerActivateAll(formData) {
			customerActivateAll({
				failureIds: this.customerId,
				...formData,
			})
				.then((res) => {
					if (res.code == 200) {
						this.isActivateClueShow = false;
						this.$message.success(res.msg);
						this.initFailureList();
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.confirmActivateClueLoading = false;
				});
		},
	},
};
</script>
<style lang="scss" scoped>
.header-content {
	::v-deep .el-input {
		width: 150px;
	}
}
</style>
