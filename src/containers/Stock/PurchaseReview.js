export default {
  initialState: {
    title: "仓库审核",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "PurchaseReview",
      getProps: ["rts"]
    }
  ]
};
