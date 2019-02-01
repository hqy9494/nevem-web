export default {
  initialState: {
    title: "仓库列表",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StockLists",
      getProps: ["rts"]
    }
  ]
};
