<template>
	<div class="content-body resetHeight">
		<el-form label-width="150px" ref="form" :model="form" :rules="rules">
			<div class="formMaxWidth">
				<div class="title">基础信息</div>
				<div class="flex-warp">
					<el-form-item label="客户姓名" prop="name">
						<el-input clearable v-model="form.name" placeholder="请输入客户姓名"></el-input>
					</el-form-item>
					<el-form-item label="手机号码" prop="phonenumber">
						<el-input clearable v-model="form.phonenumber" placeholder="请输入手机号码"></el-input>
					</el-form-item>
					<el-form-item label="微信号">
						<el-input clearable v-model="form.wechat" placeholder="请输入微信号"></el-input>
					</el-form-item>
					<el-form-item label="证件类型" prop="certificateType">
						<el-select
							filterable
							clearable
							size="small"
							placeholder="请选择证件类型"
							v-model="form.certificateType"
							class="search-select"
							:popper-append-to-body="false"
							@change="cardChange($event)"
						>
							<el-option v-for="item in certificateTypesList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="证件号码" prop="certificateNo">
						<el-input clearable v-model="form.certificateNo" placeholder="请输入证件号码"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="form.sex">
							<el-radio :label="item.dictValue" v-for="(item, index) in sexList" :key="index">{{ item.dictLabel }}</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="年龄" prop="age">
						<el-input-number v-model="form.age" controls-position="right" :min="1" :max="100" placeholder="请输入年龄"></el-input-number>
					</el-form-item>
					<el-form-item label="意向级别" prop="level">
						<el-select
							filterable
							clearable
							size="small"
							placeholder="请选择意向级别"
							v-model="form.level"
							class="search-select"
							:popper-append-to-body="false"
						>
							<el-option v-for="item in levelList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="客户性质" prop="nature">
						<el-select
							filterable
							clearable
							size="small"
							placeholder="请选择客户性质"
							v-model="form.nature"
							class="search-select"
							:popper-append-to-body="false"
						>
							<el-option v-for="item in naturesList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="推荐人姓名">
						<el-input clearable v-model="form.referrer" placeholder="请输入推荐人姓名"></el-input>
					</el-form-item>
					<el-form-item label="推荐人手机号码">
						<el-input clearable v-model="form.referrerPhone" placeholder="请输入推荐人手机号码"></el-input>
					</el-form-item>
					<el-form-item label="推荐人微信号">
						<el-input clearable v-model="form.referrerWechat" placeholder="请输入推荐人微信号"></el-input>
					</el-form-item>
					<el-form-item label="业务类型" prop="businessType">
						<el-select
							filterable
							clearable
							size="small"
							placeholder="请选择业务类型"
							v-model="form.businessType"
							class="search-select"
							:popper-append-to-body="false"
						>
							<el-option v-for="item in businessTypeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="来店留档" prop="isFile">
						<el-radio-group v-model="form.isFile">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<div class="title">意向信息</div>
				<div class="flex-warp">
					<el-form-item label="意向车系">
						<el-input clearable v-model="form.intentionCarSeries" placeholder="请输入意向车系"></el-input>
					</el-form-item>
					<el-form-item label="意向车型">
						<el-input clearable v-model="form.intentionCarType" placeholder="请输入意向车型"></el-input>
					</el-form-item>
					<el-form-item label="购车类型">
						<el-select
							filterable
							clearable
							size="small"
							placeholder="请选择购车类型"
							v-model="form.purchaseCarType"
							class="search-select"
							:popper-append-to-body="false"
						>
							<el-option v-for="item in purchaseCarTypeeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="购车预算" prop="purchaseCarBudget">
						<el-input v-model="form.purchaseCarBudget" placeholder="请输入购车预算"></el-input>
					</el-form-item>
					<el-form-item label="购车时间">
						<el-date-picker v-model="form.purchaseCarTime" value-format="yyyy-MM-dd" type="date" placeholder="选择购车时间"> </el-date-picker>
					</el-form-item>
					<el-form-item label="是否网约车从业者">
						<el-radio-group v-model="form.isOnlineCarUser">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="是否有人证">
						<el-radio-group v-model="form.isCertificate">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<el-form-item label="意向说明" prop="intentionDesc">
					<el-input type="textarea" :rows="4" v-model="form.intentionDesc" placeholder="请输入意向说明"></el-input>
				</el-form-item>
				<div slot="footer" class="flex-justify-content-center">
					<el-button size="small" type="primary" :loading="confirmLoading" @click="confirmClick">确认</el-button>
					<el-button size="small" @click="goBack">返回</el-button>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { checkPhone, verifyFullName, checkIdCard, checkPassPort } from '@/utils/toolsValidate.js';
