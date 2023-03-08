export const contentTableConfig = {
	propList: [
		{
			prop: 'title',
			label: '标题',
			slotName: 'title',
			width: '',
		},
		{
			prop: 'sendTime',
			label: '消息时间',
			slotName: 'sendTime',
            width:''
		},
		{
			prop: 'type',
			label: '类型',
			slotName: 'type',
            width:''
		},

		// {
		// 	label: '操作',
		// 	// width: '120',
		// 	slotName: 'handler',
		// 	width: '200',
		// 	fixed: 'right',
		// },
	],
	//是否显示ID
	showIndexColumn: false,
	//是否显示全选勾选
	showSelectColumn: false,
};
