<template>
	<!-- 待跟进线索 -->
	<div>
		<!-- 头部 -->
		<el-form size="small" label-width="80px">
			<!-- 搜索框 -->
			<div class="flex-warp header-content">
				<el-form-item label="关键字" label-width="60px">
					<el-input v-model="search.key" placeholder="姓名/微信号/手机号"></el-input>
				</el-form-item>
				<el-form-item label="意向级别">
					<el-select filterable size="small" placeholder="请选择意向级别" v-model="search.level" class="search-select">
						<el-option v-for="item in levelList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="客户来源">
					<el-select filterable size="small" placeholder="请选择客户来源" v-model="search.source" class="search-select">
						<el-option v-for="item in sourceList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="业务类型">
					<el-select filterable size="small" placeholder="请选择业务类型" v-model="search.businessType" class="search-select">
						<el-option v-for="item in businessTypeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属顾问">
					<el-select filterable size="small" placeholder="请选择所属顾问" v-model="search.userId">
						<el-option v-for="item in nameList" :key="item.userId" :value="item.userId" :label="item.userName"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="创建日期">
					<el-date-picker :clearable="false" v-model="search.newTime" type="date" value-format="yyyy-MM-dd" placeholder="选择创建日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="最后修改日期" label-width="110px">
					<el-date-picker :clearable="false" v-model="search.lastTime" type="date" value-format="yyyy-MM-dd" placeholder="选择修改日期">
					</el-date-picker>
				</el-form-item>
			</div>
			<!-- 功能按钮 -->
			<div class="table-action flex-space-between">
				<div class="lf">
					<el-button type="primary" size="small" @click="selectCustomer">查询</el-button>
					<el-button size="small" plain @click="resetSearch">清空</el-button>
				</div>
				<div class="rt">
					<el-button v-hasPermi="['crm:customer:transfer']" type="primary" size="small" @click="batchTransferAdviser('批量转移顾问')"
						>批量转移顾问</el-button
					>
					<el-button v-hasPermi="['crm:customer:noFollowExport']" type="primary" size="small" @click="exportData">导出数据</el-button>
				</div>
			</div>
		</el-form>
		<!-- 表格 -->
		<el-table
			row-key="id"
			ref="multipleTable"
			:data="customerList"
			style="width: 100%"
			:height="tableHeight"
			@selection-change="handleSelectionChange"
			v-loading="loading"
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
			<el-table-column label="手机号码" prop="phonenumber" width="120"></el-table-column>
			<el-table-column label="微信号" prop="wechat" width="150"></el-table-column>
			<el-table-column label="性别" prop="sex"></el-table-column>
			<el-table-column label="年龄" prop="age"></el-table-column>
			<el-table-column label="意向级别" prop="level"></el-table-column>
			<el-table-column label="客户性质" prop="nature"></el-table-column>
			<el-table-column label="业务类型" prop="businessType" width="100"></el-table-column>
			<el-table-column label="线索阶段" prop="stage"></el-table-column>
			<el-table-column label="线索状态" prop="status"></el-table-column>
			<el-table-column label="客户来源" prop="source"></el-table-column>
			<el-table-column label="所属顾问" prop="userName" width="100"></el-table-column>
			<el-table-column label="创建人" prop="createBy" width="100"></el-table-column>
			<el-table-column label="推荐人" prop="referrer" width="100"></el-table-column>
			<el-table-column label="推荐人手机号" prop="referrerPhone" width="120"></el-table-column>
			<el-table-column label="推荐人微信号" prop="referrerWechat" width="120"></el-table-column>
			<el-table-column label="创建日期" prop="createTime" width="160" sortable></el-table-column>
			<el-table-column label="最后修改时间" prop="updateTime" width="160" sortable></el-table-column>
			<el-table-column label="操作" width="270" fixed="right">
				<template slot-scope="scope">
					<el-button v-hasPermi="['crm:customer:track']" type="text" @click="routerPushTrajectoryDetail(scope.row.customerId)">新增轨迹</el-button>
					<el-button type="text" @click="routerPushClueDetail(scope.row.customerId)">查看线索</el-button>
					<el-button v-hasPermi="['crm:customer:transfer']" type="text" @click="transferAdviser('转移顾问', scope.row)">转移</el-button>
					<el-button v-hasPermi="['crm:customer:levelupd']" type="text" @click="transferLevel(scope.row.customerId)">调级</el-button>
					<el-button v-hasPermi="['crm:customer:failure']" type="text" @click="defeatPool(scope.row.customerId)">战败</el-button>
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
		<!-- 批量转移顾问 -->
		<el-dialog :title="transferAdviserTitle" width="560px" :close-on-click-modal="false" :visible.sync="isAdviserShow">
			<TheAdviserForm :customerInfo="customerTransferInfo" ref="TheAdviserForm"></TheAdviserForm>
			<div slot="footer" class="flex-justify-content-center">
				<el-button size="small" @click="confirmAdviserClick" type="primary" :loading="confirmAdviserLoading">确认</el-button>
				<el-button size="small" @click="isAdviserShow = false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 意向客户级别调整 -->
		<el-dialog title="意向客户级别调整" width="600px" :close-on-click-modal="false" :visible.sync="isTransferLevelShow">
			<TheTransferForm ref="TheTransferForm" :customerInfo="customerInfo" :customerId="customerId"></TheTransferForm>
			<div slot="footer" class="flex-justify-content-center">
				<el-button size="small" @click="confirmTransferLevelClick" type="primary" :loading="confirmTransferLevelLoading">确认</el-button>
				<el-button size="small" @click="isTransferLevelShow = false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 战败 -->
		<el-dialog title="战败" width="600px" :close-on-click-modal="false" :visible.sync="isDefeatShow">
			<TheDefeatForm ref="TheDefeatForm" :customerInfo="customerInfo" :customerId="customerId"></TheDefeatForm>
			<div slot="footer" class="flex-justify-content-center">
				<el-button size="small" @click="confirmDefeatClick" type="primary" :loading="confirmDefeatLoading">确认</el-button>
				<el-button size="small" @click="isDefeatShow = false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { getNoFollowList, getUserList, noFollowExport, transferCustomer, levelUpdCustomer, customerInfo, failureCustomer } from '@/api/clue';
