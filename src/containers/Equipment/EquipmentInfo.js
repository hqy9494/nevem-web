export default {
  initialState: {
    title: "配置信息",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "EquipmentInfo",
      getProps: ["rts"]
    }
  ]
};
