<template>
	<div>
		<el-dialog
			:title="title"
			:visible.sync="show"
			width="500px"
			:before-close="handleClose"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<div v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(255, 255, 255, 0.8)">
				<template v-if="type == '2'">
					<div class="font16" style="line-height: 32px">
						<div>区域名称：{{ ruleForm.areaName }}</div>
						<div class="mt18">区域名称：{{ ruleForm.areaRange.areaRangeStr }}</div>
					</div>
				</template>
				<template v-else>
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
						<el-form-item label="区域名称" prop="areaName">
							<el-input v-model.trim="ruleForm.areaName" placeholder="请输入区域名称"></el-input>
						</el-form-item>
						<el-form-item label="区域地址" prop="areaRangeShow">
							<el-cascader
								:options="options"
								v-model="ruleForm.areaRangeShow"
								@change="cityChange"
								ref="cascaderAddr"
								:props="props"
								clearable
								collapse-tags
								placeholder="请选择区域地址"
							></el-cascader>
						</el-form-item>
						<div class="region-btn">
							<el-button @click="save" size="mini" type="primary">保存</el-button>
							<el-button @click="handleClose" size="mini">取消</el-button>
						</div>
					</el-form>
				</template>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { commonRequest } from '@/api/common/index';
import { addArea, isexist, forupdate, updateArea } from '@/api/region/index';
export default {
	components: {},
	props: {
		regionShow: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: '0',
		},
		areaId: {
			type: String,
		},
	},
	watch: {
		type: {
			handler(val) {
				if (val == '1') {
					this.title = '编辑区域';
				} else if (val == '2') {
					this.title = '区域详情';
					// this.isDetails = true;
				}
			},
			immediate: true,
			deep: true,
		},
	},
	data() {
		return {
			title: '新增区域',
			show: false,
			loading: false,
			props: { value: 'cityAreaCode', label: 'cityAreaName', children: 'subBordList', multiple: true },
			options: [],
			optionsMap: {},
			ruleForm: {
				areaRange: [],
				areaName: '',
			},
			rules: {
				areaRangeShow: [{ required: true, message: '请输入', trigger: 'blur' }],
				areaRange: { required: true, message: '请选择', trigger: 'change' },
			},
		};
	},
	methods: {
		handleClose() {
			this.$emit('closeEvent', false);
		},
		// close(){
		// 	this.$emit('closeEvent', false);
		// },
		save() {
			this.$refs.ruleForm.validate((valid) => {
				if (!valid) {
					return;
				}
				if (!Array.isArray(this.ruleForm.areaRangeShow) || this.ruleForm.areaRangeShow.length <= 0) {
					return;
				}
				let areaRangeStrList = [];
				this.ruleForm.areaRange = [];
				this.ruleForm.areaRangeShow.forEach((item) => {
					let optionStrList = [];
					item.forEach((entity) => {
						optionStrList.push(this.optionsMap[entity].cityAreaName);
					});
					areaRangeStrList.push(optionStrList.join('/'));

					let index = item[item.length - 1];
					this.ruleForm.areaRange.push({
						cityCode: index,
						cityName: this.optionsMap[index].cityAreaName,
					});
				});
				this.ruleForm.areaRangeJson = { areaRangeShow: this.ruleForm.areaRangeShow, areaRangeStr: areaRangeStrList.join(',') };

				let val = this.ruleForm.areaName;
				if (val && val.length > 0) {
					let params = {
						areaName: val,
						areaId: this.areaId,
					};
					this.isexistFun(params);
				}
			});
		},
		optionsHandler(data) {
			data.forEach((item) => {
				this.optionsMap[item.cityAreaCode] = item;
				let subBordList = item.subBordList;
				if (Array.isArray(subBordList) && subBordList.length > 0) {
					this.optionsHandler(subBordList);
				}
			});
		},
		cityChange() {
			// this.$refs.cascaderAddr.getCheckedNodes().map((item)=>{
			// 	console.log(item);
			// })
		},
		isexistFun(params) {
			isexist(params).then((res) => {
				if (res.code === 200) {
					if (this.type == '0') {
						//新增提交
						addArea(this.ruleForm).then((res) => {
							if (res.code === 200) {
								this.$message.success(res.msg);
								this.$emit('regionEvent', false);
							} else {
								this.$message.error(res.msg);
							}
						});
					} else if (this.type == '1') {
						this.ruleForm.areaId = this.areaId;
						updateArea(this.ruleForm).then((res) => {
							if (res.code === 200) {
								this.$message.success(res.msg);
								this.$emit('regionEvent', false);
							} else {
								this.$message.error(res.msg);
							}
						});
					}
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		close() {
			this.$emit('closeEvent', false);
		},
		//回显
		getForupdate() {
			this.loading = true;
			forupdate(this.areaId)
				.then((res) => {
					if (res.code === 200) {
						this.ruleForm = res.data;
						this.ruleForm.areaRangeShow = res.data.areaRange.areaRangeShow;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},

	created() {
		this.show = this.regionShow;
		this.loading = true;
		commonRequest('/common/city/info')
			.then((res) => {
				this.options = res.rows;
				this.optionsHandler(res.rows);
			})
			.finally(() => {
				this.loading = false;
			});

		if (this.type != '0') {
			//回显
			this.getForupdate();
		}
	},
};
</script>

<style scoped lang="scss">
.region-btn {
	text-align: center;
}
.el-cascader {
	width: 100%;
}
</style>
