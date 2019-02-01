import React from "react";
import classNames from "classnames";
import config from "../../config";
import {
  Form,
  Select,
  Button,
  Input,
  InputNumber,
  Upload,
  Icon,
  Modal
} from "antd";
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

class FormExpand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  submitNew = e => {
    e.preventDefault();
    const { elements = [] } = this.props;
    let pictureField = elements
      .filter(ele => ele.type === "picture")
      .map(pf => pf.field);

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let newValues = {};
        for (let key in values) {
          if (pictureField.indexOf(key) !== -1) {
            if (values[key] && values[key].length > 0) {
              newValues[key] = values[key].map(vk => vk.response.url);
            } else {
              newValues[key] = [];
            }
          } else {
            newValues[key] = values[key];
          }
        }
        this.props.onSubmit && this.props.onSubmit(newValues);
      }
    });
  };

  returnElement(ele) {
    switch (ele.type) {
      case "text":
        return <Input />;
      case "number":
        return <InputNumber />;
      case "textarea":
        return <TextArea rows={ele.rows || 4} />;
      case "select":
        return (
          <Select>
            {ele.options.map(o => (
              <Option key={o.value} value={o.value}>
                {o.title}
              </Option>
            ))}
          </Select>
        );
      case "checkbox":
        return <CheckboxGroup options={ele.options} />;
      case "radio":
        return (
          <RadioGroup>
            {ele.options.map(o => (
              <Radio key={o.value} value={o.value}>
                {o.title}
              </Radio>
            ))}
          </RadioGroup>
        );
      default:
        break;
    }
  }
  retrunPicture(ele) {
    const { getFieldDecorator } = this.props.form;

    return (
      <FormItem key={`item-${ele.field}`} {...formItemLayout} label={ele.label}>
        {getFieldDecorator(ele.field, {
          initialValue:
            ele.params && ele.params.initialValue
              ? ele.params.initialValue.map((v, i) => {
                  return {
                    uid: -1,
                    name: `幻灯片${i}`,
                    status: "done",
                    url: v
                  };
                })
              : "",
          valuePropName: "fileList",
          getValueFromEvent: this.normFile
        })(
          <Upload
            name="file"
            action={`${config.apiUrl}/upload/image`}
            headers={{ Authorization: localStorage.token }}
            listType="picture-card"
            onPreview={this.handlePreview}
            onChange={this.uploadChange}
          >
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">选择图片</div>
            </div>
          </Upload>
        )}
      </FormItem>
    );
  }

  uploadChange = info => {
    let fileList = info.fileList;
    if (fileList.length >= 3) {
      this.setState({
        upload: false
      });
    } else {
      this.setState({
        upload: true
      });
    }
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  normFile = e => {
//  console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { elements = [] } = this.props;

    return (
      <Form onSubmit={this.submitNew}>
        <div style={{ maxWidth: 750 }}>
          {(() => {
            return elements.map(ele => {
              if (ele.type !== "picture") {
                return (
                  <FormItem
                    key={`item-${ele.field}`}
                    {...formItemLayout}
                    label={ele.label}
                  >
                    {getFieldDecorator(ele.field, ele.params)(
                      this.returnElement(ele)
                    )}
                  </FormItem>
                );
              } else {
                return this.retrunPicture(ele);
              }
            });
          })()}
          <FormItem wrapperCol={{ span: 12, offset: 6 }}>
            <ButtonGroup>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button
                onClick={() => {
                  this.props.form.resetFields();
                  this.props.onCancel && this.props.onCancel();
                }}
              >取消</Button>
            </ButtonGroup>
          </FormItem>
        </div>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => {
            this.setState({ previewVisible: false });
          }}
        >
          <img
            alt="showImg"
            style={{ width: "100%" }}
            src={this.state.previewImage}
          />
        </Modal>
      </Form>
    );
  }
}

const WrappedFormExpand = Form.create()(FormExpand);

export default WrappedFormExpand;
