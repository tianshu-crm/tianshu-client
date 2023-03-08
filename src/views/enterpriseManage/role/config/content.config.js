export const contentTableConfig = {
	propList: [
		{
			prop: 'roleName',
			label: '角色名称',
		},
		{
			prop: 'roleDes',
			label: '角色描述',
		},
		{
			prop: 'status',
			label: '状态',
			slotName: 'status',
		},
		{
			prop: 'createTime',
			label: '创建时间',
		},
		{
			label: '操作',
			slotName: 'handler',
			width: '200',
			fixed: 'right',
		},
	],
	//是否显示ID
	showIndexColumn: true,
	//是否显示全选勾选
	showSelectColumn: false,
};
