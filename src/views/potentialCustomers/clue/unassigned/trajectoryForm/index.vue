<template>
	<div class="content-body resetHeight">
		<div class="formMaxWidth">
			<el-form
				label-width="110px"
				ref="form"
				:model="form"
				:rules="rules"
				v-loading="loading"
				element-loading-text="拼命加载中"
				element-loading-background="rgba(255, 255, 255, 0.8)"
			>
				<!-- 用户个人信息 -->
				<div class="user-content">
					<div class="user-header flex-space-between marginBottom10">
						<div class="flex">
							<div class="userName">{{ form.name }}</div>
							<div class="marginRight10 marginLeft10">
								<el-tag type="info" v-if="form.level">{{ form.level }}</el-tag>
							</div>

							<el-tag type="info" v-if="businessType_label">{{ businessType_label }}</el-tag>
							<TheIcon class="clue-icon" :status="form.status"></TheIcon>
						</div>
						<!-- 功能按钮 -->
						<div v-if="disabled">
							<el-button v-hasPermi="['crm:customer:track']" type="primary" size="small" @click="addTrajectory('add')">新增轨迹</el-button>
							<el-button size="small" type="primary" @click="goBack">返回</el-button>
						</div>
					</div>
					<div class="flex-warp">
						<el-form-item label="性别" prop="sex" label-width="60px">
							<el-radio-group class="el-radio-group-sex" :disabled="disabled" v-model="form.sex">
								<el-radio :label="item.dictValue" v-for="(item, index) in sexList" :key="index">{{ item.dictLabel }}</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="手机号码" prop="phonenumber" label-width="80px">
							<el-input clearable :disabled="disabled" v-model="form.phonenumber" placeholder="请输入手机号码"></el-input>
						</el-form-item>
						<el-form-item label="微信号" label-width="70px">
							<el-input clearable :disabled="disabled" v-model="form.wechat" placeholder="请输入微信号"></el-input>
						</el-form-item>
						<el-form-item label="证件类型" prop="certificateType" label-width="90px">
							<el-select
								:disabled="disabled"
								filterable
								clearable
								placeholder="请选择证件类型"
								v-model="form.certificateType"
								class="search-select"
								:popper-append-to-body="false"
							>
								<el-option v-for="item in certificateTypesList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="证件号码" prop="certificateNo" label-width="90px">
							<el-input clearable :disabled="disabled" v-model="form.certificateNo" placeholder="请输入证件号码"></el-input>
						</el-form-item>
						<el-form-item label="年龄" prop="age" label-width="60px">
							<el-input-number
								:disabled="disabled"
								v-model="form.age"
								controls-position="right"
								:min="1"
								:max="100"
								placeholder="请输入年龄"
							></el-input-number>
						</el-form-item>
					</div>
				</div>
				<!-- 标签页 -->
				<!-- <el-tabs v-model="activeName" type="card">
				<el-tab-pane label="线索信息" name="0"></el-tab-pane>
				<el-tab-pane label="来店登记" name="1"></el-tab-pane>
				<el-tab-pane label="试乘试驾" name="2"></el-tab-pane>
				<el-tab-pane label="电话咨询" name="3"></el-tab-pane>
			</el-tabs> -->
				<div>
					<div class="borderBottom marginBottom10">
						<div class="title">基础信息</div>
						<div class="flex-warp">
							<el-form-item label="业务类型" prop="businessType">
								<el-select
									:disabled="disabled"
									filterable
									clearable
									placeholder="请选择业务类型"
									v-model="form.businessType"
									class="search-select"
									:popper-append-to-body="false"
								>
									<el-option v-for="item in businessTypeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="线索阶段" prop="stage">
								<el-select
									:disabled="disabled"
									filterable
									clearable
									placeholder="请选择线索阶段"
									v-model="form.stage"
									class="search-select"
									:popper-append-to-body="false"
								>
									<el-option v-for="item in stageList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="客户来源" prop="source">
								<el-select
									:disabled="disabled"
									filterable
									clearable
									placeholder="请选择客户来源"
									v-model="form.source"
									class="search-select"
									:popper-append-to-body="false"
								>
									<el-option v-for="item in sourceList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
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
							<el-form-item label="导入批号">
								<el-input disabled v-model="form.importNO" placeholder="无"></el-input>
							</el-form-item>
							<el-form-item label="来店留档" prop="isFile">
								<el-radio-group :disabled="disabled" v-model="form.isFile">
									<el-radio label="0">是</el-radio>
									<el-radio label="1">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<!-- <el-form-item label="客户地址">
							<el-input clearable :disabled="disabled" v-model="form.adress" placeholder="请输入客户地址"></el-input>
						</el-form-item> -->
							<el-form-item label="创建时间">
								<el-input disabled v-model="form.createTime" placeholder="请输入创建时间"></el-input>
							</el-form-item>
							<el-form-item label="所属顾问">
								<el-input disabled v-model="form.userName" placeholder="请输入所属顾问"></el-input>
							</el-form-item>
							<el-form-item label="分配时间">
								<el-input disabled v-model="form.allotTime" placeholder="请输入分配时间"></el-input>
							</el-form-item>
						</div>
					</div>
					<div class="borderBottom marginBottom10 paddingBottom10">
						<div class="title">意向信息</div>
						<div class="flex-warp">
							<el-form-item label="意向车系" prop="intentionCarSeries">
								<el-input clearable :disabled="disabled" v-model="form.intentionCarSeries" placeholder="请输入意向车系"></el-input>
							</el-form-item>
							<el-form-item label="意向车型" prop="intentionCarType">
								<el-input clearable :disabled="disabled" v-model="form.intentionCarType" placeholder="请输入意向车型"></el-input>
							</el-form-item>
							<el-form-item label="购车类型" prop="purchaseCarType">
								<el-select
									:disabled="disabled"
									filterable
									clearable
									placeholder="请选择购车类型"
									v-model="form.purchaseCarType"
									class="search-select"
									:popper-append-to-body="false"
								>
									<el-option v-for="item in purchaseCarTypeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="购车预算" prop="purchaseCarBudget">
								<el-input :disabled="disabled" v-model="form.purchaseCarBudget" placeholder="请输入购车预算"></el-input>
							</el-form-item>
							<el-form-item label="购车时间">
								<el-date-picker :disabled="disabled" v-model="form.purchaseCarTime" value-format="yyyy-MM-dd" type="date" placeholder="选择购车时间">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="是否有人证">
								<el-radio-group :disabled="disabled" v-model="form.isCertificate">
									<el-radio label="0">是</el-radio>
									<el-radio label="1">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="是否网约车从业者" label-width="165px">
								<el-radio-group :disabled="disabled" v-model="form.isOnlineCarUser">
									<el-radio label="0">是</el-radio>
									<el-radio label="1">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</div>
						<el-form-item label="意向说明" prop="intentionDesc">
							<el-input clearable :disabled="disabled" type="textarea" :rows="4" v-model="form.intentionDesc" placeholder="请输入意向说明"></el-input>
						</el-form-item>
					</div>
					<div class="borderBottom marginBottom10">
						<div class="title">竞争对手信息</div>
						<div class="flex-warp">
							<el-form-item label="竞争公司" prop="competeCompany">
								<el-input clearable :disabled="disabled" v-model="form.competeCompany" placeholder="请输入竞争公司"></el-input>
							</el-form-item>
							<el-form-item label="竞争品牌车型" prop="competeCar">
								<el-input clearable :disabled="disabled" v-model="form.competeCar" placeholder="请输入竞争品牌车型"></el-input>
							</el-form-item>
							<el-form-item label="备注" prop="competeDesc">
								<div class="competeDesc-box">
									<el-input type="textarea" disabled v-model="form.competeDesc" placeholder="请输入备注"></el-input>
								</div>
							</el-form-item>
						</div>
					</div>
					<div class="clue-total">
						<div class="flex-space-between">
							<div class="title">线索轨迹</div>
						</div>
						<!-- 新增轨迹的表单 -->
						<TheForm ref="TheForm" :disabled="disabled"></TheForm>
					</div>
					<div class="flex-space-between">
						<div class="footer flex-space-around">
							<div>创建人：{{ form.createBy }}</div>
							<div>创建时间：{{ form.createTime }}</div>
							<div>最后修改人：{{ form.updateBy }}</div>
							<div>最后修改时间：{{ form.updateTime }}</div>
						</div>
						<div class="flex-end" v-if="!disabled">
							<el-button size="small" @click="confirmClick" type="primary" :loading="confirmLoading">确认</el-button>
							<el-button size="small" @click="goBack">取消</el-button>
						</div>
					</div>
				</div>
			</el-form>
		</div>
	</div>
