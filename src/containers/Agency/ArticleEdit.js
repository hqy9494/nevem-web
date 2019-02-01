export default {
  initialState: {
    title: "文章编辑",
    subtitle: "",
    breadcrumb: [{
      name: '文章管理',
      url: '/#/Agency/Article'
    }]
  },
  component: [
    {
      module: "ArticleEdit",
      getProps: ["rts"]
    }
  ]
};
