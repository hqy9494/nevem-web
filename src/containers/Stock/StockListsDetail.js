export default {
  initialState: {
    title: "仓库列表信息详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '仓库列表信息',
        url: '/#/Stock/StockLists'
      }
    ]
  },
  component: [
    {
      module: "StockListsDetail",
      getProps: ["rts"]
    }
  ]
};