</template>
<script>
import { dataDictionary } from '@/api/news';
import { addCustomerRecord, getCustomerDetail, customerTrackInfo } from '@/api/clue';
import TheForm from './form';
import TheIcon from '../clueDetail/form/icon.vue';
import { deepCopy } from '@/utils/index.js';
import { checkPhone, verifyFullName, checkIdCard, checkPassPort } from '@/utils/toolsValidate.js';
export default {
	data() {
		return {
			rules: {
				// name: [{ required: true, trigger: 'blur', validator: verifyFullName }],
				phonenumber: [{ required: true, trigger: 'blur', validator: checkPhone }],
				// age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
				// level: [{ required: true, message: '请选择意向级别', trigger: 'change' }],
				// businessType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
				// sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
				// isFile: [{ required: true, message: '请选择是否来店留档', trigger: 'change' }],
				// certificateType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
				// certificateNo: [{ required: true, trigger: 'blur', validator: checkIdCard }],
			},
			form: {},
			certificateTypesList: [], // 证件类型下拉列表
			sexList: [], // 性别下拉列表
			sourceList: [], // 客户来源下拉列表
			purchaseCarTypeList: [], // 购车类型下拉列表
			businessTypeList: [], // 业务类型下拉列表
			stageList: [], // 线索阶段下拉列表
			defaultForm: {},
			loading: false,
			type: '',
			// activeName: '0', //默认选中的标签页
			confirmLoading: false,
			clueInfo: '', //详情内容
			customerId: '',
			trackId: '',
		};
	},
	components: {
		TheForm,
		TheIcon,
	},
	computed: {
		disabled() {
			if (this.type == 'edit') {
				return true;
			}
		},
		businessType_label() {
			for (let i = 0; i < this.businessTypeList.length; i++) {
				if (this.businessTypeList[i].dictValue == this.form.businessType) {
					return this.businessTypeList[i].dictLabel;
				}
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
			this.customerId = this.$route.query.customerId;
			this.type = this.$route.query.type; //类型-修改还是详情
			this.trackId = this.$route.query.trackId;
			// 数据字典
			this.initSourceList();
			this.initSexList();
			this.initLevelList();
			this.initBusinessTypeList();
			this.initCertificateTypeseList();
			this.initPurchaseCarTypeList();
			this.initStageList();
			this.getCustomerDetail();

			if (this.trackId) {
				this.getCustomerTrackInfo();
			}
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
		// 返回
		goBack() {
			this.$router.back();
		},
		// 确认
		async confirmClick() {
			// 先校验基础信息
			let isPass = await this.isPass();
			if (isPass == false) {
				return;
			}

			let basicFormData = this.getValue();

			// 再校验线索轨迹----目前没确定要不要校验
			// let isCluePass = await this.$refs.TheForm.isPass();
			// if (isCluePass == false) {
			// 	return;
			// }

			let clueFormData = this.$refs.TheForm.getValue();

			this.confirmLoading = true;
			addCustomerRecord({
				...basicFormData,
				...clueFormData,
			})
				.then((res) => {
					if (res.code == 200) {
						this.$message.success(res.msg);
						this.routerPushTrajectoryInfo();
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.confirmLoading = false;
				});
		},
		// 跳转轨迹列表页面
		routerPushTrajectoryInfo() {
			this.$router.push({
				path: '/clue/trajectoryInfo',
				query: {
					customerId: this.customerId,
				},
			});
		},
		// 新增轨迹
		addTrajectory() {
			this.$router.push({
				path: '/clue/trajectoryDetail',
				query: {
					customerId: this.customerId,
					type: 'add',
				},
			});
			this.init();
		},
		//客户来源列表
		initSourceList() {
			dataDictionary('crm_customer_source').then((res) => {
				this.sourceList = res.data;
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
		//购车类型
		initPurchaseCarTypeList() {
			dataDictionary('crm_customer_purchaseType').then((res) => {
				this.purchaseCarTypeList = res.data;
			});
		},
		//线索阶段
		initStageList() {
			dataDictionary('crm_customer_stage').then((res) => {
				this.stageList = res.data;
			});
		},
		// 获取线索详情
		getCustomerDetail() {
			this.loading = true;
			getCustomerDetail(this.customerId)
				.then((res) => {
					if (res.code == 200) {
						this.clueInfo = res.data;
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
		// 获取线索轨迹
		getCustomerTrackInfo() {
			this.loading = true;
			customerTrackInfo(this.trackId)
				.then((res) => {
					if (res.code == 200) {
						this.$nextTick(() => {
							this.$refs.TheForm.reset();
							this.$refs.TheForm.setValue(res.data);
						});
					} else {
						this.$message.error(res.msg);
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
	created() {
		this.init();
	},
};
</script>
<style lang="scss" scoped>
.content-body {
	.formMaxWidth {
		width: 1630px;
	}
	.flex {
		position: relative;
		.clue-icon {
			position: absolute;
			top: -35px;
			right: -100px;
			width: 100px;
			height: 100px;
		}
	}
	::v-deep .el-input,
	::v-deep .el-input-number,
	::v-deep .el-radio-group {
		width: 161px;
	}
	.el-radio-group-sex {
		width: 200px;
	}
	.title {
		font-size: 16px;
		color: #7d7d7d;
		font-weight: bold;
		margin-bottom: 20px;
	}
	.user-content {
		.user-header {
			padding: 15px 0;
		}
		.userName {
			font-weight: bold;
			font-size: 20px;
		}
	}
	.clue-total {
		color: #7d7d7d;
		font-size: 16px;
		font-weight: bold;
		.clue-content {
			.clue-index {
				margin: 0 100px 0 60px;
			}
		}
	}
	.footer {
		width: 100%;
		color: #c0c4cc;
	}
	
	.competeDesc-box {
		width: 975px;
	}
}
</style>
