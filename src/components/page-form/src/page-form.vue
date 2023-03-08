<!-- eslint-disable vue/valid-v-for -->
<!-- eslint-disable vue/no-v-for-template-key -->
<!-- eslint-disable vue/no-mutating-props -->
<template>
	<div>
		<el-form
			class="form"
			ref="refForm"
			:model="searchData"
			:rules="rules"
			:size="size"
			:label-width="labelWidth"
			:hide-required-asterisk="isShowRequired"
			:width="width"
		>
			<template v-if="!isDetails">
				<el-form-item v-for="item in searchForm" :label="item.label" :key="item.prop" :prop="item.prop" class="formItem">
					<!-- 输入框 -->
					<el-input
						v-if="item.type === 'input'"
						v-model="searchData[item.prop]"
						:size="item.size"
						:style="{ width: item.width }"
						:placeholder="item.placeholder"
					></el-input>
					<!-- 下拉框 -->
					<el-select
						v-if="item.type === 'select'"
						v-model="searchData[item.prop]"
						:size="item.size"
						@change="item.change(searchData[item.prop])"
						:style="{ width: item.width }"
						:placeholder="item.placeholder"
					>
						<el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value"></el-option>
					</el-select>
					<!-- 单选 -->
					<el-radio-group v-if="item.type === 'radio'" v-model="searchData[item.prop]">
						<el-radio v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ ra.label }}</el-radio>
					</el-radio-group>
					<!-- 级联选择器 -->
					<el-cascader
						v-if="item.type === 'cascader'"
						v-model="searchData[item.prop]"
						:options="item.options"
						:props="item.props"
						@change="item.change(searchData[item.prop])"
						ref="cascader"
						collapse-tags
						:placeholder="item.placeholder"
					></el-cascader>
				</el-form-item>
			</template>

			<!-- 详情状态 -->
			<template v-else>
				<div class="dept-details mb30">
					<div class="font14 mt15" v-for="(item, index) in searchForm" :key="index">
						<span>{{ item.label }}:</span>
						<span class="ml10">{{ searchData[item.prop] }}</span>
					</div>
				</div>
			</template>

			<!-- 按钮 -->
			<div v-if="isHandle" class="btn-wrap">
				<template v-for="item in searchHandle">
					<el-button :type="item.type" :size="item.size || size" @click="item.handle()" :class="item.class">{{ item.label }}</el-button>
				</template>

				<!-- <el-form-item v-for="(item, index) in searchHandle" :key="index" class="btn-items">
					<el-button :type="item.type" :size="item.size || size" @click="item.handle()" :class="item.class">{{ item.label }}</el-button>
				</el-form-item> -->
			</div>
		</el-form>
	</div>
</template>

<script>
import { commonRequest } from '@/api/common/index';
export default {
	props: {
		isHandle: {
			type: Boolean,
			default: true,
		},
		labelWidth: {
			type: String,
			default: '80px',
		},
		width: {
			type: String,
			default: '200px',
		},
		size: {
			type: String,
			default: 'medium',
		},
		rules: {
			type: Object,
			default: function () {
				return {};
			},
		},
		searchForm: {
			type: Array,
			default: () => [],
		},
		searchHandle: {
			type: Array,
			default: () => [],
		},
		searchData: {
			type: Object,
			default: function () {
				return {};
			},
		},
		isShowRequired: {
			type: Boolean,
			default: true,
		},
		//父组件传过来的是否为查看详情状态表示
		isDetails: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		this.searchForm.forEach((item) => {
			if (item.dictUrl) {
				commonRequest(item.dictUrl).then((res) => {
					// TODO 缺少res.code判断
					// if(){}
					item.options = res.rows;
				});
			}
		});
	},
	watch: {},
	data() {
		return {
			fileList: [],
			dialogImageUrl: '',
			dialogVisible: false,
		};
	},
	methods: {
		handleSuccess(file) {
			this.$emit('uploadImg', file);
		},
		onExceedLimit(file) {
			this.$emit('onExceedLimits', file);
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.form {
	width: 100%;
	padding: 0 20px;
	.btn-wrap {
		text-align: center;
	}
	.btn-items {
		display: inline-block;
		margin: 0;
		::v-deep .el-form-item__content {
			// margin-left: 0px !important;
		}
	}
}
</style>
