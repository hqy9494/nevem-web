export default {
  initialState: {
    title: "菜单详情",
    subtitle: "",
    breadcrumb: [{
	    name: '菜单管理',
	    url: '/#/Setting/MenuManager'
	  }]
  },
  component: [
    {
      module: "MenuManagerAdd",
      getProps: ["rts"]
    }
  ]
};