import { deepCopy } from '@/utils/index.js';
import { dataDictionary } from '@/api/news';
import { addCustomer } from '@/api/clue';
export default {
	props: {
		type: {
			type: String,
		},
	},
	data() {
		return {
			rules: {
				name: [{ required: true, trigger: 'blur', validator: verifyFullName }],
				phonenumber: [{ required: true, trigger: 'blur', validator: checkPhone }],
				// age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
				// level: [{ required: true, message: '请选择意向级别', trigger: 'change' }],
				// nature: [{ required: true, message: '请选择客户性质', trigger: 'change' }],
				// businessType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
				// sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
				// isFile: [{ required: true, message: '请选择是否来店留档', trigger: 'change' }],
				// certificateType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
				// certificateNo: [{ required: true, trigger: 'blur', validator: checkIdCard }],
			},
			form: {
				name: '', //客户姓名
				phonenumber: '', //手机号码
				wechat: '', //微信号
				sex: '', //性别
				age: undefined, //年龄
				level: '', //意向级别
				nature: '', //客户性质
				businessType: '', //业务类型
				isFile: '', //来店留档
				certificateType: '', //证件类型
				certificateNo: '', //证件号码
				referrer: '', //推荐人姓名
				referrerPhone: '', //推荐人手机号码
				referrerWechat: '', //推荐人微信号
				purchaseCarBudget: undefined, //购车预算
				purchaseCarTime: '', //购车时间
				isOnlineCarUser: '', //是否网约车从业者
				isCertificate: '', //是否有人证
				intentionDesc: '', //意向说明
				intentionCarSeries: '', //意向车系
				intentionCarType: '', //意向车型
				purchaseCarType: '', //购车类型
			},
			sexList: [], // 性别下拉列表
			levelList: [], // 意向级别下拉列表
			naturesList: [], // 客户性质下拉列表
			businessTypeList: [], // 业务类型下拉列表
			certificateTypesList: [], // 证件类型下拉列表
			purchaseCarTypeeList: [], // 购车类型下拉列表
			defaultForm: {},
			confirmLoading: false,
		};
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
			this.defaultForm = deepCopy(this.form);
			this.initSexList();
			this.initLevelList();
			this.initBusinessTypeList();
			this.initCertificateTypeseList();
			this.initNaturesList();
			this.initPurchaseCarTypList();
		},
		getValue() {
			const form = deepCopy(this.form);
			return form;
		},
		setValue(form = {}) {
			this.form = deepCopy(form);
		},
		// 重置清空
		reset() {
			this.form = deepCopy(this.defaultForm);
			this.$refs.form.clearValidate();
		},
		goBack() {
			this.$router.back();
		},
		// 新增线索
		async confirmClick() {
			// 校验
			let isPass = await this.isPass();

			if (isPass == false) {
				return;
			}

			let formData = this.getValue();
			this.confirmLoading = true;
			addCustomer({
				...formData,
			})
				.then((res) => {
					if (res.code == 200) {
						this.$message.success(res.msg);
						this.goBack();
					}
				})
				.finally(() => {
					this.confirmLoading = false;
				});
		},
		//性别列表
		initSexList() {
			dataDictionary('sys_user_sex').then((res) => {
				this.sexList = res.data;
			});
		},
		//意向级别列表
		initLevelList() {
			dataDictionary('crm_customer_level').then((res) => {
				this.levelList = res.data;
			});
		},
		//业务类型列表
		initBusinessTypeList() {
			dataDictionary('crm_customer_businessType').then((res) => {
				this.businessTypeList = res.data;
			});
		},
		//证件类型
		initCertificateTypeseList() {
			dataDictionary('sys_document_type').then((res) => {
				this.certificateTypesList = res.data;
			});
		},
		//客户性质
		initNaturesList() {
			dataDictionary('crm_customer_nature').then((res) => {
				this.naturesList = res.data;
			});
		},
		//购车类型
		initPurchaseCarTypList() {
			dataDictionary('crm_customer_purchaseType').then((res) => {
				this.purchaseCarTypeeList = res.data;
			});
		},
		//证件类型change事件
		cardChange(e) {
			this.form.certificateNo = '';
			if (e == 1) {
				// 护照
				this.rules.certificateNo[0].validator = checkPassPort;
			} else {
				// 身份证
				this.rules.certificateNo[0].validator = checkIdCard;
			}
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
	.formMaxWidth {
		width: 1110px;
		.title {
			font-size: 16px;
			color: #7d7d7d;
			font-weight: bold;
			margin-bottom: 20px;
		}
	}
}
</style>
