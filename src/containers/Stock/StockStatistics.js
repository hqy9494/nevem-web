export default {
  initialState: {
    title: "库存统计",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StockStatistics",
      getProps: ["rts"]
    }
  ]
};
