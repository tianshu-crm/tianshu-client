export const searchFormConfig = {
	colLayout: {
		xl: 4, //>1920px 一行四个
		lg: 6,
		md: 12,
		sm: 24,
		xs: 24,
	},
	showSearch: true,
	closeBtn: '重置',
	closeBtnIcon: 'el-icon-refresh',
	saveBtn: '搜索',
	saveBtnIcon: 'el-icon-search',
	formItems: [
		{
			field: 'nickName',
			type: 'input',
			label: '员工姓名',
			rules: [],
			placeholder: '请输入员工姓名',
		},
		{
			field: 'phoneNumber',
			type: 'input',
			label: '手机号',
			rules: [],
			placeholder: '请输入手机号',
		},
		{
			field: 'companyName',
			type: 'input',
			label: '公司名称',
			rules: [],
			placeholder: '请输入公司名称',
		},
		{
			field: 'filialeName',
			type: 'input',
			label: '分公司名称',
			rules: [],
			placeholder: '请输入分公司名称',
		},
		{
			field: 'deptName',
			type: 'input',
			label: '部门',
			rules: [],
			placeholder: '请输入部门',
		},
		{
			field: 'positionName',
			type: 'input',
			label: '岗位',
			rules: [],
			placeholder: '请输入岗位',
		},
	],
};
