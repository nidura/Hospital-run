import { withStyles } from "@material-ui/core/styles";
import { Button, Checkbox, Col, Form, Icon, Input, message, Modal, Row, Select, Spin, Table, Tree } from "antd";
import "antd/dist/antd.css";
import axios from "axios/index";
import _ from "lodash";
import React from "react";
import applicationAPI from "../../../../resources/applicationAPI";
import { getApi } from "../../../ApiContent";

const styles = theme => ({
  layoutRoot: {}
});

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

// rowSelection objects indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  }
};

class Roles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionTypes: [],
      selectedRole: undefined,
      data: [],
      modalVisible: false,
      confirmLoading: false,
      disableOk: true,
      roleName: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.traverseChildData = this.traverseChildData.bind(this);
    this.getServerData();
    // this.findObjectByLabel(data, "key" , 6 , false, {read:false, delete:false});
    // console.log('data', data);
  }

  getServerData = async () => {
    this.setState({ loading: true });
    try {
      const roles = await this.getUserRoles();
      const permissionTypes = await this.getPermissionTypes();
      this.setState({ roles: roles, permissionTypes: permissionTypes });

      console.log("roles", roles);
    } catch (error) {
      message.warning("Failed to Fetch Data From Server");
      console.log("getServerData error", error);
    } finally {
      this.setState({ loading: false });
    }
  };



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

  // getAllRoles = () =>
  //   new Promise(function(resolve, reject) {
  //     var url1 = window.authServer + "/roles/getAllRolesWithInactive";
  //     const request = axios.get(url1);
  //     request
  //       .then(response => {
  //         if (!response.error && response.data.success) {
  //           resolve(response.data.permissionNames);
  //         } else {
  //           reject(new Error("response error"));
  //         }
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });

  getPermissionOfRole = roleId =>
    new Promise(function (resolve, reject) {
      var url1 = window.authServer + "/permission/getPermissionsByRole";
      const request = axios.post(url1, { role: roleId });
      request
        .then(response => {
          if (!response.error && response.data.success) {
            resolve({
              permissions: response.data.permissions,
              IS_ACTIVE: response.data.IS_ACTIVE
            });
          } else {
            reject(new Error("response error"));
          }
        })
        .catch(error => {
          reject(error);
        });
    });

  getPermissionTypes = () =>
    new Promise(function (resolve, reject) {
      var url1 = window.authServer + "/permission/getPermissionTypes";
      const request = axios.get(url1);
      request
        .then(response => {
          if (!response.error && response.data.success) {
            resolve(response.data.permissionTypes);
          } else {
            reject(new Error("response error"));
          }
        })
        .catch(error => {
          reject(error);
        });
    });

  savePermissions = (saveData, roleId) =>
    new Promise(function (resolve, reject) {
      var url1 = window.authServer + "/permission/savePermissionsOfRole";
      const request = axios.post(url1, { saveData: saveData, roleId: roleId });
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

  columns = [
    {
      title: "Permission",
      dataIndex: "permission",
      key: "permission",
      width: "40%"
    },
    {
      title: "Read",
      dataIndex: "read",
      key: "read",
      width: "10%",
      render: (c, value, r) => (
        <Checkbox
          checked={value.read}
          onChange={this.onPermissionCheckChange("read", value, r, c)}
        ></Checkbox>
      )
    },
    {
      title: "Create",
      dataIndex: "create",
      width: "10%",
      key: "create",
      render: (c, value, r) => (
        <Checkbox
          checked={value.write}
          onChange={this.onPermissionCheckChange("write", value, r, c)}
        ></Checkbox>
      )
    },
    {
      title: "Update",
      dataIndex: "update",
      width: "10%",
      key: "update",
      render: (c, value, r) => (
        <Checkbox
          checked={value.update}
          onChange={this.onPermissionCheckChange("update", value, r, c)}
        ></Checkbox>
      )
    },
    {
      title: "Delete",
      dataIndex: "delete",
      width: "10%",
      key: "delete",
      render: (c, value, r) => (
        <Checkbox
          checked={value.delete}
          onChange={this.onPermissionCheckChange("delete", value, r, c)}
        ></Checkbox>
      )
    },
    {
      title: "Draft",
      dataIndex: "draft",
      width: "10%",
      key: "draft",
      render: (c, value, r) => (
        <Checkbox
          checked={value.draft}
          onChange={this.onPermissionCheckChange("draft", value, r, c)}
        ></Checkbox>
      )
    },
    {
      title: "Print",
      dataIndex: "print",
      width: "10%",
      key: "print",
      render: (c, value, r) => (
        <Checkbox
          checked={value.print}
          onChange={this.onPermissionCheckChange("print", value, r, c)}
        ></Checkbox>
      )
    }
  ];

  onPermissionCheckChange = (type, value, r, c) => e => {
    console.log("type", type);
    console.log("value", value);
    console.log("r", r);
    console.log("c", c);
    console.log("e", e);

    var props = {};
    props[type] = e.target.checked;
    // let dataCopy =  Object.assign({}, this.state.data);
    var cloneOfData = [...this.state.data];
    this.setPermissionData(cloneOfData, "key", value.key, false, props);
    console.log("state.data", this.state.data);
    this.setState({ data: cloneOfData }, () => {
      console.log("this.state.data", this.state.data);
    });

    console.log("dataCopy", cloneOfData);
  };

  setPermissionData = function (
    obj,
    label,
    value,
    setValue,
    propertiesToAppend
  ) {
    let childUpdated = false;
    if (obj === null || typeof obj !== "object") {
      return null;
    }
    if (obj[label] === value) {
      setValue = true;
    }
    if (obj.constructor !== Array && setValue) {
      //obj.set= true;
      console.log(
        "settingPermissionData",
        propertiesToAppend,
        label,
        value,
        setValue
      );
      for (var property in propertiesToAppend) {
        if (propertiesToAppend.hasOwnProperty(property)) {
          childUpdated = true;
          obj[property] = propertiesToAppend[property];
        }
      }

      //obj = Object.assign(propertiesToAppend, obj);
    }

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        var updateParentToo = this.setPermissionData(
          obj[i],
          label,
          value,
          setValue,
          propertiesToAppend
        );
        if (updateParentToo) {
          for (var property in propertiesToAppend) {
            if (propertiesToAppend.hasOwnProperty(property)) {
              if (propertiesToAppend[property] == false) {
                childUpdated = true;
                obj[property] = propertiesToAppend[property];
              }
            }
          }
        }
      }
    }

    if (childUpdated) {
      return true;
    } else {
      return null;
    }
  };

  async handleChange(value) {
    this.setState({ loading: true, selectedRole: value });
    const result = await this.getPermissionOfRole(value);
    const permissionsOfRole = result.permissions;
    const IS_ACTIVE = result.IS_ACTIVE;

    this.setState({ currentRoleAactiveStatus: IS_ACTIVE });
    console.log("permissionsOfRole", permissionsOfRole);

    //grouping crud permissions by url
    let groupedPermissions = {};
    permissionsOfRole.forEach(function (permission) {
      if (groupedPermissions[permission.PERMISSION_URL]) {
        groupedPermissions[permission.PERMISSION_URL].permissionName =
          permission.PERMISSION_NAME;
        groupedPermissions[permission.PERMISSION_URL].permissionId =
          permission.ID_PERMISSION;
        if (permission.HAS_PERMISSION !== null) {
          groupedPermissions[permission.PERMISSION_URL].permissionTypes.push(
            permission.PERMISSION_TYPE
          );
        } else {
          groupedPermissions[permission.PERMISSION_URL].nonPermissionTypes.push(
            permission.PERMISSION_TYPE
          );
        }
      } else {
        groupedPermissions[permission.PERMISSION_URL] = {
          permissionName: permission.PERMISSION_NAME,
          permissionId: permission.ID_PERMISSION,
          permissionTypes: [],
          nonPermissionTypes: []
        };
        if (permission.HAS_PERMISSION !== null) {
          groupedPermissions[permission.PERMISSION_URL].permissionTypes.push(
            permission.PERMISSION_TYPE
          );
        } else {
          groupedPermissions[permission.PERMISSION_URL].nonPermissionTypes.push(
            permission.PERMISSION_TYPE
          );
        }
      }
    });

    console.log("groupedPermissions", groupedPermissions);

    //create table data
    let topRoots = [];
    let currentRoot = "";

    let key = 1;

    for (var aPermission in groupedPermissions) {
      if (groupedPermissions.hasOwnProperty(aPermission)) {
        var pathSections = aPermission.split("/").filter(function (el) {
          return el.length != 0;
        });

        addChild(topRoots, pathSections, groupedPermissions[aPermission]);
      }
    }

    this.setState({ data: topRoots, loading: false });

    function addChild(
      parentArray,
      pathSectionArray,
      data,
      superParentToAdd = null
    ) {
      console.log("data recived", data);
      if (pathSectionArray.length == 0 && superParentToAdd) {
        data.permissionTypes.forEach(function (element) {
          superParentToAdd[_.lowerCase(element)] = true;
        });
        data.nonPermissionTypes.forEach(function (element) {
          superParentToAdd[_.lowerCase(element)] = false;
        });
        superParentToAdd.permissionId = data.permissionId;
        return null;
      }
      let pathFoundInParentArray = false;
      parentArray.forEach(function (aParent) {
        if (aParent.permission === pathSectionArray[0]) {
          pathSectionArray.shift();
          return addChild(aParent.children, pathSectionArray, data);
        }
      });

      if (pathSectionArray[0]) {
        key += 1;
        parentArray.push({
          key: key,
          permission: pathSectionArray[0],
          read: false,
          write: false,
          delete: false,
          update: false,
          draft: false,
          children: []
        });
        pathSectionArray.shift();
        return addChild(
          parentArray[parentArray.length - 1].children,
          pathSectionArray,
          data,
          parentArray[parentArray.length - 1]
        );
      }

      return null;
    }

    console.log("topRoots", topRoots);
  }

  handleSaveClick = async () => {
    if (!this.state.selectedRole) {
      return;
    }
    this.setState({ loading: true });

    var saveData = [];
    var permissionTypes = this.state.permissionTypes;
    var roleId = this.state.selectedRole;

    this.traverseChildData(this.state.data, saveData, permissionTypes, roleId);

    console.log("saveData", saveData);

    try {
      const saveResponse = await this.savePermissions(saveData, roleId);
      if (saveResponse.success) {
        console.log("saved");
        message.success("Permissions Successfully Saved");
      }
    } catch (error) {
      message.error("Permissions Saving Failed");
      console.log("error", error);
    }

    this.setState({ loading: false });
  };

  handleCreateRoleClick = () => {
    this.setState({
      modalVisible: true
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCreate = async () => {
    this.setState({
      confirmLoading: true
    });

    try {
      const response = await axios.post(
        window.authServer + "/roles/createRole",
        { role: { ROLE_NAME: this.state.roleName, IS_ACTIVE: 1 } }
      );
      this.setState({
        modalVisible: false,
        confirmLoading: false
      });
      if (response.data.success) {
        message.success("Role Successfully Saved");
      } else {
        message.error("Role Save Failed");
      }
      await this.getServerData();
    } catch (error) {
      message.error("Role Save Failed");
      this.setState({ confirmLoading: false });
    }
  };

  handleToggleActiveClick = async () => {
    if (!this.state.selectedRole) {
      return;
    }
    this.setState({ loading: true });
    try {
      const response = await axios.post(
        window.authServer + "/roles/toggleRoleInactive",
        {
          role: this.state.selectedRole,
          status: this.state.currentRoleAactiveStatus
        }
      );
      if (!response.data.success) {
        message.warning("Role Status Changing Failed");
      }
      await this.getServerData();
      let newStatus = 0;
      if (this.state.currentRoleAactiveStatus == 0) {
        newStatus = 1;
      }
      message.success("Role Status Changed Successfully");
      this.setState({ currentRoleAactiveStatus: newStatus });
    } catch (error) {
      message.warning("Role Status Changing Failed");

      console.log("error, toggle active status", error);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleModalClose = () => {
    this.setState({
      modalVisible: false
    });
  };

  handleTextChange = name => e => {
    this.setState({ [name]: e.target.value });
    if (e.target.value != "") {
      this.setState({ disableOk: false });
    } else {
      this.setState({ disableOk: true });
    }
  };

  traverseChildData = (parentArray, saveData, permissionTypes, roleId) => {
    console.log("traverse parent array", JSON.stringify(parentArray));
    parentArray.forEach(parent => {
      console.log("traverse parent element", JSON.stringify(parent));

      if (parent.children.length === 0) {
        permissionTypes.forEach(permissionType => {
          console.log(
            "traverse permissionTypes",
            JSON.stringify(permissionTypes)
          );
          let saveItem = {
            ID_PERMISSION: parent.permissionId,
            ID_AUTH_ROLE: roleId,
            IS_ACTIVE: 1
          };
          if (parent[_.lowerCase(permissionType.PERMISSION_TYPE)] === true) {
            saveItem.ID_PERMISSION_TYPE = permissionType.ID_PERMISSION_TYPE;
            saveData.push(saveItem);
          }
          console.log("traverse permissionTypes finidhed-------------");
        });

        return null;
      }
      console.log("traverse parent element finished-----------");

      return this.traverseChildData(
        parent.children,
        saveData,
        permissionTypes,
        roleId
      );
    });
  };

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
        ></Spin>
      );
    } else {
      return (
        <div className="w-full">
          <div className="m-16">
            <Row gutter={24}>
              <Col span={6}>
                <FormItem label="Select Role">
                  <Select
                    style={{ width: "100%" }}
                    value={this.state.selectedRole && this.state.selectedRole}
                    onChange={this.handleChange}
                    placeholder="Select Role"
                  >
                    {this.state.userRoleObjAr && this.state.userRoleObjAr.map(role => (
                      <Option value={role.ID_AUTH_ROLE}>{role.ROLE_NAME}</Option>))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={18}>
                <Button
                  style={{
                    marginTop: "5%",
                    backgroundColor: "#03A89E	",
                    color: "white"
                  }}
                  onClick={this.handleCreateRoleClick}
                >
                  Create Role
                  <Icon type="solution" />
                </Button>

                <Button
                  style={{ marginLeft: "2%", marginTop: "5%" }}
                  type="primary"
                  disabled={this.state.selectedRole == "" ? true : false}
                  onClick={this.handleToggleActiveClick}
                >
                  {this.state.currentRoleAactiveStatus === 1
                    ? "Set Inactive"
                    : "Set Active"}
                  <Icon type="save" />
                </Button>

                <Button
                  style={{ marginLeft: "2%", marginTop: "5%" }}
                  type="primary"
                  onClick={this.handleSaveClick}
                >
                  Save
                  <Icon type="save" />
                </Button>
              </Col>
            </Row>

            <Modal
              title="Create New Role"
              visible={this.state.modalVisible}
              onOk={this.handleCreate}
              okButtonProps={{ disabled: this.state.disableOk }}
              confirmLoading={this.state.confirmLoading}
              onCancel={this.handleModalClose}
            >
              <div className="w-1/4">
                Role
                <Input
                  value={this.state.roleName}
                  onChange={this.handleTextChange("roleName")}
                />
              </div>
            </Modal>
          </div>

          <Table
            columns={this.columns}
            defaultExpandAllRows="true"
            /* rowSelection={rowSelection} */ dataSource={this.state.data}
            scroll={{ y: 600 }}
          />
        </div>
      );
    }
  }
}

export default withStyles(styles, { withTheme: true })(Roles);
