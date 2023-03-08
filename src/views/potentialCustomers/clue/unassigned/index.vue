<template>
	<!-- 待分配线索 -->
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
				<el-form-item label="创建日期">
					<el-date-picker :clearable="false" v-model="search.newTime" type="date" value-format="yyyy-MM-dd" placeholder="选择创建日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="最后修改日期" label-width="110px">
					<el-date-picker :clearable="false" v-model="search.lastTime" type="date" value-format="yyyy-MM-dd" placeholder="选择修改日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="客户来源">
					<el-select filterable size="small" placeholder="请选择客户来源" v-model="search.source" class="search-select" @change="changeSource">
						<el-option v-for="item in sourceList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="业务类型">
					<el-select filterable size="small" placeholder="请选择业务类型" v-model="search.businessType" class="search-select">
						<el-option v-for="item in businessTypeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="导入批号" v-if="sourceValue == 'PI_LIANG_DAO_RU' || sourceValue == 'WX_PI_LIANG_DAO_RU'">
					<el-input v-model="search.importNo" placeholder="请输入导入批号"></el-input>
				</el-form-item>
			</div>
			<!-- 功能按钮 -->
			<div class="table-action flex-space-between">
				<div class="lf">
					<el-button type="primary" size="small" @click="selectCustomer">查询</el-button>
					<el-button size="small" plain @click="resetSearch">清空</el-button>
				</div>
				<div class="rt">
					<el-button v-hasPermi="['crm:customer:add']" type="primary" size="small" @click="addClue">新增线索</el-button>
					<el-button v-hasPermi="['crm:customer:allotUser']" type="primary" size="small" @click="batchAssignIsAdviser('批量分配顾问')"
						>批量分配顾问</el-button
					>
					<el-button v-hasPermi="['crm:customer:import']" type="primary" size="small" @click="importData">导入数据</el-button>
					<el-button v-hasPermi="['crm:customer:export']" type="primary" size="small" @click="exportData">导出数据</el-button>
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
			<el-table-column label="导入批号" prop="importNO" width="250"></el-table-column>
			<el-table-column label="创建人" prop="createBy" width="100"></el-table-column>
			<el-table-column label="推荐人" prop="referrer" width="100"></el-table-column>
			<el-table-column label="推荐人手机号" prop="referrerPhone" width="120"></el-table-column>
			<el-table-column label="推荐人微信号" prop="referrerWechat" width="120"></el-table-column>
			<el-table-column label="创建日期" prop="createTime" width="160" sortable></el-table-column>
			<el-table-column label="最后修改时间" prop="updateTime" width="160" sortable></el-table-column>
			<el-table-column label="操作" width="220" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" @click="routerPushClueDetail(scope.row.customerId)">查看线索</el-button>
					<el-button v-hasPermi="['crm:customer:track']" type="text" @click="routerPushTrajectoryDetail(scope.row.customerId)">新增轨迹</el-button>
					<el-button v-hasPermi="['crm:customer:allotUser']" type="text" @click="assignIsAdviser('分配顾问', scope.row.customerId)"
						>分配顾问</el-button
					>
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
		<!-- 批量分配顾问 -->
		<el-dialog :title="assignIsAdviserTitle" width="600px" :close-on-click-modal="false" :visible.sync="isAdviserShow">
			<TheAdviserForm ref="TheAdviserForm"></TheAdviserForm>
			<div slot="footer" class="flex-justify-content-center">
				<el-button size="small" @click="confirmAdviserClick" type="primary" :loading="confirmAdviserLoading">确认</el-button>
				<el-button size="small" @click="isAdviserShow = false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 导入数据 -->
		<el-dialog title="导入数据" width="640px" :close-on-click-modal="false" :visible.sync="isImportShow">
			<TheImportForm ref="TheImportForm"></TheImportForm>
			<div slot="footer" class="flex-justify-content-center">
				<el-button size="small" @click="confirmImportClick" type="primary" :loading="confirmImportLoading">确认</el-button>
				<el-button size="small" @click="isImportShow = false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 导入分析 -->
		<el-dialog title="导入数据" width="500px" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="isImportAnalysisShow">
			<div>{{ importMsg }}</div>
			<div slot="footer" class="flex-justify-content-center">
				<el-button size="small" @click="confirmImportAnalysisClick" type="primary">去处理</el-button>
				<el-button size="small" @click="cancelImport">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { getCustomerList, customerExport, allotUser, importData } from '@/api/clue';
