export default {
  initialState: {
    title: "补货批次",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "GetBatch",
      getProps: ["rts"]
    }
  ]
};
