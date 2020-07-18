import { withStyles } from "@material-ui/core/styles";
import { Button, Card, Col, Form, Icon, Input, message, Row, Select, Spin } from "antd";
import "antd/dist/antd.css";
import axios from "axios/index";
import React from "react";
import applicationAPI from "../../../../resources/applicationAPI";
import { getApi } from "../../../ApiContent";

const styles = theme => ({
  layoutRoot: {}
});

const FormItem = Form.Item;

class UserCreation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchText: "",
      selectedRole: "",
      newUsername: "",
      newPassword: "",
      selectedEmployee: "",
      locationArray: [],
      selectedLocations: [],
      updateRoleId: null,
      isAdmin: false,
      isChef: false,
      isCustomer: false,
      isGuest: false,
    };
    this.getUserRoles();
  }


  getUserRoles = async () => {
    this.setState({ loading: true });
    const response = await getApi(applicationAPI.getUserRoles, null);
    if (response.data.success) {
      this.setState({
        userRoleObjAr: response.data.permissionNames,
        loading: false
      });
    } else {
      this.setState({ loading: false });
    }
  };

  createUser = (newUser) =>
    new Promise(function (resolve, reject) {
      var url1 = window.authServer + "/user/createUser";
      const request = axios.post(url1, {
        newUser: newUser,
      });
      request
        .then(response => {
          if (!response.error && response.data.success) {
            resolve({ success: true });
          } else {
            reject(new Error("response error"));
          }
        })
        .catch(error => {
          reject(error);
        });
    });


  handleTextChange = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleSaveClick = async () => {
    if (
      this.state.selectedRole === "" ||
      this.state.newUsername === "" ||
      this.state.newPassword === ""
    ) {
      return;
    } else {
      this.setState({ loading: true });
      let newUser = {
        ID_EMPLOYEE_REGISTRY: this.state.selectedEmployee,
        USERNAME: this.state.newUsername,
        PASSWORD: this.state.newPassword,
        ID_AUTH_ROLE: this.state.selectedRole,
        IS_ACTIVE: 1
      };

      try {
        const result = await this.createUser(
          newUser,
        );
        message.success("New User Successfully Created");
        this.setState({
          selectedRole: "",
          newUsername: "",
          newPassword: "",
          selectedEmployee: "",
          selectedLocations: []
        });
        this.getServerData();
      } catch (error) {
        console.log("handleSaveClick error", error);
        message.warning("New user Creating Failed");
      }
    }
    this.setState({ loading: false });
  };

  handleClearClick = () => {
    this.setState({
      newUsername: "",
      newPassword: "",
      selectedRole: "",
      selectedEmployee: "",
      selectedLocations: [],
      selectedRole: "",

    });
  };

  roleChange = async (e) => {
    this.setState({
      selectedRole: e
    })

    if (e === 1) {
      this.setState({
        isAdmin: true,
        isCustomer: false,
        isChef: false,
        isGuest: false,
        isDeliveryPerson: false,
      })
    } else if (e === 2) {
      const response = await getApi(applicationAPI.getCustomers, null);
      if (response.data.success) {

        this.setState({
          customerObjAr: response.data.result,

        });
      } else {

      }

      this.setState({
        isCustomer: true,
        isChef: false,
        isGuest: false,
        isDeliveryPerson: false,
        isAdmin: false
      })
    } else if (e === 3) {
      const response = await getApi(applicationAPI.getChefs, null);
      if (response.data.success) {

        this.setState({
          chefObjAr: response.data.result,

        });
      } else {
      }

      this.setState({
        isChef: true,
        isGuest: false,
        isDeliveryPerson: false,
        isCustomer: false,
        isAdmin: false
      })
    } else if (e === 4) {

      const response = await getApi(applicationAPI.getDeliveryPersons, null);
      if (response.data.success) {

        this.setState({
          deliveryPersonObjAr: response.data.result,

        });
      } else {
      }

      this.setState({
        isGuest: true,
        isDeliveryPerson: false,
        isChef: false,
        isCustomer: false,
        isAdmin: false
      })
    } else if (e === 5) {
      const response = await getApi(applicationAPI.getDeliveryPersons, null);
      if (response.data.success) {

        this.setState({
          deliveryPersonObjAr: response.data.result,

        });
      } else {
      }

      this.setState({
        isDeliveryPerson: true,
        isGuest: false,
        isChef: false,
        isCustomer: false,
        isAdmin: false
      })
    }
  }

  handleChange = (e) => {
    this.setState({
      selectedEmployee: e
    })
  }



  render() {
    const {
      visible,
      onCancel,
      onCreate,
      form,
      loading,
      assetCodeOptions,
      formStatus,
      data
    } = this.props;

    // const { getFieldDecorator } = this.props.form;

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

    const Option = Select.Option;


    if (this.state.loading) {
      return (
        <Spin
          tip="Loading..."
          size="large"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100px",
            height: "100px",
            "margin-top": "-20px" /* Half the height */,
            "margin-left": "-20px"
          }}
        />
      );
    } else {
      return (
        <div className="w-full p-20">

          <h2>User Creation</h2>

          <div className="my=-6">
            {/*  <Divider>New User</Divider> */}
            <div style={{ background: "#ECECEC", padding: "30px" }}>
              <Form onSubmit={this.handleSubmit} layout="vertical" >
                <Card title="New User" bordered={false} className="w-full">
                  <Row gutter={24}>
                    <Col span={6}>
                      {/* Select Role      
                                    

                           <Select style={{ width: 120 }} value={this.state.selectedRole} onChange={this.handleRoleChange}>
                                        {this.state.roles && this.state.roles.map(role => (
                                            <Option value={role.ID_AUTH_ROLE}>{role.ROLE_NAME}</Option>
                                        ))
                                        }
                                    </Select> */}

                      <FormItem label="Select Roles ">

                        <Select
                          style={{ width: "100%" }}
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Select Role "
                          onChange={this.roleChange}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          disabled={formStatus == "view"}
                        >
                          {this.state.userRoleObjAr && this.state.userRoleObjAr.map(role => (
                            <Option value={role.ID_AUTH_ROLE}>{role.ROLE_NAME}</Option>))}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={8} style={{ display: this.state.isCustomer == true ? "block" : "none" }}>

                      <FormItem label="Select Customer">
                        <Select
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select Customer "
                          onChange={this.handleChange}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          disabled={formStatus == "view"}
                        >
                          {this.state.customerObjAr && this.state.customerObjAr.map(customer => (
                            <Option value={customer.ID_CUSTOMER}>{customer.NAME}</Option>))}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={8} style={{ display: this.state.isChef == true ? "block" : "none" }}>
                      <FormItem label="Select Chef">
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Select Chef"
                          onChange={this.handleChange}

                        >
                          {this.state.chefObjAr && this.state.chefObjAr.map(chef => (
                            <Option value={chef.ID_CHEF}>{chef.NAME}</Option>))}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={8} style={{ display: this.state.isDeliveryPerson == true ? "block" : "none" }}>
                      <FormItem label="Select Delivery Person">
                        <Select

                          style={{ width: "100%" }}
                          placeholder="Select Delivery Person"
                          onChange={this.handleChange}

                        >
                          {this.state.deliveryPersonObjAr && this.state.deliveryPersonObjAr.map(deliveryPerson => (
                            <Option value={deliveryPerson.ID_DELIVERY_PERSON}>{deliveryPerson.NAME}</Option>))}
                        </Select>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={5}>
                      <FormItem label="Username">
                        <Input
                          disabled={formStatus == "view"}
                          value={this.state.newUsername}
                          onChange={this.handleTextChange("newUsername")}
                          placeholder="Username"
                        />
                      </FormItem>
                    </Col>
                    <Col span={5}>
                      <FormItem label="Password">
                        <Input
                          disabled={formStatus == "view"}
                          type="password"
                          placeholder="Password"
                          value={this.state.newPassword}
                          onChange={this.handleTextChange("newPassword")}
                        />
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={18} />
                    <Col span={6}>
                      <Button
                        style={{ backgroundColor: "#03A89E	", color: "white" }}
                        onClick={this.handleSaveClick}
                      >
                        Add User <Icon type="primary" theme="outlined" />
                      </Button>
                      <Button
                        style={{
                          marginLeft: "2%",
                          backgroundColor: "#ACA39E",
                          color: "white"
                        }}
                        onClick={this.handleClearClick}
                      >
                        Clear <Icon type="user-add" theme="outlined" />
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Form>
            </div>
          </div>
        </div >
      );
    }
  }
}

export default withStyles(styles, { withTheme: true })(UserCreation);
