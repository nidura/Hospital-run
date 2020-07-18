import { withStyles } from '@material-ui/core/styles';
import { Button, Card, Checkbox, Col, Divider, Form, Icon, Input, InputNumber, message, Modal, Radio, Row, Select, Table, Tooltip, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { connect } from 'react-redux';
import applicationAPI from "../../../resources/applicationAPI";
import { getApi, postApi } from "../../ApiContent";
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const styles = theme => ({ layoutRoot: {} });

let tempAtt = [];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

const ChefForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: false,
      };

    }

    handleSubmit = e => {

      const form = this.props.form;

      form.validateFields(async (err, values) => {
        if (err) {
          return;
        } else {
          console.log("values from modal", values);
          this.setState({ loading: true });
          let chef = {
            NAME: values.chefName,
            TITLE: values.title,
            ADDRESS: values.email,
            CITY: values.city,
            NIC: values.nic,
            MOBILE: values.mobile,
            EMAIL: values.email,
          };
          try {
            const result = await postApi(applicationAPI.saveChef, chef);
            if (result.data.success) {
              message.success(result.data.message);
              this.props.form.resetFields();
              this.props.getChefs();
              this.props.onCreateModalClose();
            } else message.error(result.data.message);
          } catch (error) {
            message.error("Error Action Change");
          } finally {
            this.setState({
              loading: false,
            });
          }
        }
      });
    };

    render() {
      const {
        visible, onCancel, onCreate, form, loading, departmentOptions, designationOptions, locationOptions,
        editorState, onEditorStateChange, onClear, formStatus, data, handleSubmit, user, location } = this.props;
      const { getFieldDecorator } = this.props.form;

      const handleOk = e => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
          if (err) {
            console.log("values", values);
          }
        });
        this.props.onCreateModalClose();
      };

      const handleCancel = e => {
        this.props.form.resetFields();
        this.props.onCreateModalClose();
      };

      const handleReset = e => {
        this.props.form.resetFields();
        this.props.onCreateModalClose(); // added because of using image uploading array
      };


      return (
        <Modal
          visible={this.props.visible}
          title="Create Chef"
          //okText="Create"
          onCancel={handleCancel}
          width="50%"
          onOk={handleOk}
          maskClosable={false}
          footer={
            formStatus == "view"
              ? null
              : [
                <Button key="reset" type="danger" onClick={handleReset}>
                  Reset
                    </Button>,
                <Button
                  key="send"
                  type="primary"
                  disabled={this.state.isImageUploading}
                  loading={this.state.loading}
                  onClick={this.handleSubmit}
                >
                  Create
                    </Button>,
                <Button key="close" type="danger" onClick={handleCancel}>
                  Close
                    </Button>
              ]
          }
        >
          <Form onSubmit={this.handleSubmit} layout="vertical" className="customerForm">

            <Row gutter={24}>
              <Col span={24}>
                <FormItem

                  label="Title"
                >
                  {getFieldDecorator("title", {})(
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Select Title"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      disabled={formStatus == "view"}
                      onChange={this.onChangePostingCountry}
                    >
                      <Option value="Mr">Mr</Option>
                      <Option value="Mrs">Mrs</Option>
                      <Option value="Ms">Ms</Option>
                      <Option value="Miss">Miss</Option>
                      <Option value="Dr">Dr</Option>
                      <Option value="Professor">Professor</Option>
                      <Option value="Venerable">Venerable</Option>
                      <Option value="Company">Company</Option>
                      <Option value="Mx">Mx</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem

                  label="Chef Name"
                >
                  {getFieldDecorator("chefName", {
                    rules: [
                      { required: true, message: "Chef Name Required!" }
                    ]
                  })(<Input type="text" placeholder="Chef Name" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem

                  label="NIC"
                >
                  {getFieldDecorator("nic", {
                    rules: [
                      {
                        required: true,
                        message: "NIC Required!"
                      }
                    ]
                  })(<Input type="text" placeholder="NIC" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem

                  label="Contact Number"
                >
                  {getFieldDecorator("mobile", {
                    rules: [
                      {
                        required: true,
                        message: "Contact Number Required!"
                      }
                    ]
                  })(<Input type="text" placeholder="Contact Number" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem

                  label="Email"
                >
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        required: true,
                        message: "Email Required!"
                      }
                    ]
                  })(<Input type="email" placeholder="Email" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem

                  label="Address"
                >
                  {getFieldDecorator("address", {
                    rules: [
                      {
                        required: true,
                        message: "Address Required!"
                      }
                    ]
                  })(
                    <TextArea

                      placeholder="Address"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem

                  label="City"
                >
                  {getFieldDecorator("city", {
                    rules: [
                      {
                        required: true,
                        message: "City Required!"
                      }
                    ]
                  })(
                    <Input
                      placeholder="City"
                    />
                  )}
                </FormItem>

              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  }
);

export default ChefForm;