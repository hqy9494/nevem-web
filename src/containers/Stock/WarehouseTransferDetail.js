export default {
  initialState: {
    title: "仓库调拨",
    subtitle: "",
    breadcrumb: [
      {
        name: '仓库调拨信息详情',
        url: '/#/Stock/WarehouseTransfer'
      }
    ]
  },
  component: [
    {
      module: "WarehouseTransferDetail",
      getProps: ["rts"]
    }
  ]
};
