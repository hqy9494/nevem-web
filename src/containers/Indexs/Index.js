export default {
  initialState: {
    title: "主 页",
    // subTitle: [{ display: "主 页" }],
    selectedKeys: "index",
    openKeys: "index"
  },
  component: [
    {
      module: "Index",
      getProps: ["rts"]
    }
  ]
};
