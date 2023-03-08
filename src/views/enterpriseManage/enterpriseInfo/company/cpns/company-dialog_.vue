<template>
	<div>
		<el-dialog :title="title" :visible.sync="show" width="30%" :before-close="handleClose">
			<template v-if="!isDetails">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="company-ruleForm">
					<p class="font16 mb15">基础信息</p>
					<el-form-item label="公司名称" prop="name">
						<el-input v-model="ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item label="注册地址" prop="name">
						<el-input v-model="ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item label="法人代表" prop="name">
						<el-input v-model="ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item label="联系电话" prop="name">
						<el-input v-model="ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item label="所在城市" prop="region">
						<el-select v-model="ruleForm.region" placeholder="请选择活动区域">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<p class="font16 mb15">发票信息</p>
					<el-form-item label="企业编码" prop="name">
						<el-input v-model="ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item label="开户账号" prop="name">
						<el-input v-model="ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item label="开户行" prop="name">
						<el-input v-model="ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="submitForm('ruleForm')">立即创建</el-button>
						<el-button size="mini" @click="resetForm('ruleForm')">清空</el-button>
					</el-form-item>
				</el-form>
			</template>

			<template v-else>
				<p class="font16 mb15">基础信息</p>
				<div>
					<span>公司名称：</span>
					<span></span>
				</div>
				<div>
					<span>注册地址：</span>
					<span>123</span>
				</div>
				<div>
					<span>法人代表：</span>
					<span>123</span>
				</div>
				<div>
					<span>联系电话：</span>
					<span>123</span>
				</div>
				<div>
					<span>所在城市：</span>
					<span>123</span>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<script>
export default {
	components: {},
	props: {
		addCompanyShow: {
			type: Boolean,
			default: false,
		},
		companyType: {
			type: String,
			default: '0',
		},
	},
	watch: {
		companyType: {
			handler(val) {
				if (val == '1') {
					this.title = '编辑公司';
				} else if (val == '2') {
					this.title = '公司详情';
					this.isDetails = true;
				}
			},
			immediate: true,
			deep: true,
		},
	},
	data() {
		return {
			title: '新增公司',
			isDetails: false,
			// detailsInfo: [
			// 	{
			// 		label: 'name',
			// 		value: '公司名称',
			// 	},
			// ],
			dialogInfoList: [
				{
					itemName: "基础信息",
					lableList: [
						{
							lable: "公司名称",
							name: "companyName"
						}
					]
				}
			],

			ruleForm: {
				name: '',
				region: '',
			},
			rules: {
				name: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
					{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
				],
				region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
			},
			show: false,
		};
	},
	methods: {
		handleClose() {
			this.$emit('closeEvent', false);
		},

		close() {},
	},

	created() {
		this.show = this.addCompanyShow;
	},
};
</script>
