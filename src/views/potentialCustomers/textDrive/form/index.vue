<template>
	<div class="content-body resetHeight">
		<el-form
			label-width="150px"
			ref="form"
			:model="form"
			:rules="rules"
			v-loading="loading"
			element-loading-text="拼命加载中"
			element-loading-background="rgba(255, 255, 255, 0.8)"
		>
			<div class="formMaxWidth">
				<div class="title">基础信息</div>
				<div class="flex-warp">
					<el-form-item label="客户姓名" prop="name">
						<el-input clearable :disabled="disabled" v-model="form.name" placeholder="请输入客户姓名"></el-input>
					</el-form-item>
					<el-form-item label="手机号码" prop="phonenumber">
						<el-input clearable :disabled="disabled" v-model="form.phonenumber" placeholder="请输入手机号码"></el-input>
					</el-form-item>
					<el-form-item label="客户来源">
						<el-select clearable :disabled="disabled" filterable placeholder="请选择客户来源" v-model="form.source">
							<el-option v-for="item in sourceList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属顾问" prop="userId">
						<el-select clearable :disabled="disabled" filterable placeholder="请选择所属顾问" v-model="form.userId">
							<el-option v-for="item in nameList" :key="item.userId" :value="item.userId" :label="item.userName"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="业务类型" prop="businessType">
						<el-select
							filterable
							clearable
							:disabled="disabled"
							placeholder="请选择业务类型"
							v-model="form.businessType"
							class="search-select"
							:popper-append-to-body="false"
						>
							<el-option v-for="item in businessTypeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="门店编码" prop="storeCode">
						<el-input clearable :disabled="disabled" v-model="form.storeCode" placeholder="请输入门店编码"></el-input>
					</el-form-item>
					<el-form-item label="门店名称" prop="storeName">
						<el-input clearable :disabled="disabled" v-model="form.storeName" placeholder="请输入门店名称"></el-input>
					</el-form-item>
				</div>
				<div class="title">预约信息</div>
				<div class="flex-warp">
					<el-form-item label="试驾单号">
						<el-input disabled v-model="form.trialrunNo" placeholder="保存后可自动生成"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="form.sex">
							<el-radio :disabled="disabled" :label="item.dictValue" v-for="(item, index) in sexList" :key="index">{{ item.dictLabel }}</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="试驾状态" prop="type">
						<el-select
							:disabled="disabled"
							filterable
							clearable
							placeholder="请选择试驾状态"
							v-model="form.type"
							class="search-select"
							:popper-append-to-body="false"
						>
							<el-option v-for="item in trialruntypeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="预约时间" prop="trialrunTime">
						<el-date-picker
							:disabled="disabled"
							v-model="form.trialrunTime"
							type="datetime"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择预约时间"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="试驾人姓名">
						<el-input clearable :disabled="disabled" v-model="form.trialrunName" placeholder="请输入试驾人姓名"></el-input>
					</el-form-item>
					<el-form-item label="试驾人手机号">
						<el-input clearable :disabled="disabled" v-model="form.trialrunPhone" placeholder="请输入试驾人手机号"></el-input>
					</el-form-item>
					<el-form-item label="试驾车型" prop="trialrunCarType">
						<el-input clearable :disabled="disabled" v-model="form.trialrunCarType" placeholder="请输入试驾车型"></el-input>
					</el-form-item>
				</div>
				<div class="remark-box">
					<el-form-item label="备注">
						<el-input clearable :disabled="disabled" type="textarea" :rows="4" v-model="form.remark" placeholder="请输入备注"></el-input>
					</el-form-item>
				</div>
				<div class="flex-end" v-if="!disabled">
					<el-button size="small" :disabled="!form.phonenumber || form.phonenumber.length != 11" type="primary" @click="relationClue">添加</el-button>
				</div>
				<!-- 表格 -->
				<el-table
					row-key="trialrunId"
					ref="multipleTable"
					:data="customerList"
					style="width: 100%"
					height="200px"
					v-loading="clueLoading"
					element-loading-text="拼命加载中"
					element-loading-background="rgba(255, 255, 255, 0.8)"
					:header-cell-style="{ background: '#F6F6F6' }"
				>
					<el-table-column label="序号" type="index" width="80"></el-table-column>
					<el-table-column label="客户姓名" prop="name"></el-table-column>
					<el-table-column label="手机号码" prop="phonenumber" width="120"></el-table-column>
					<el-table-column label="客户来源" prop="source"></el-table-column>
					<el-table-column label="业务类型" prop="businessType" width="100"></el-table-column>
					<el-table-column label="线索状态" prop="status"></el-table-column>
					<el-table-column label="意向车系" prop="intentionCarSeries"></el-table-column>
					<el-table-column label="意向车型" prop="intentionCarType"></el-table-column>
					<el-table-column label="所属顾问" prop="userName"></el-table-column>
					<el-table-column label="创建日期" prop="createTime" width="160" sortable></el-table-column>
					<el-table-column label="操作" width="120" fixed="right" v-if="!disabled">
						<template slot-scope="scope">
							<el-button type="text" @click="routerPushClueDetail(scope.row.customerId)">查看</el-button>
							<el-button type="text" @click="deleteClue(scope.$index)" v-if="customerList.length != 1">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div slot="footer" class="flex-end marginTop10">
					<el-button v-if="typeSort != 'view'" size="small" type="primary" :loading="confirmLoading" @click="confirmClick">
						<span v-if="typeSort == 'add'">保存</span>
						<span v-if="typeSort == 'edit'">编辑</span>
					</el-button>
					<el-button size="small" @click="goBack">退出</el-button>
				</div>
			</div>
		</el-form>
		<el-dialog title="关联线索提示" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
			<span>如有多条线索信息，最多只可关联一条线索，请删除无需关联的线索，删除后不会对已有线索造成影响。</span>
		</el-dialog>
	</div>
