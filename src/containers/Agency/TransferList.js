export default {
  initialState: {
    title: "转移记录",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "TransferList",
      getProps: ["rts"]
    }
  ]
};
