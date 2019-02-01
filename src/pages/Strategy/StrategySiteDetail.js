import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Form, Input, Card, Button, Select, Cascader } from "antd";
import moment from "moment";
import uuid from "uuid";
const Option = Select.Option
const FormItem = Form.Item

export class StrategySiteDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areaData: [],
      landMarksData: [],
      industriesData: [],
      address: [],
      industriesIndex: ''
    };
    this.uuid = uuid.v1();
    this.areaObj = {}
  }

  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id
    this.getArea()
    this.getIndustries()
    if (id !== 'add') this.getPlace(id)
  }
  componentWillReceiveProps(nextProps) {
    const { getArea, getIndustries, getLandMarks, getPlace } = nextProps

    if (getArea && getArea[this.uuid]) {
      this.setState({
        areaData: getArea[this.uuid],
      })
    }

    if (getIndustries && getIndustries[this.uuid]) {
      this.setState({
        industriesData: getIndustries[this.uuid].data,
      })
    }

    if (getLandMarks && getLandMarks[this.uuid]) {
      this.setState({
        landMarksData: getLandMarks[this.uuid].data,
      })
    }

    if (getPlace && getPlace[this.uuid]) {
      this.setState({
        placeData: getPlace[this.uuid],
      })
    }
  }

  getPlace = id => {
    this.props.rts({
      method: 'get',
      url: `/Places/${id}`
    }, this.uuid, 'getPlace', data => {
      this.getLandMarks({
        where: {
          id: data.landMarkId
        }
      })
    })
  }
  getArea = () => {
    this.props.rts({
      method: 'get',
      url: '/tools/getAreaData'
    }, this.uuid, 'getArea')
  }

  getIndustries = params => {
    this.props.rts({
      method: 'get',
      url: '/Industries',
      params: {
        filter: {
          where: {
            parentId: params
          }
        }
      }
    }, this.uuid, 'getIndustries')
  }
  getLandMarks = filter => {
    this.props.rts({
      method: 'get',
      url: '/LandMarks',
      params: {
        filter
      }
    }, this.uuid, 'getLandMarks')
  }
  handleArea = (areaData) => {
    let res = []

    areaData.forEach(v => {
      const child = {
        label: v.name,
        value: v.id,
      }
      this.areaObj[v.name] = v.id
      if (v.child.length > 0) child.children = this.handleArea(v.child)

      res.push(child)
    })

    return res
  }
  handleChange = id => {
    // console.log(id, 'change')
    this.setState({
      industriesIndex: id
    }, () => {
      this.props.form.setFieldsValue({
        'industryId': '',
      })
    })
  }
  handleSubmit = (e) => {
    const { match } = this.props
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { address } = this.state
        let params = {}

        if (values.industryId) params.industryId = values.industryId
        if (values.landMarkId) params.landMarkId = values.landMarkId
        if (values.name) params.name = values.name
        if (values.subject) params.subject = values.subject

        if (address[0]) params.province = address[0].label
        if (address[1]) params.city = address[1].label
        if (address[2]) params.district = address[2].label

        this.postPlaces(params)
      }
    })
  }
  handlePlace = placeData => {
    const params = {}
    if (!placeData) return

    if (placeData.industryId) {
      params.industryId = placeData.industryId
      params.industryParentId = placeData.industryParentId
    }
    if (placeData.landMarkId) params.landMarkId = placeData.landMarkId
    if (placeData.name) params.name = placeData.name
    if (placeData.subject) params.subject = placeData.subject
    if (placeData.province && placeData.city && placeData.district) params.residence = [this.areaObj[placeData.province], this.areaObj[placeData.city], this.areaObj[placeData.district]]

    return params
  }
  postPlaces = params => {
    this.props.rts({
      method: 'post',
      url: '/Places',
      data: params
    }, this.uuid, 'postPlaces', () => {
      this.props.goBack()
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { areaData, industriesData, landMarksData, placeData, industriesIndex } = this.state
    const area = this.handleArea(areaData) || []
    const place = this.handlePlace(placeData)
    // console.log(place)
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    }
    const selectItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    }
    return (
      <section className="StrategySiteDetail-page">
        <div className="project-title">编辑场地</div>
        <Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleSubmit}>
          <Card title="基本配置">
            <FormItem
              {...formItemLayout}
              label="场地名称"
            >
              {getFieldDecorator('name', {
                rules: [{required: true, message: '请输入场地名称'}],
                initialValue: place && place.name || ''
              })(
                <Input placeholder="请输入场地名称"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="场地所有方（管理方）"
            >
              {getFieldDecorator('subject', {
                rules: [{required: true, message: '场地所有方（管理方）'}],
                initialValue: place && place.subject || ''
              })(
                <Input placeholder="请输入场地名称"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="场地所在地"
            >
              {getFieldDecorator('residence', {
                rules: [{ type: 'array', required: true, message: '请选择' }],
                initialValue: place && place.residence || []
              })(
                <Cascader
                  options={area}
                  placeholder="请选择"
                  onChange={(value, selectedOptions) => {
                    this.setState({
                      address: selectedOptions
                    }, () => {
                      let last = selectedOptions[selectedOptions.length - 1]
                      //console.log(last)
                      this.getLandMarks({
                        where: {
                          district: last ? last.label : ''
                        }
                      })
                    })
                  }}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="场地商圈"
              hasFeedback
            >
              {getFieldDecorator('landMarkId', {
                rules: [{ required: true, message: '请选择场地商圈' }],
                initialValue: place && place.landMarkId || ''
              })(
                <Select placeholder="请选择场地商圈">
                  {
                    landMarksData && landMarksData.map((v, i) => (
                      <Option value={v.id} key={i}>{v.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <Row>
              <Col span={11}>
                <FormItem
                  {...selectItemLayout}
                  label="行业分类"
                  hasFeedback
                >
                  {getFieldDecorator('industryId-1', {
                    rules: [{ required: true, message: '请选择行业分类' }],
                    initialValue: place && place.industryParentId || ''
                  })(
                    <Select
                      placeholder="请选择行业分类"
                      onChange={this.handleChange}
                    >
                      {
                        industriesData && industriesData.map((v, i) => (
                          !v.parentId && <Option value={v.id} key={i}>{v.name}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem
                  // label="行业分类"
                  hasFeedback
                >
                  {getFieldDecorator('industryId', {
                    rules: [{ required: true, message: '请选择行业分类' }],
                    initialValue: place && place.industryId || ''
                  })(
                    <Select placeholder="请选择行业分类">
                      {
                        industriesData && industriesData.filter(v => (industriesIndex || place && place.industryParentId) === v.parentId).map((v, i) => (
                          v.parentId && <Option value={v.id} key={i}>{v.name}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <div className="ta-c mt-20">
            <Button style={{ marginRight: 8 }} onClick={() => {
              this.props.goBack()
            }}>
              返回
            </Button>
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const StrategySiteDetailForm = Form.create()(StrategySiteDetail)

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getArea: state => state.get("rts").get("getArea"),
  getIndustries: state => state.get("rts").get("getIndustries"),
  getLandMarks: state => state.get("rts").get("getLandMarks"),
  getPlace: state => state.get("rts").get("getPlace"),
});

export default connect(mapStateToProps, mapDispatchToProps)(StrategySiteDetailForm);
