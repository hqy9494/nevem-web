export default {
  initialState: {
    title: "库存调拨",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "WarehouseTransfer",
      getProps: ["rts"]
    }
  ]
};