import { dataDictionary } from '@/api/news';
import TheAdviserForm from './adviserForm'; //批量分配顾问
import TheImportForm from './importForm'; //导入数据
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
				importNo: '', //导入批号
			},
			levelList: [], // 意向级别下拉列表
			sourceList: [], // 客户来源下拉列表
			businessTypeList: [], // 业务类型下拉列表
			customerList: [], //线索列表
			tableHeight: window.innerHeight - 345, //页面高度
			page: 1, //当前页码
			pageSize: 10, //条数
			pageCount: null, //数量
			loading: false, //加载动画
			//批量分配顾问
			isAdviserShow: false,
			confirmAdviserLoading: false,
			assignIsAdviserTitle: '', //分配顾问弹窗的标题
			//导入数据
			isImportShow: false,
			confirmImportLoading: false,
			//导入分析
			isImportAnalysisShow: false,
			multipleSelection: [], //点击多选框的值
			valLength: '',
			customerIds: '', //当前选中的线索id
			importMsg: '', //导入后提示语
			sourceValue: '', //目前选中的线索来源
		};
	},
	components: {
		TheAdviserForm,
		TheImportForm,
	},
	watch: {},
	methods: {
		init() {
			this.initCustomerList();
			this.initLevelList();
			this.initSourceList();
			this.initBusinessTypeList();
		},
		//多选框选中的值
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.valLength = val.length;
		},
		// 待分配线索列表查询
		initCustomerList() {
			this.loading = true;
			getCustomerList({
				...this.search,
				pageNum: this.page,
				pageSize: this.pageSize,
			})
				.then((res) => {
					this.customerList = res.rows;
					this.pageCount = res.total;
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
		// 新增线索
		addClue() {
			this.$router.push({
				path: '/clue/clueInfo',
				query: {},
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
			};
			this.sourceValue = '';
			this.initCustomerList();
		},
		// 批量分配顾问
		batchAssignIsAdviser(title) {
			if (this.valLength) {
				this.assignIsAdviserTitle = title;
				this.customerIds = this.multipleSelection.map((clue) => clue.customerId).join(',');
				this.assignIsAdviserFun();
			} else {
				this.$message.error('您当前还未选择需要操作的线索信息');
			}
		},
		//单个分配顾问
		assignIsAdviser(title, customerId) {
			this.assignIsAdviserTitle = title;
			this.customerIds = customerId;
			this.assignIsAdviserFun();
		},
		assignIsAdviserFun() {
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
			allotUser({
				customerIds: this.customerIds,
				...formData,
			})
				.then((res) => {
					if (res.code == 200) {
						this.$message.success(res.msg);
						this.isAdviserShow = false;
						this.initCustomerList();
					}
				})
				.finally(() => {
					this.confirmAdviserLoading = false;
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
			customerExport({
				...this.search,
			});
		},
		// 导入数据
		importData() {
			this.isImportShow = true;
			this.$nextTick(() => {
				this.$refs.TheImportForm.reset();
			});
		},
		async confirmImportClick() {
			// 校验
			let isPass = await this.$refs.TheImportForm.isPass();
			if (isPass == false) {
				return;
			}

			let formData = this.$refs.TheImportForm.getValue();
			this.confirmImportLoading = true;

			importData(formData)
				.then((res) => {
					if (res.code == 200) {
						this.$message.success('导入成功');
						this.isImportShow = false;
						this.importMsg = res.msg;
						this.isImportAnalysisShow = true;
					}
				})
				.finally(() => {
					this.confirmImportLoading = false;
				});
		},
		cancelImport() {
			this.isImportAnalysisShow = false;
			this.initCustomerList();
		},
		confirmImportAnalysisClick() {
			this.isImportAnalysisShow = false;
			this.$emit('changeActiveName', '4');
		},
		changeSource(value) {
			this.sourceValue = value;
		},
	},
};
</script>
<style lang="scss" scoped>
.header-content {
	::v-deep .el-input {
		width: 151px;
	}
}
</style>
