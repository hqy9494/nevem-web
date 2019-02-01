export default {
  initialState: {
    title: "账单流水",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "BillFlow",
      getProps: ["rts"]
    }
  ]
};
