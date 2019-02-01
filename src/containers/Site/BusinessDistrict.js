export default {
  initialState: {
    title: "场地商圈",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "BusinessDistrict",
      getProps: ["rts"]
    }
  ]
};

