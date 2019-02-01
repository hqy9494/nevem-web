export default {
  initialState: {
    title: "日志管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "Logs",
      getProps: ["rts"]
    }
  ]
};
