export default {
  initialState: {
    title: "文章管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "Article",
      getProps: ["rts"]
    }
  ]
};
