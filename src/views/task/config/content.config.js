export const contentTableConfig = {
	propList: [
		{
			prop: 'title',
			label: '任务标题',
		},
		{
			prop: 'createTime',
			label: '创建时间',
		},

		{
			label: '操作',
			// width: '120',
			slotName: 'handler',
			width: '200',
			fixed: 'right',
		},
	],
	//是否显示ID
	showIndexColumn: false,
	//是否显示全选勾选
	showSelectColumn: false,
};
