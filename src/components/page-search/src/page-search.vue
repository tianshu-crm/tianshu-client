<template>
	<div class="page-search" style="">
		<el-form size="small" :inline="true" v-show="searchFormConfig.showSearch" label-width="">
			<template v-for="item in searchFormConfig.formItems">
				<el-form-item :label="item.label">
					<template v-if="item.type === 'input' || item.type === 'password'">
						<el-input :placeholder="item.placeholder" :show-password="item.type === 'password'" v-model="formData[`${item.field}`]" />
					</template>
					<template v-if="item.type === 'datepicker'">
						<el-date-picker
							:clearable="false"
							v-bind="item.otherOptions"
							v-model="formData[`${item.field}`]"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
						/>
					</template>
					<template v-else-if="item.type === 'select'">
						<el-select
							:placeholder="item.placeholder"
							@change="changeFun"
							v-bind="item.otherOptions"
							style="width: 100%"
							v-model="formData[`${item.field}`]"
						>
							<el-option
								v-for="option in item.options"
								:value="option[item.labelAndValue.value]"
								:label="option[item.labelAndValue.label]"
								:key="option[item.labelAndValue.value]"
								>{{ option[item.labelAndValue.label] }}</el-option
							>
						</el-select>
					</template>
				</el-form-item>
			</template>

			<div class="footer">
				<el-button class="bg-primary" type="primary" size="small" @click="handleQueryClick">查询</el-button>
				<el-button plain size="small" @click="handleReaetClick">清空</el-button>
			</div>
		</el-form>
		<div class="footer">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script>
import { commonRequest } from '@/api/common/index';
const constLabldAndValue = {
	label: 'label',
	value: 'value',
};

export default {
	props: {
		searchFormConfig: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			formData: {
				resetFlag: true,
			},
			colLayout: {
				xl: 4, //>1920px 一行四个
				lg: 8,
				md: 12,
				sm: 24,
				xs: 24,
			},
		};
	},
	components: {},
	created() {
		if (this.searchFormConfig && Array.isArray(this.searchFormConfig.formItems)) {
			this.searchFormConfig.formItems.forEach((item) => {
				item.labelAndValue = item.labelAndValue ?? JSON.parse(JSON.stringify(constLabldAndValue));
				if (item.type == 'select' && item.dictUrl) {
					commonRequest(item.dictUrl).then((res) => {
						if (res.code == 200 && Array.isArray(res.data)) {
							item.options = res.data;
						}
					});
				}
			});
		}
	},
	methods: {
		changeFun() {
			// console.log(this.formData);
			// console.log(res);
			// debugger;
		},

		handleReaetClick() {
			for (let key in this.formData) {
				if (Array.isArray(this.formData[key])) {
					this.formData[key] = [];
				} else {
					this.formData[key] = '';
				}
			}
			this.formData.resetFlag = true;
			this.$emit('searchQuery', this.formData);
		},
		handleQueryClick() {
			// console.log(this.formData);
			this.formData.resetFlag = false;
			this.$emit('searchQuery', this.formData);
		},
	},
};
</script>

<style scoped lang="scss">
.page-search {
	display: flex;
	flex-wrap: wrap;
	align-content: space-between;
	justify-content: space-between;
	.footer {
		display: inline-block;
	}
	.color-primary {
		color: #fff;
	}
	.el-form-item {
		margin-bottom: 10px;
	}
}
.el-date-editor--daterange.el-input__inner {
	width: 220px;
}
</style>
