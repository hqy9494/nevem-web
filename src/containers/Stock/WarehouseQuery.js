export default {
  initialState: {
    title: "仓库查询",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "WarehouseQuery",
      getProps: ["rts"]
    }
  ]
};
