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
					<el-form-item label="微信号码">
						<el-input clearable :disabled="disabled" v-model="form.wechat" placeholder="请输入微信号"></el-input>
					</el-form-item>
					<el-form-item label="客户来源" prop="source">
						<el-select clearable :disabled="disabled" filterable placeholder="请选择客户来源" v-model="form.source">
							<el-option v-for="item in sourceList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="来店人数" prop="number">
						<el-input-number
							:disabled="disabled"
							v-model="form.number"
							controls-position="right"
							:min="1"
							:max="100"
							placeholder="请输入来店人数"
						></el-input-number>
					</el-form-item>
					<el-form-item label="来店时间">
						<el-date-picker
							:disabled="disabled"
							v-model="form.startTime"
							type="datetime"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择来店时间"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="离店时间">
						<el-date-picker :disabled="disabled" v-model="form.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择离店时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="来店次数" prop="times">
						<el-input :disabled="disabled" v-model="form.times" placeholder="请输入来店次数"></el-input>
					</el-form-item>
					<el-form-item label="接待时长" prop="duration">
						<el-input :disabled="disabled" v-model="form.duration" placeholder="请输入接待时长(min)"></el-input>
					</el-form-item>
					<el-form-item label="接待顾问" prop="userId">
						<el-select clearable :disabled="disabled" filterable placeholder="请选择接待顾问" v-model="form.userId">
							<el-option v-for="item in nameList" :key="item.userId" :value="item.userId" :label="item.userName"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="经理参与" prop="isManagerParticipation">
						<el-radio-group :disabled="disabled" v-model="form.isManagerParticipation">
							<el-radio label="1">是</el-radio>
							<el-radio label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="产品介绍" prop="isIntroduce">
						<el-radio-group :disabled="disabled" v-model="form.isIntroduce">
							<el-radio label="1">是</el-radio>
							<el-radio label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="来访类别" prop="type">
						<el-select
							:disabled="disabled"
							filterable
							clearable
							placeholder="请选择来访类别"
							v-model="form.type"
							class="search-select"
							:popper-append-to-body="false"
						>
							<el-option v-for="item in typesList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="推荐人姓名">
						<el-input clearable :disabled="disabled" v-model="form.referrer" placeholder="请输入推荐人姓名"></el-input>
					</el-form-item>
					<el-form-item label="推荐人手机号">
						<el-input clearable :disabled="disabled" v-model="form.referrerPhone" placeholder="请输入推荐人手机号"></el-input>
					</el-form-item>
					<el-form-item label="推荐人微信号">
						<el-input clearable :disabled="disabled" v-model="form.referrerWechat" placeholder="请输入推荐人微信号"></el-input>
					</el-form-item>
					<el-form-item label="来访目的" prop="purpose">
						<el-radio-group :disabled="disabled" class="el-radio-group-purpose" v-model="form.purpose">
							<el-radio :label="item.dictValue" v-for="(item, index) in purposeList" :key="index">{{ item.dictLabel }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<div class="remark-box">
					<el-form-item label="备注" prop="remark">
						<el-input clearable :disabled="disabled" type="textarea" :rows="4" v-model="form.remark" placeholder="请输入备注"></el-input>
					</el-form-item>
				</div>
				<div class="title">车辆信息</div>
				<div class="flex-warp">
					<el-form-item label="意向车系" prop="intentionCarSeries">
						<el-input clearable :disabled="disabled" v-model="form.intentionCarSeries" placeholder="请输入意向车系"></el-input>
					</el-form-item>
					<el-form-item label="意向车型" prop="intentionCarType">
						<el-input clearable :disabled="disabled" v-model="form.intentionCarType" placeholder="请输入意向车型"></el-input>
					</el-form-item>
					<el-form-item label="现驾车型">
						<el-input clearable :disabled="disabled" v-model="form.carType" placeholder="请输入现驾车型"></el-input>
					</el-form-item>
					<el-form-item label="车牌号">
						<el-input clearable :disabled="disabled" v-model="form.carNo" placeholder="请输入车牌号"></el-input>
					</el-form-item>
				</div>
				<div class="flex-end" v-if="!disabled">
					<el-button size="small" :disabled="!form.phonenumber || form.phonenumber.length != 11" type="primary" @click="relationClue">添加</el-button>
				</div>
				<!-- 表格 -->
				<el-table
					row-key="registerId"
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
					<el-table-column label="客户姓名" prop="name" width="100"></el-table-column>
					<el-table-column label="手机号码" prop="phonenumber" width="150"></el-table-column>
					<el-table-column label="客户来源" prop="source"></el-table-column>
					<el-table-column label="业务类型" prop="businessType" width="150"></el-table-column>
					<el-table-column label="线索状态" prop="status"></el-table-column>
					<el-table-column label="意向车系" prop="intentionCarSeries"></el-table-column>
					<el-table-column label="意向车型" prop="intentionCarType"></el-table-column>
					<el-table-column label="接待顾问" prop="userName"></el-table-column>
					<el-table-column label="创建日期" prop="createTime" width="160" sortable></el-table-column>
					<el-table-column label="操作" width="150" fixed="right" v-if="!disabled">
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
import { addCustomerRegister, customerRegisterDetail, saveCustomerRegister, customerByPhone } from '@/api/storeRegister';
import { deepCopy } from '@/utils/index.js';
import { checkPhone, verifyFullName } from '@/utils/toolsValidate.js';
export default {
	props: {},
	data() {
		return {
			rules: {
				name: [{ required: true, trigger: 'blur', validator: verifyFullName }],
				number: [{ required: true, message: '请输入来店人数', trigger: 'blur' }],
				startTime: [{ required: true, message: '请选择来店时间', trigger: 'change' }],
				isManagerParticipation: [{ required: true, message: '请选择经理是否参与', trigger: 'change' }],
				isIntroduce: [{ required: true, message: '请选择是否进行了产品介绍', trigger: 'change' }],
				purpose: [{ required: true, message: '请选择来访目的', trigger: 'change' }],
				phonenumber: [{ required: true, trigger: 'blur', validator: checkPhone }],
			},
			form: {
				name: '', //客户姓名
				phonenumber: '', //手机号码
				wechat: '', //微信号
				source: '', //客户来源
				number: undefined, //来店人数
				startTime: '', //来店时间
				endTime: '', //离店时间
				times: '', //来店次数
				duration: '', //接待时长
				userId: '', //接待顾问
				isManagerParticipation: '', //经理参与
				isIntroduce: '', //产品介绍
				type: '', //来访类别
				purpose: '', //来访目的
				remark: '', //备注
				intentionCarSeries: '', //意向车系
				intentionCarType: '', //意向车型
				carType: '', //现驾车型
				carNo: '', //车牌号
				referrer: '', //推荐人
				referrerPhone: '', //推荐人手机号
				referrerWechat: '', //推荐人微信号
				customerId: '', //线索id
			},
			typesList: [], // 来访类别下拉列表
			sourceList: [], // 客户来源下拉列表
			purposeList: [], // 来访目的下拉列表
			nameList: [], //所属顾问下拉列表
			defaultForm: {},
			loading: false,
			confirmLoading: false,
			registerId: '',
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
			this.registerId = this.$route.query.registerId;
			this.typeSort = this.$route.query.typeSort;
			this.initSourceList();
			this.initPurposeList();
			this.getUserList();
			this.initVisittypeList();
			if (this.registerId) {
				this.customerRegisterDetail();
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
		customerRegisterDetail() {
			this.loading = true;
			customerRegisterDetail(this.registerId)
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
		//来访目的列表
		initPurposeList() {
			this.loading = true;
			dataDictionary('crm_customer_visitpurpose')
				.then((res) => {
					this.purposeList = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//来访类别列表
		initVisittypeList() {
			this.loading = true;
			dataDictionary('crm_customer_visittype')
				.then((res) => {
					this.typesList = res.data;
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
			if (!this.registerId) {
				// 新增
				this.addCustomerRegister(formData);
			} else {
				// 编辑
				this.saveCustomerRegister(formData);
			}
		},
		// 新增
		addCustomerRegister(formData) {
			addCustomerRegister({
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
		saveCustomerRegister(formData) {
			saveCustomerRegister({
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
		max-width: 1480px;
		.title {
			font-size: 16px;
			color: #7d7d7d;
			font-weight: bold;
			margin-bottom: 20px;
		}
	}
	.remark-box {
		margin-top: 20px;
	}
}
</style>
