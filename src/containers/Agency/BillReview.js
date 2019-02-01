export default {
  initialState: {
    title: "账单审核",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "BillReview",
      getProps: ["rts"]
    }
  ]
};
