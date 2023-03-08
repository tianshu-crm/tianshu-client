<template>
	<!-- 轨迹管理 -->
	<div class="content-body">
		<el-form label-width="80px">
			<!-- 用户个人信息 -->
			<div class="user-content">
				<div class="marginBottom10">
					<div class="flex">
						<div class="userName" v-if="customerInfo.name">{{ customerInfo.name }}</div>
						<div class="marginRight10 marginLeft10">
							<el-tag type="info" v-if="customerInfo.level">{{ customerInfo.level }}</el-tag>
						</div>
						<el-tag type="info" v-if="customerInfo.businessType">{{ customerInfo.businessType }}</el-tag>
					</div>
				</div>
				<div class="flex-warp">
					<el-form-item label="性别:" label-width="50px">{{ customerInfo.sex }}</el-form-item>
					<el-form-item label="手机号码:">{{ customerInfo.phonenumber }}</el-form-item>
					<el-form-item label="微信号:" v-if="customerInfo.wechat">{{ customerInfo.wechat }}</el-form-item>
					<!-- <el-form-item label="证件类型:">{{ customerInfo.certificateType }}</el-form-item>
					<el-form-item label="证件号码:">{{ customerInfo.certificateNo }}</el-form-item> -->
				</div>
			</div>
		</el-form>
		<!-- 头部 -->
		<el-form size="small" label-width="80px">
			<div class="table-action flex-space-between">
				<div class="lf flex">
					<el-form-item label="跟进时间">
						<el-date-picker :clearable="false" v-model="search.createTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择跟进时间"> </el-date-picker>
					</el-form-item>
					<el-form-item label="跟进方式">
						<el-select filterable size="small" placeholder="请选择跟进方式" v-model="search.type" class="search-select">
							<el-option v-for="item in followtypeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label-width="10px">
						<el-button type="primary" size="small" @click="selectCustomer">查询</el-button>
						<el-button size="small" plain @click="resetSearch">清空</el-button>
					</el-form-item>
				</div>
				<div class="rt">
					<el-button v-hasPermi="['crm:customer:track']" type="primary" size="small" @click="routerPushTrajectoryDetail">新增轨迹</el-button>

					<el-button size="small" type="primary" @click="goBack">返回</el-button>
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
			element-loading-text="拼命加载中"
			element-loading-background="rgba(255, 255, 255, 0.8)"
			:header-cell-style="{ background: '#F6F6F6' }"
		>
			<el-table-column label="序号" type="index" width="80">
				<template slot-scope="scope">
					<div>{{ (page - 1) * pageSize + scope.$index + 1 }}</div>
				</template>
			</el-table-column>
			<el-table-column label="跟进方式" prop="type"></el-table-column>
			<el-table-column label="跟进时间" prop="createTime"></el-table-column>
			<el-table-column label="通话时长" prop="callDuration"></el-table-column>
			<el-table-column label="跟进人" prop="createBy"></el-table-column>
			<el-table-column label="跟进内容" prop="content"></el-table-column>
			<el-table-column label="操作" width="100" fixed="right">
				<template slot-scope="scope">
					<!-- v-hasPermi="['crm:customer:trackInfo']" -->
					<el-button type="text" @click="viewDetail(scope.row)">查看详情</el-button>
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
import { getCustomerTrackList, customerInfo } from '@/api/clue';
import { dataDictionary } from '@/api/news';
export default {
	data() {
		return {
			search: {
				createTime: '', //跟进时间
				type: '', //跟进方式
			},
			followtypeList: [],
			customerList: [], //轨迹列表
			tableHeight: window.innerHeight - 360, //页面高度
			page: 1, //当前页码
			pageSize: 10, //条数
			pageCount: null, //数量
			loading: false, //加载动画
			customerId: '',
			businessTypeList: [], //业务类型
			certificateTypesList: [], //证件类型
			sexList: [], //性别
			customerInfo: {}, //线索信息
		};
	},
	props: {},
	components: {},
	watch: {},
	computed: {},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.customerId = this.$route.query.customerId;
			this.initFollowtypeList();
			this.getCustomerInfo();
			this.initCustomerTrackList();
		},
		// 线索信息
		getCustomerInfo() {
			customerInfo(this.customerId).then((res) => {
				if (res.code == 200) {
					this.customerInfo = res.data;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 轨迹列表查询
		initCustomerTrackList() {
			this.loading = true;
			getCustomerTrackList({
				...this.search,
				customerId: this.customerId,
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
		//跟进方式列表
		initFollowtypeList() {
			dataDictionary('crm_customer_followtype').then((res) => {
				this.followtypeList = res.data;
			});
		},
		//点击分页
		changePage(page) {
			this.page = page;
			this.initCustomerTrackList();
		},
		//调整每页显示条数
		handleSizeChange(pageSize) {
			this.pageSize = pageSize;
			this.initCustomerTrackList();
		},
		//搜索
		selectCustomer() {
			this.page = 1;
			this.initCustomerTrackList();
		},
		//重置
		resetSearch() {
			this.page = 1;
			this.search = {
				createTime: '', //跟进时间
				type: '', //跟进方式
			};
			this.initCustomerTrackList();
		},
		// 新增轨迹
		routerPushTrajectoryDetail() {
			this.$router.push({
				path: '/clue/trajectoryDetail',
				query: {
					customerId: this.customerId,
					type: 'add',
				},
			});
		},
		// 查看轨迹详情
		viewDetail(row) {
			this.$router.push({
				path: '/clue/trajectoryDetail',
				query: {
					type: 'edit',
					customerId: this.customerId,
					trackId: row.trackId,
				},
			});
		},
		// 返回
		goBack() {
			this.$router.back();
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
