export default {
  initialState: {
    title: "商品管理详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '商品管理',
        url: '/#/Good/GoodManagement'
      }
    ]
  },
  component: [
    {
      module: "GoodManagementDetail",
      getProps: ["rts"]
    }
  ]
};
