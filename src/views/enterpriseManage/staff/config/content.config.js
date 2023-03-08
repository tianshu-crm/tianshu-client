export const contentTableConfig = {
	propList: [
		{
			prop: 'userName',
			label: '账号',
		},
		{
			prop: 'nickName',
			label: '姓名',
		},
		{
			prop: 'phoneNumber',
			label: '手机号',
			width: '120',
		},
		{
			prop: 'sex',
			label: '性别',
		},
		{
			prop: 'age',
			label: '年龄',
		},
		{
			prop: 'cityName',
			label: '城市',
		},
		{
			prop: 'companyName',
			label: '公司',
		},
		{
			prop: 'filialeName',
			label: '分公司',
		},
		{
			prop: 'deptName',
			label: '部门',
		},
		{
			prop: 'positionName',
			label: '岗位',
		},
		{
			prop: 'roleName',
			label: '角色',
		},
		{
			prop: 'status',
			label: '账号状态',
			slotName: 'status',
		},
		{
			prop: 'createTime',
			label: '创建时间',
			width: '170',
		},
		{
			label: '操作',
			slotName: 'handler',
			width: '260',
			// width: '200',
			fixed: 'right',
		},
	],
	//是否显示ID
	showIndexColumn: false,
	//是否显示全选勾选
	showSelectColumn: true,
};
