export default {
  initialState: {
    title: "故障管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "EquipmentFailure",
      getProps: ["rts"]
    }
  ]
};