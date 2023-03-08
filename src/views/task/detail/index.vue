<template>
	<div class="news-body" v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(255, 255, 255, 0.8)">
		<div class="header flex">
			<div class="userName marginRight10"><i class="el-icon-user-solid"></i>{{ form.sponsorUserName }}</div>
			<div class="group">{{ form.affiliatedUnit }}</div>
			<div class="ml30">{{ form.sponsorTime }}</div>
		</div>
		<div class="main-title flex-space-between">
			<div class="font16 fw700">线索详情</div>
			<el-button type="text" @click="routerPushClueDetail">查看详情</el-button>
		</div>
		<div class="user-content" v-if="form.taskDetail">
			<div class="marginBottom10">
				<div class="flex">
					<div class="userName">{{ form.taskDetail.name }}</div>
					<div class="marginLeft10 marginRight10">
						<el-tag>{{ form.taskDetail.orgLevel ? form.taskDetail.orgLevel : '暂无' }}</el-tag>
						<el-tag type="success" class="ml15 mr15">{{ form.taskDetail.businessType ? form.taskDetail.businessType : '暂无' }}</el-tag>
						<el-tag type="warning">{{ form.taskDetail.nature ? form.taskDetail.nature : '暂无' }}</el-tag>
					</div>
				</div>
			</div>
			<el-form :model="ruleForm">
				<div class="flex-warp mt15">
					<span>性别：{{ form.taskDetail.sex }}</span>
					<span class="ml25">手机号码：{{ form.taskDetail.phonenumber }}</span>
					<span class="ml25">微信号:{{ form.taskDetail.wechat }}</span>
					<span class="ml25">年龄:{{ form.taskDetail.age }}</span>
				</div>
				<div class="mt20 mb20" v-if="this.form.taskBusinessType != '1'">
					<div class="mb10 font16 fw700">调整后级别</div>
					<el-tag type="form">{{ form.taskDetail.level }}</el-tag>
				</div>
				<div class="mt20 mb20">
					<div class="mb10 font16 fw700">{{ this.form.taskBusinessType != '1' ? '调整' : '战败' }}原因</div>
					<div>{{ form.taskDetail.reason }}</div>
				</div>
				<div class="mt20 mb30">
					<div class="mb10 font16 fw700">审批内容</div>
					<div>{{ form.title }}</div>
				</div>
				<div class="mt30 mb20" v-if="form.approvalStatus == '2'">
					<div class="mb10 font16 fw700">审批留言</div>
					<el-form-item>
						<el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="ruleForm.approvalLeaveMsg"> </el-input>
					</el-form-item>
				</div>
			</el-form>
		</div>
		<div class="mt30" style="text-align: center" v-if="form.approvalStatus == '2'">
			<!-- approval_status  1已审批 2 未审批 3 已驳回 4 不需要审批 -->
			<el-button size="small" type="primary" @click="handleApproval('1')">同意</el-button>
			<el-button size="small" plain @click="handleApproval('2')">驳回</el-button>
		</div>
		<div class="img-status flex-end">
			<img v-if="form.approvalStatus == '1'" src="@/assets/img/pass.png" alt="" />
			<img v-if="form.approvalStatus == '3'" src="@/assets/img/fail.png" alt="" />
		</div>
	</div>
</template>
<script>
import { taskdetail, audit } from '@/api/task';
import { deepCopy } from '@/utils/index.js';
export default {
	data() {
		return {
			ruleForm: {
				approvalLeaveMsg: '',
			},
			form: {},
			loading: false,
			defaultForm: {},
		};
	},
	mounted() {},
	methods: {
		setValue(form = {}) {
			this.form = deepCopy(form);
		},
		// 重置清空
		reset() {
			this.form = deepCopy(this.defaultForm);
		},
		// 获取详情信息
		getTaskdetail(taskId) {
			this.loading = true;
			taskdetail(taskId)
				.then((res) => {
					this.$nextTick(() => {
						this.reset();
						this.setValue(res.data);
					});
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 点击同意或驳回
		handleApproval(approvalStatus) {
			let params = {
				taskId: this.taskId,
				approvalStatus: approvalStatus,
				approvalLeaveMsg: this.ruleForm.approvalLeaveMsg,
			};
			audit(params).then((res) => {
				if (res.code === 200) {
					this.$message.success(res.msg);
					this.$emit('drawerClose', false);
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 跳转线索详情
		routerPushClueDetail() {
			this.$router.push({
				path: '/clue/clueDetail',
				query: {
					customerId: this.form.taskDetail.customerId,
				},
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.news-body {
	padding: 30px;
	box-sizing: border-box;
	.main-title {
		margin-top: 20px;
	}
	.fw700 {
		font-weight: 700;
	}
	.img-status {
		width: 100%;
		img {
			width: 100px;
		}
	}
}
</style>
