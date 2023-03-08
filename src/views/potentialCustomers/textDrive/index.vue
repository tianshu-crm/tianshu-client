<template>
	<!-- 试乘试驾 -->
	<div class="content-body">
		<!-- 头部 -->
		<el-form size="small" label-width="80px">
			<!-- 搜索框 -->
			<div class="flex-warp header-content">
				<el-form-item label="关键字" label-width="60px">
					<el-input class="input-key" v-model="search.key" placeholder="试驾单号/姓名/手机号"></el-input>
				</el-form-item>
				<el-form-item label="预约时间">
					<el-date-picker :clearable="false" v-model="search.trialrunTime" type="date" value-format="yyyy-MM-dd" placeholder="选择预约时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="试驾类型">
					<el-radio-group v-model="search.type">
						<el-radio :label="item.dictValue" v-for="(item, index) in typeList" :key="index">{{ item.dictLabel }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="试驾车系">
					<el-input v-model="search.trialrunCarSeries" placeholder="请输入试驾车系"></el-input>
				</el-form-item>
				<el-form-item label="试驾车型">
					<el-input v-model="search.trialrunCarType" placeholder="请输入试驾车型"></el-input>
				</el-form-item>
				<el-form-item label="试驾时间">
					<el-date-picker :clearable="false" v-model="search.createTime" type="date" value-format="yyyy-MM-dd" placeholder="选择试驾时间">
					</el-date-picker>
				</el-form-item>
			</div>
			<el-form-item label="试驾状态">
				<el-radio-group v-model="search.status">
					<el-radio :label="item.dictValue" v-for="(item, index) in statusList" :key="index">{{ item.dictLabel }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 功能按钮 -->
			<div class="table-action flex-space-between">
				<div class="lf">
					<el-button type="primary" size="small" @click="selectCustomer">查询</el-button>
					<el-button size="small" plain @click="resetSearch">清空</el-button>
				</div>
				<div class="rt">
					<el-button v-hasPermi="['crm:customerTrialrun:add']" type="primary" size="small" @click="addRegister">新增试乘试驾</el-button>
					<el-button v-hasPermi="['crm:customerTrialrun:export']" type="primary" size="small" @click="exportData">导出数据</el-button>
				</div>
			</div>
		</el-form>
		<!-- 表格 -->
		<el-table
			row-key="trialrunId"
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
			<el-table-column label="试驾单号" prop="trialrunNo" width="220"></el-table-column>
			<el-table-column label="试驾类型" prop="type"></el-table-column>
			<el-table-column label="试驾状态" prop="status"></el-table-column>
			<el-table-column label="门店编码" prop="storeCode"></el-table-column>
			<el-table-column label="门店名称" prop="storeName"></el-table-column>
			<el-table-column label="业务类型" prop="businessType" width="150"></el-table-column>
			<el-table-column label="客户姓名" prop="name"></el-table-column>
			<el-table-column label="手机号" prop="phonenumber" width="150"></el-table-column>
			<el-table-column label="操作" width="120" fixed="right">
				<template slot-scope="scope">
					<el-button v-hasPermi="['crm:customerTrialrun:query']" type="text" @click="viewRegister(scope.row.trialrunId)">查看</el-button>
					<el-button v-hasPermi="['crm:customerTrialrun:edit']" type="text" @click="editRegister(scope.row.trialrunId)">重新预约</el-button>
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
	</div>
</template>
<script>
import { customerTrialrunList, customerTrialrunExport } from '@/api/textDrive';
import { dataDictionary } from '@/api/news';
export default {
	data() {
		return {
			search: {
				key: '', //关键字
				trialrunTime: '', //预约时间
				type: '', //试驾类型
				status: '', //试驾状态
				trialrunCarType: '', //试驾车型
				trialrunCarSeries: '', //试驾车系
				createTime: '', //试驾时间
			},
			typeList: [], // 试驾类型下拉列表
			statusList: [], // 试驾状态下拉列表
			customerList: [], //来店列表
			tableHeight: window.innerHeight - 340, //页面高度
			page: 1, //当前页码
			pageSize: 10, //条数
			pageCount: null, //数量
			loading: false, //加载动画
			multipleSelection: [], //点击多选框的值
			valLength: '',
		};
	},
	props: {},
	components: {},
	watch: {},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.initCustomerRegisterList();
			this.initTrialruntypeList();
			this.initTrialrunstatusList();
		},
		// 列表查询
		initCustomerRegisterList() {
			this.loading = true;
			customerTrialrunList({
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
		//试驾类型列表
		initTrialruntypeList() {
			dataDictionary('crm_customer_trialruntype').then((res) => {
				this.typeList = res.data;
			});
		},
		//试驾状态列表
		initTrialrunstatusList() {
			dataDictionary('crm_customer_trialrunstatus').then((res) => {
				this.statusList = res.data;
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
				key: '',
				trialrunTime: '',
				type: '',
				status: '',
				trialrunCarType: '',
				trialrunCarSeries: '',
				createTime: '',
			};
			this.initCustomerRegisterList();
		},
		routerPushStoreRegister(typeSort, trialrunId) {
			this.$router.push({
				path: '/textDrive/addTextDrive',
				query: {
					typeSort,
					trialrunId,
				},
			});
		},
		// 新增来店
		addRegister() {
			this.routerPushStoreRegister('add');
		},
		// 编辑来店
		editRegister(trialrunId) {
			this.routerPushStoreRegister('edit', trialrunId);
		},
		// 查看来店
		viewRegister(trialrunId) {
			this.routerPushStoreRegister('view', trialrunId);
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
			customerTrialrunExport({
				...this.search,
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.header-content {
	.input-key {
		width: 200px !important;
	}
	::v-deep .el-input {
		width: 150px;
	}
}
</style>
