export default {
  initialState: {
    title: "货道模板",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "CargoTemplate",
      getProps: ["rts"]
    }
  ]
};