</template>
<script>
import { dataDictionary } from '@/api/news';
import { getUserList } from '@/api/clue';
import { addCustomerTrialrun, customerTrialrunDetail, editCustomerTrialrun } from '@/api/textDrive';
import { customerByPhone } from '@/api/storeRegister';
import { deepCopy } from '@/utils/index.js';
import { checkPhone, verifyFullName} from '@/utils/toolsValidate.js';
export default {
	props: {},
	data() {
		return {
			rules: {
				name: [{ required: true, trigger: 'blur', validator: verifyFullName }],
				phonenumber: [{ required: true, trigger: 'blur', validator: checkPhone }],
				userId: [{ required: true, message: '请选择所属顾问', trigger: 'change' }],
				businessType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
				storeCode: [{ required: true, message: '请输入门店编码', trigger: 'blur' }],
				storeName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
				sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
				type: [{ required: true, message: '请选择试驾状态', trigger: 'change' }],
				trialrunTime: [{ required: true, message: '请选择预约时间', trigger: 'change' }],
				trialrunCarType: [{ required: true, message: '请选择试驾车型', trigger: 'change' }],
			},
			form: {
				name: '', //客户姓名
				phonenumber: '', //手机号码
				source: '', //客户来源
				userId: '', //所属顾问
				businessType: '', //业务类型
				storeCode: '', //门店编码
				storeName: '', //门店名称
				trialrunNo: '', //试驾单号
				sex: '', //性别
				type: '', //试驾状态
				trialrunTime: '', //预约时间
				trialrunName: '', //试驾人姓名
				trialrunPhone: '', //试驾人手机号
				trialrunCarType: '', //试驾车型
				remark: '', //备注
			},
			trialruntypeList: [], // 试驾状态下拉列表
			sourceList: [], // 客户来源下拉列表
			nameList: [], //所属顾问下拉列表
			businessTypeList: [], // 业务类型下拉列表
			sexList: [], // 性别下拉列表
			defaultForm: {},
			loading: false,
			confirmLoading: false,
			trialrunId: '',
			typeSort: '',
			customerId: '',
			customerList: [],
			clueLoading: false,
			dialogVisible: false,
		};
	},
	computed: {
		disabled() {
			if (this.typeSort == 'view') {
				return true;
			}
		},
	},
	methods: {
		// 校验
		isPass() {
			return new Promise((resolve) => {
				let form = this.$refs.form;
				form.validate((pass) => {
					resolve(pass);
				});
			});
		},
		init() {
			this.trialrunId = this.$route.query.trialrunId;
			this.typeSort = this.$route.query.typeSort;
			this.initSourceList();
			this.getUserList();
			this.initTrialruntypeList();
			this.initBusinessTypeList();
			this.initSexList();
			if (this.trialrunId) {
				this.customerTrialrunDetail();
			}
		},
		getValue() {
			const form = deepCopy(this.form);
			return form;
		},
		setValue(form = {}) {
			this.form = deepCopy(form);
			if (form.customerInfo.customerId) {
				this.customerList = [deepCopy(form.customerInfo)];
			} else {
				this.customerList = [];
			}
		},
		// 重置清空
		reset() {
			this.form = deepCopy(this.defaultForm);
			this.$refs.form.clearValidate();
		},
		goBack() {
			this.$router.back();
		},
		// 获取来店登记详情
		customerTrialrunDetail() {
			this.loading = true;
			customerTrialrunDetail(this.trialrunId)
				.then((res) => {
					if (res.code == 200) {
						this.$nextTick(() => {
							this.reset();
							this.setValue(res.data);
						});
						this.defaultForm = deepCopy(this.form);
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//客户来源列表
		initSourceList() {
			this.loading = true;
			dataDictionary('crm_customer_source')
				.then((res) => {
					this.sourceList = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//试驾状态列表
		initTrialruntypeList() {
			this.loading = true;
			dataDictionary('crm_customer_trialruntype')
				.then((res) => {
					this.trialruntypeList = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//业务类型列表
		initBusinessTypeList() {
			this.loading = true;
			dataDictionary('crm_customer_businessType')
				.then((res) => {
					this.businessTypeList = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//性别列表
		initSexList() {
			this.loading = true;
			dataDictionary('sys_user_sex')
				.then((res) => {
					this.sexList = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 所属顾问
		getUserList() {
			this.loading = true;
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
		// 保存
		async confirmClick() {
			// 校验
			let isPass = await this.isPass();
			if (isPass == false) {
				return;
			}
			let formData = this.getValue();

			// 出现多条线索--提示
			if (this.customerList.length > 1) {
				this.dialogVisible = true;
				return;
			}

			if (this.customerList.length == 1) {
				this.customerId = this.customerList[0].customerId;
			} else {
				this.customerId = '';
			}

			this.confirmLoading = true;
			if (!this.trialrunId) {
				// 新增
				this.addCustomerTrialrun(formData);
			} else {
				// 编辑
				this.editCustomerTrialrun(formData);
			}
		},
		// 新增
		addCustomerTrialrun(formData) {
			addCustomerTrialrun({
				...formData,
				customerId: this.customerId,
			})
				.then((res) => {
					if (res.code == 200) {
						this.$message.success(res.msg);
						this.goBack();
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.confirmLoading = false;
				});
		},
		// 编辑
		editCustomerTrialrun(formData) {
			editCustomerTrialrun({
				...formData,
				customerId: this.customerId,
			})
				.then((res) => {
					if (res.code == 200) {
						this.$message.success(res.msg);
						this.goBack();
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.confirmLoading = false;
				});
		},
		// 关联线索
		relationClue() {
			this.clueLoading = true;
			customerByPhone(this.form.phonenumber)
				.then((res) => {
					if (res.code == 200) {
						this.customerList = res.data;
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.clueLoading = false;
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
		// 删除线索
		deleteClue(index) {
			this.customerList.splice(index, 1);
		},
	},
	created() {
		this.init();
	},
};
</script>
<style lang="scss" scoped>
.content-body {
	::v-deep .el-input,
	::v-deep .el-input-number,
	::v-deep .el-radio-group {
		width: 220px;
	}

	.el-radio-group-purpose {
		min-width: 400px;
	}

	.radio-group-width {
		width: 350px;
	}

	.formMaxWidth {
		max-width: 1110px;
		.title {
			font-size: 16px;
			color: #7d7d7d;
			font-weight: bold;
			margin-bottom: 20px;
		}
	}
	.remark-box {
		margin: 20px 0 20px;
	}
}
</style>
