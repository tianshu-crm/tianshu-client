<template>
	<!-- 来店登记 -->
	<div class="content-body">
		<!-- 头部 -->
		<el-form size="small" label-width="80px">
			<!-- 搜索框 -->
			<div class="flex-warp header-content">
				<el-form-item label="关键字" label-width="60px">
					<el-input v-model="search.key" placeholder="姓名/微信号/手机号"></el-input>
				</el-form-item>
				<el-form-item label="客户来源">
					<el-select filterable size="small" placeholder="请选择客户来源" v-model="search.source" class="search-select">
						<el-option v-for="item in sourceList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="来店时间">
					<el-date-picker :clearable="false" v-model="search.startTime" type="date" value-format="yyyy-MM-dd" placeholder="选择来店时间">
					</el-date-picker>
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
				<el-form-item label="关联来店">
					<el-radio-group v-model="search.isCustomer">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="完成试驾">
					<el-radio-group v-model="search.isTrialrun">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</div>
			<!-- 功能按钮 -->
			<div class="table-action flex-space-between">
				<div class="lf">
					<el-button type="primary" size="small" @click="selectCustomer">查询</el-button>
					<el-button size="small" plain @click="resetSearch">清空</el-button>
				</div>
				<div class="rt">
					<el-button v-hasPermi="['crm:customerRegister:add']" type="primary" size="small" @click="addRegister">新增来店</el-button>
					<el-button v-hasPermi="['crm:customerRegister:import']" type="primary" size="small" @click="importData">导入数据</el-button>
					<el-button v-hasPermi="['crm:customerRegister:export']" type="primary" size="small" @click="exportData">导出数据</el-button>
					<el-button v-hasPermi="['crm:customerRegister:remove']" type="primary" size="small" @click="batchDeleteClick">删除数据</el-button>
				</div>
			</div>
		</el-form>
		<!-- 表格 -->
		<el-table
			row-key="registerId"
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
			<el-table-column label="客户来源" prop="source"></el-table-column>
			<el-table-column label="来店次数" prop="times"></el-table-column>
			<el-table-column label="来访目的" prop="purpose"></el-table-column>
			<el-table-column label="来访类别" prop="type"></el-table-column>
			<el-table-column label="意向车系" prop="intentionCarSeries"></el-table-column>
			<el-table-column label="意向车型" prop="intentionCarType"></el-table-column>
			<el-table-column label="推荐人" prop="referrer"></el-table-column>
			<el-table-column label="推荐人手机号" prop="referrerPhone" width="120"></el-table-column>
			<el-table-column label="推荐人微信号" prop="referrerWechat" width="120"></el-table-column>
			<el-table-column label="接待顾问" prop="userName" width="120"></el-table-column>
			<el-table-column label="创建日期" prop="createTime" width="160" sortable></el-table-column>
			<el-table-column label="操作" width="130" fixed="right">
				<template slot-scope="scope">
					<el-button v-hasPermi="['crm:customerRegister:edit']" type="text" @click="editRegister(scope.row.registerId)">编辑</el-button>
					<el-button v-hasPermi="['crm:customerRegister:query']" type="text" @click="viewRegister(scope.row.registerId)">查看</el-button>
					<el-button v-hasPermi="['crm:customerRegister:remove']" type="text" @click="deleteRegisterClick(scope.row)">删除</el-button>
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
		<!-- 导入数据 -->
		<el-dialog title="导入数据" width="640px" :close-on-click-modal="false" :visible.sync="isImportShow">
			<TheImportForm ref="TheImportForm"></TheImportForm>
			<div slot="footer" class="flex-justify-content-center">
				<el-button size="small" @click="confirmImportClick" type="primary" :loading="confirmImportLoading">确认</el-button>
				<el-button size="small" @click="isImportShow = false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { customerRegisterList, customerRegisterExport, importDataCustomerRegister, deleteCustomerRegister } from '@/api/storeRegister';
import { getUserList } from '@/api/clue';
import { dataDictionary } from '@/api/news';
import TheImportForm from './importForm'; //导入数据
export default {
	data() {
		return {
			search: {
				key: '', //关键字
				source: '', //客户来源
				startTime: '', //来店时间
				userId: '', //所属顾问
				businessType: '', //业务类型
				isCustomer: '', //关联来店
				isTrialrun: '', //完成试驾
			},
			sourceList: [], // 客户来源下拉列表
			businessTypeList: [], // 业务类型下拉列表
			nameList: [], // 接待顾问下拉列表
			customerList: [], //来店列表
			tableHeight: window.innerHeight - 290, //页面高度
			page: 1, //当前页码
			pageSize: 10, //条数
			pageCount: null, //数量
			loading: false, //加载动画
			//导入数据
			isImportShow: false,
			confirmImportLoading: false,
			multipleSelection: [], //点击多选框的值
			valLength: '',
		};
	},
	props: {},
	components: {
		TheImportForm,
	},
	watch: {},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.initCustomerRegisterList();
			this.initSourceList();
			this.initBusinessTypeList();
			this.getUserList();
		},
		// 列表查询
		initCustomerRegisterList() {
			this.loading = true;
			customerRegisterList({
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
		//多选框选中的值
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.valLength = val.length;
		},
		//点击分页
		changePage(page) {
			this.page = page;
			this.initCustomerRegisterList();
		},
		//调整每页显示条数
		handleSizeChange(pageSize) {
			this.pageSize = pageSize;
			this.initCustomerRegisterList();
		},
		//搜索
		selectCustomer() {
			this.page = 1;
			this.initCustomerRegisterList();
		},
		//重置
		resetSearch() {
			this.page = 1;
			this.search = {
				key: '', //关键字
				source: '', //客户来源
				startTime: '', //来店时间
				userId: '', //所属顾问
				businessType: '', //业务类型
				isCustomer: '', //关联来店
				isTrialrun: '', //完成试驾
			};
			this.initCustomerRegisterList();
		},
		routerPushStoreRegister(typeSort, registerId) {
			this.$router.push({
				path: '/storeRegister/addStoreRegister',
				query: {
					typeSort,
					registerId,
				},
			});
		},
		// 新增来店
		addRegister() {
			this.routerPushStoreRegister('add');
		},
		// 编辑来店
		editRegister(registerId) {
			this.routerPushStoreRegister('edit', registerId);
		},
		// 查看来店
		viewRegister(registerId) {
			this.routerPushStoreRegister('view', registerId);
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
			customerRegisterExport({
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

			importDataCustomerRegister(formData)
				.then((res) => {
					if (res.code == 200) {
						this.$message.success('导入成功');
						this.isImportShow = false;
						this.initCustomerRegisterList();
					} else {
						this.$message.success(res.msg);
					}
				})
				.finally(() => {
					this.confirmImportLoading = false;
				});
		},
		// 批量删除
		batchDeleteClick() {
			if (this.valLength) {
				this.deleteRegisters(this.multipleSelection.map((register) => register.registerId).join(','));
			} else {
				this.$message.error('您当前还未选择需要删除的来店登记信息');
			}
		},
		// 单个删除
		deleteRegisterClick(row) {
			this.deleteRegisters(row.registerId);
		},
		deleteRegisters(ids) {
			this.$confirm('确认要删除当前选中的来店登记信息吗？', '提示', {
				type: 'warning',
			})
				.then(() => {
					deleteCustomerRegister(ids).then((res) => {
						if (res.code == 200) {
							this.$message.success(res.msg);
							this.initCustomerRegisterList();
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch(() => {
					this.$message('已取消操作');
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
