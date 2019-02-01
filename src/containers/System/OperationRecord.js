export default {
  initialState: {
    title: "操作记录",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "OperationRecord",
      getProps: ["rts"]
    }
  ]
};