export default {
  initialState: {
    title: "仓库进货",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "WarehousePurchase",
      getProps: ["rts"]
    }
  ]
};
