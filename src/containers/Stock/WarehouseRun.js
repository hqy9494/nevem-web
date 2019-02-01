export default {
  initialState: {
    title: "库存流水",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "WarehouseRun",
      getProps: ["rts"]
    }
  ]
};
