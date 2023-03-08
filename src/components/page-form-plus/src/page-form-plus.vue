<!-- eslint-disable vue/require-v-for-key -->
<!-- eslint-disable vue/valid-v-for -->
<!-- eslint-disable vue/no-v-for-template-key -->
<!-- eslint-disable vue/no-mutating-props -->
<template>
	<div>
		<el-form
			class="plus-form"
			ref="refForm"
			:model="searchData"
			:rules="rules"
			:size="size"
			:label-width="labelWidth"
			:hide-required-asterisk="isShowRequired"
			:width="width"
			:label-position="labelPosition"
		>
			<template v-if="!isDetails">
				<template v-for="searchFormItem in searchForm">
					<div class="font17 mb15" style="font-weight: 700">{{ searchFormItem.itemName }}</div>
					<el-form-item
						v-for="item in searchFormItem.entityList"
						:label="item.label"
						:key="item.prop"
						:prop="item.prop"
						:label-width="labelWidth"
						class="formItem"
					>
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
							<el-option v-for="op in item.options" :label="op.dictLabel" :value="`${op.dictValue},${op.dictLabel}`" :key="op.dictValue"></el-option>
						</el-select>
						<!-- 单选 -->
						<el-radio-group v-if="item.type === 'radio'" v-model="searchData[item.prop]">
							<el-radio v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ ra.label }}</el-radio>
						</el-radio-group>
						<!-- 日期 -->
						<el-date-picker
							v-if="item.type === 'date'"
							v-model="searchData[item.prop]"
							value-format="yyyy-MM-dd"
							:placeholder="item.placeholder"
						></el-date-picker>
						<!-- 级联选择器 -->
						<el-cascader
							v-if="item.type === 'cascader'"
							v-model="searchData[item.prop]"
							:options="item.options"
							:props="item.props"
							@change="item.change(searchData[item.prop])"
							ref="cascader"
							:placeholder="item.placeholder"
						></el-cascader>
					</el-form-item>
				</template>
			</template>

			<!-- 详情状态 -->
			<template v-else>
				<div class="dept-details mb30">
					<template v-for="searchFormItem in searchForm">
						<div class="font14 mt15" v-for="item in searchFormItem.entityList" :key="item.prop">
							<span>{{ item.label }}:</span>
							<!-- 级联选择器 -->
							<el-cascader
								v-if="item.type === 'cascader'"
								v-model="searchData[item.prop]"
								:options="item.options"
								:props="item.props"
								@change="item.change(searchData[item.prop])"
								ref="cascader"
								disabled
								class="d-cascader"
							></el-cascader>
							<span v-else class="ml10">{{ searchData[item.prop] ? searchData[item.prop] : '暂无' }}</span>
						</div>
					</template>
				</div>
			</template>

			<!-- 按钮 -->
			<div v-if="isHandle && !isDetails" class="btn-wrap">
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
		labelPosition: {
			type: String,
			default: 'left',
		},
		//父组件传过来的是否为查看详情状态表示
		isDetails: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		this.searchForm.forEach((item) => {
			item.entityList.forEach((entity) => {
				if (entity.dictUrl) {
					commonRequest(entity.dictUrl).then((res) => {
						// TODO 缺少res.code判断
						// if(){}
						entity.options = res.rows;
					});
				}
			});
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
		// cascaderChange(e) {
		// 	console.log(this.$refs['cascader'][0].getCheckedNodes()[0].pathLabels);
		// 	if (e.length) {
		// 		this.$nextTick(() => {
		// 			// let checkedNodes = this.$refs['cascader'].getCheckedNodes()[0].pathLabels;
		// 			// console.log(checkedNodes)
		// 		});
		// 	}
		// },
		// searchDataChange(res) {
		// 	// this.searchData = JSON.parse(JSON.stringify(res));
		// 	console.log(this.searchData);
		// 	debugger;
		// },
	},
};
</script>

<style lang="scss" scoped>
.plus-form {
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
	.d-cascader {
		width: auto !important;
		::v-deep .el-input__inner {
			border: 0px !important;
			color: var(--prev-color-text-regular);
		}
		::v-deep .el-input.is-disabled .el-input__icon {
			display: none;
		}
	}
}
</style>
