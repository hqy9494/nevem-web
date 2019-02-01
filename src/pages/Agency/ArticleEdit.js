import React from "react";
import uuid from "uuid";
import configURL from "../../config";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { getParameterByName } from "../../utils/utils";
import { getRegular } from '../../components/CheckInput';
import DetailTemplate from "../../components/DetailTemplate";
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { ImageUtils } from 'braft-finder'
import { Panel } from 'react-bootstrap';

import { Form, Input, InputNumber, Icon, Select, Table, Button, AutoComplete, Upload, Modal, message } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class ArticleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      actionName: '',
      actionUrl: '',
      startValue: null,
      endValue: null,
      endOpen: false,
      defaultDetail: {},
      defaultList: [],
      currentId: '',
      imageUrl: [],
      guides: {},
      editorState: BraftEditor.createEditorState(null),
      rolesData: [],
      imageString: '',
      previewImage: '',
      previewVisible: false,
    };
    this.uuid = uuid.v1();
    this.reg = getRegular('http-url');
    this.params = getParameterByName("q")
      ? JSON.parse(decodeURI(getParameterByName("q")))
      : {};
    this.fetchNum = 0
  }

  componentWillMount() {
  }
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id

    this.getRoles()

    if (id && id !== 'add') this.getGuides(id)
  }
  componentWillReceiveProps(nextProps) { 
    const { getGuides, getRoles } = nextProps
    if (getRoles && getRoles[this.uuid]) {
      this.setState({
        rolesData: getRoles[this.uuid],
      })
    }
    if (getGuides && getGuides[this.uuid]) {
      const data = getGuides[this.uuid]
      if (this.fetchNum === 0) {
        this.setState({
          guides: data,
          imageUrl: data.logo ? [{
            uid: -1,
            name: '1.png',
            status: 'done',
            url: data.logo,
            thumbUrl: data.logo
          }] : [],
        })
        this.props.form.setFieldsValue({
          content: BraftEditor.createEditorState(data.content)
        })
      }

      this.fetchNum = 1
    }
  }

  getRoles = () => {
    this.props.rts({
      method: 'get',
      url: `/accounts/roles`
    }, this.uuid, 'getRoles')
  }

  getGuides = (id) => {
    this.props.rts({
      method: 'get',
      url: `/Guides/${id}`
    }, this.uuid, 'getGuides')
  }

  postGuides = params => {
    const { match } = this.props
    const { id } = match.params
    
    this.props.rts({
      url: id === 'add' ? '/Guides' : `/Guides/${id}`,
      method: id === 'add' ? 'post' : 'put',
      data: params
    }, this.uuid, 'postGuides', () => {
      message.success('修改成功', 1, () => {
        this.props.goBack()
      })
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { match } = this.props
    const { id } = match.params

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {};

        for (let i of Object.keys(values)) {
          if (values[i] == null) continue

          if (i === 'logo') {
            if (values[i]['file']) {
              params[i] = values[i]['file'] && values[i]['file']['response'] && values[i]['file']['response'].url
            } else {
              params[i] = values[i][0]['url']
            }
            continue
          }
          if(i === 'content') {
            params[i] = values[i].toHTML()
            continue
          }
          params[i] = values[i]
        }
    
        if(id) this.postGuides(params)
      }
    });
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  handleChange = (name, { fileList }) => this.setState({ [name]: fileList })

  handleSelectChange = (v) => {
    console.log(v, 157)
  }

  uploadHandler = (param) => {

    if (!param.file) {
      return false
    }

    const editorState = this.props.form.getFieldValue('content')
    this.props.form.setFieldsValue({
      'content': ContentUtils.insertMedias(editorState, [{
        type: 'IMAGE',
        url: param.file.response && param.file.response.url
      }])
    })

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { actionName, guides, rolesData, editorState } = this.state;

    const controls = ['undo', 'redo', 'bold', 'italic', 'underline', 'text-color', 'separator']

    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            name="file"
            accept="image/*"
            showUploadList={false}
            headers={{
              Authorization: localStorage.token
            }}
            action={`${configURL.apiUrl}${configURL.apiBasePath}/upload/image`}
            onChange={this.uploadHandler}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type="button" className="control-item button upload-button" data-title="插入图片">
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        )
      }
    ]

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const uploadButton = (
      <div>
        <Icon type="upload" /> 添加
      </div>
    )

    const child = (
      <Form onSubmit={this.handleSubmit}>
        <Panel>
          <FormItem
            {...formItemLayout}
            label="大标题"
          >
            {getFieldDecorator('title', {
              rules: [{
                required: true,
                message: '请输入标题'
              }],
              initialValue: guides && guides.title || ''
            })(
              <Input size="large" placeholder="请输入标题" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="文章正文">
            {getFieldDecorator('content', {
              validateTrigger: 'onBlur',
              rules: [{
                required: true,
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入正文内容')
                  } else {
                    callback()
                  }
                }
              }],
              initialValue: guides && guides.content && BraftEditor.createEditorState(guides.content) || editorState
            })(
              <BraftEditor
                className="my-editor"
                controls={controls}
                placeholder="请输入正文内容"
                extendControls={extendControls}
              />
            )}
          </FormItem>
        </Panel>
        <Panel>
          <FormItem
            {...formItemLayout}
            label="文章作者:"
          >
            {getFieldDecorator('author', {
              rules: [{
                required: true,
                message: '请输入文章作者'
              }],
              initialValue: guides && guides.author || ''
            })(
              <Input placeholder="请输入文章作者" />
            )}
          </FormItem>
          <FormItem
            label={`封面LOGO:`}
            {...formItemLayout}
          >
            {getFieldDecorator(`logo`, {
              rules: [{ message: '请上传图片', required: true }],
              initialValue: this.state.imageUrl || []
            })(
              <Upload
                name="file"
                action={`${configURL.apiUrl}${configURL.apiBasePath}/upload/image`}
                listType="picture-card"
                headers={{
                  Authorization: localStorage.token
                }}
                onPreview={this.handlePreview}
                onChange={(fileList) => {
                  this.handleChange('imageUrl', fileList)
                }}
                accept="image/*"
                fileList={this.state.imageUrl || []}
              >
                {this.state.imageUrl.length === 1 ? null : uploadButton}
              </Upload>
            )}
          </FormItem>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
          <FormItem
            {...formItemLayout}
            label="小标题"
          >
            {getFieldDecorator('subtitle', {
              rules: [{
                required: true,
                message: '请输入小标题'
              }],
              initialValue: guides && guides.subtitle || ''
            })(
              <Input placeholder="请输入小标题" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="排序:"
          >
            {getFieldDecorator('sequence', {
              rules: [{
                required: true,
                message: '请输入排序'
              }],
              initialValue: guides && guides.sequence || 1
            })(
              <InputNumber min={0} style={{width: '100%' }}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="分类"
          >
            {getFieldDecorator('roleIds', {
              rules: [{
                required: true,
                message: '请输入分类!'
              }],
              initialValue: guides && guides.roles && guides.roles.map(v => v.id) || []
            })(
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请输入分类"
                onChange={(v) => {this.handleSelectChange(v)}}
              >
                {
                  rolesData && rolesData.length > 0 ? rolesData.map((v, i) => {
                    return <Option key={v && v.id} value={v && v.id}>{v && v.name}</Option>
                  }) : null
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button onClick={() => { this.props.goBack() }}>
              返回
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit">确定</Button>
          </FormItem>
        </Panel>
      </Form>
    )

    return (
      <section className="articleEdit-page">
        <DetailTemplate
          config={this.props.config}
          title={actionName || this.props.title}
          child={child}
          removeAllButton
        />
      </section>
    )
  }


}

const mapDispatchToProps = dispatch => {
  return {};
};

const ArticleEditForm = Form.create()(ArticleEdit);

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getRoles: state => state.get("rts").get("getRoles"),
  getGuides: state => state.get("rts").get("getGuides"),
  postGuides: state => state.get("rts").get("postGuides"),

});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleEditForm);