import { dataDictionary } from '@/api/news';
import TheAdviserForm from '../unassigned/clueDetail/form';
import TheTransferForm from './transferForm/index.vue';
import TheDefeatForm from './defeatForm/index.vue';
export default {
	data() {
		return {
			search: {
				key: '', //关键字
				level: '', //意向级别
				newTime: '', //创建日期
				lastTime: '', //最后修改日期
				source: '', //客户来源
				businessType: '', //业务类型
				userId: '', //所属顾问
			},
			levelList: [], // 意向级别下拉列表
			sourceList: [], // 客户来源下拉列表
			businessTypeList: [], // 业务类型下拉列表
			nameList: [], //所属顾问下拉列表
			customerList: [], //线索列表
			tableHeight: window.innerHeight - 345, //页面高度
			page: 1, //当前页码
			pageSize: 10, //条数
			pageCount: null, //数量
			loading: false, //加载动画
			isAdviserShow: false,
			confirmAdviserLoading: false,
			transferAdviserTitle: '',
			confirmTransferLevelLoading: false,
			isTransferLevelShow: false,
			confirmDefeatLoading: false,
			isDefeatShow: false,
			multipleSelection: [], //点击多选框的值
			valLength: '',
			customerId: '', //当前选中的线索id
			customerInfo: {}, //线索信息
			customerTransferInfo:{},//转移线索信息
		};
	},
	props: {
		id: {
			type: String,
		},
	},
	components: {
		TheAdviserForm,
		TheTransferForm,
		TheDefeatForm,
	},
	watch: {},
	mounted() {},
	methods: {
		init() {
			this.initCustomerList();
			this.initLevelList();
			this.initSourceList();
			this.initBusinessTypeList();
			this.getUserList();
		},
		//多选框选中的值
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.valLength = val.length;
		},
		//点击分页
		changePage(page) {
			this.page = page;
			this.initCustomerList();
		},
		//调整每页显示条数
		handleSizeChange(pageSize) {
			this.pageSize = pageSize;
			this.initCustomerList();
		},
		//搜索
		selectCustomer() {
			this.page = 1;
			this.initCustomerList();
		},
		//重置
		resetSearch() {
			this.page = 1;
			this.search = {
				key: '', //关键字
				level: '', //意向级别
				newTime: '', //创建日期
				lastTime: '', //最后修改日期
				source: '', //客户来源
				businessType: '', //业务类型
				userId: '', //所属顾问
			};
			this.initCustomerList();
		},
		// 列表查询
		initCustomerList() {
			this.loading = true;
			getNoFollowList({
				...this.search,
				pageNum: this.page,
				pageSize: this.pageSize,
			})
				.then((res) => {
					if (res.code == 200) {
						this.customerList = res.rows;
						this.pageCount = res.total;
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//意向级别列表
		initLevelList() {
			dataDictionary('crm_customer_level').then((res) => {
				this.levelList = res.data;
			});
		},
		//客户来源列表
		initSourceList() {
			dataDictionary('crm_customer_source').then((res) => {
				this.sourceList = res.data;
			});
		},
		//业务类型列表
		initBusinessTypeList() {
			dataDictionary('crm_customer_businessType').then((res) => {
				this.businessTypeList = res.data;
			});
		},
		// 所属顾问
		getUserList() {
			getUserList()
				.then((res) => {
					if (res.code == 200) {
						this.nameList = res.data;
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 批量转移顾问
		batchTransferAdviser(title) {
			if (this.valLength) {
				this.transferAdviserTitle = title;
				this.customerId = this.multipleSelection.map((clue) => clue.customerId).join(',');
				this.customerTransferInfo = {};
				this.transferAdviserFun();
			} else {
				this.$message.error('您当前还未选择需要操作的线索信息');
			}
		},
		//转移顾问
		transferAdviser(title, row) {
			this.transferAdviserTitle = title;
			this.customerId = row.customerId;
			this.customerTransferInfo = row;
			this.transferAdviserFun();
		},
		transferAdviserFun() {
			this.isAdviserShow = true;
			this.$nextTick(() => {
				this.$refs.TheAdviserForm.reset();
			});
		},
		async confirmAdviserClick() {
			// 校验
			let isPass = await this.$refs.TheAdviserForm.isPass();
			if (isPass == false) {
				return;
			}

			let formData = this.$refs.TheAdviserForm.getValue();
			this.confirmAdviserLoading = true;
			transferCustomer({
				customerIds: this.customerId,
				...formData,
			})
				.then((res) => {
					if (res.code == 200) {
						this.$message.success(res.msg);
						this.isAdviserShow = false;
						this.initCustomerList();
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.confirmAdviserLoading = false;
				});
		},
		// 调级
		transferLevel(customerId) {
			this.customerId = customerId;
			this.getCustomerInfo(customerId, '调级');
		},
		// 线索信息
		getCustomerInfo(customerId, title) {
			customerInfo(customerId)
				.then((res) => {
					if (res.code == 200) {
						this.customerInfo = res.data;
						if (title == '调级') {
							this.isTransferLevelShow = true;
							this.$nextTick(() => {
								this.$refs.TheTransferForm.reset();
							});
						} else if (title == '战败') {
							this.isDefeatShow = true;
							this.$nextTick(() => {
								this.$refs.TheDefeatForm.reset();
							});
						}
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		async confirmTransferLevelClick() {
			// 校验
			let isPass = await this.$refs.TheTransferForm.isPass();
			if (isPass == false) {
				return;
			}
			let formData = this.$refs.TheTransferForm.getValue();
			this.confirmTransferLevelLoading = true;
			levelUpdCustomer({
				...formData,
				customerId: this.customerId,
			})
				.then((res) => {
					if (res.code == 200) {
						this.$message.success(res.msg);
						this.isTransferLevelShow = false;
						this.initCustomerList();
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.confirmTransferLevelLoading = false;
				});
		},
		// 战败
		defeatPool(customerId) {
			this.customerId = customerId;
			this.getCustomerInfo(customerId, '战败');
		},
		async confirmDefeatClick() {
			// 校验
			let isPass = await this.$refs.TheDefeatForm.isPass();
			if (isPass == false) {
				return;
			}

			let formData = this.$refs.TheDefeatForm.getValue();
			this.confirmDefeatLoading = true;
			failureCustomer({
				...formData,
				customerId: this.customerId,
			})
				.then((res) => {
					if (res.code == 200) {
						this.$message.success(res.msg);
						this.isDefeatShow = false;
						this.initCustomerList();
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.confirmDefeatLoading = false;
				});
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
			noFollowExport({
				...this.search,
			});
		},
		// 跳转线索详情
		routerPushClueDetail(customerId) {
			this.$router.push({
				path: '/clue/clueDetail',
				query: {
					customerId,
				},
			});
		},
		// 跳转轨迹页面
		routerPushTrajectoryDetail(customerId) {
			this.$router.push({
				path: '/clue/trajectoryDetail',
				query: {
					customerId,
					type: 'add',
				},
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
