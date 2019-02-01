export default {
  initialState: {
    title: "商品价格",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "ProductPrice",
      getProps: ["rts"]
    }
  ]
};
