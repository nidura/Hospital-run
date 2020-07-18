import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple, DemoContent } from '@fuse';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Tree, Table, Spin, Divider, Card } from 'antd';
import axios from 'axios/index';
import { format } from 'path';
import _ from 'lodash';

const styles = theme => ({
    layoutRoot: {}
});


const FormItem = Form.Item;
class RoleCreation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            searchText: '',
            selectedRole: '',
            newUsername: '',
            newPassword: ''
        }

        this.handleRoleChange = this.handleRoleChange.bind(this);
        this.getServerData();

    }

    handleSearch = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = clearFilters => () => {
        clearFilters();
        this.setState({ searchText: '' });
    }


    getServerData = async () => {
        this.setState({ loading: true });
        try {
            const users = await this.getAllUsers();

            const roles = await this.getAllRoles();
            this.setState({ roles: roles });
            this.setState({ data: users, loading: false });
            console.log('users', users);
        } catch (error) {
            console.log('getServerData error', error);
        }
    }

    getAllRoles = () => new Promise(function (resolve, reject) {
        var url1 = window.authServer + "/roles/getAllRolesWithInactive";
        const request = axios.get(url1);
        request.then((response) => {
            if (!response.error && response.data.success) {
                resolve(response.data.roles);
            }
            else {
                reject(new Error('response error'));
            }
        })
            .catch(error => {
                reject(error);
            });
    });

    getAllUsers = () => new Promise(function (resolve, reject) {
        var url1 = window.authServer + "/user/getAllUsers";
        const request = axios.get(url1);
        request.then((response) => {
            if (!response.error && response.data.success) {
                resolve(response.data.users);
            }
            else {
                reject(new Error('response error'));
            }
        })
            .catch(error => {
                reject(error);
            });
    });

    getEmployees = () => new Promise(function (resolve, reject) {
        var url1 = window.hrmServer + "/commonAPI/getEmployeeProfileDetails";
        const request = axios.post(url1, { selectedEmpRegId: "0" });
        request.then((response) => {
            if (!response.error && response.data.success) {
                resolve(response.data.resultEmployeeProfileDetails);
            }
            else {
                reject(new Error('response error'));
            }
        })
            .catch(error => {
                reject(error);
            });
    });

    createUser = (newUser) => new Promise(function (resolve, reject) {
        var url1 = window.authServer + "/user/createUser";
        const request = axios.post(url1, { newUser: newUser });
        request.then((response) => {
            if (!response.error && response.data.success) {
                resolve({ success: true });
            }
            else {
                reject(new Error('response error'));
            }
        })
            .catch(error => {
                reject(error);
            });
    });

    changeUserStatus = (userId, currentStatus) => new Promise(function (resolve, reject) {
        var url1 = window.authServer + "/user/toggleUserActiveStatus";
        const request = axios.post(url1, { userId: userId, currentStatus: currentStatus });
        request.then((response) => {
            if (!response.error && response.data.success) {
                resolve({ success: true });
            }
            else {
                reject(new Error('response error'));
            }
        })
            .catch(error => {
                reject(error);
            });
    });

    onIsActiveChange = (value, r, c) => async (e) => {
        console.log('value', value);
        console.log('r', r);
        console.log('c', c);
        console.log('e', e);

        this.setState({ loading: true });
        try {
            const result = await this.changeUserStatus(value.ID_USER, c);
            if (result.success) {
                let tableData = [...this.state.data];
                tableData.forEach((element) => {
                    if (element.ID_USER === value.ID_USER) {
                        if (e.target.checked) {
                            element.IS_ACTIVE = 1;
                        } else {
                            element.IS_ACTIVE = 0;
                        }
                    }
                });
                this.setState({ data: tableData });
            }
        } catch (error) {

        }

        this.setState({ loading: false });


    };

    async handleRoleChange(value) {
        this.setState({ selectedRole: value });
    }

    handleTextChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    }

    handleSaveClick = async () => {
        if (this.state.selectedRole === '' || this.state.newUsername === '' || this.state.newPassword === '') {

        } else {
            this.setState({ loading: true });
            let newUser = {
                ID_EMPLOYEE_REGISTRY: null,
                USERNAME: this.state.newUsername,
                PASSWORD: this.state.newPassword,
                ID_AUTH_ROLE: this.state.selectedRole,
                IS_ACTIVE: 1,
            };
            try {
                const result = await this.createUser(newUser);
                this.getServerData();
            } catch (error) {

            }
        }
        this.setState({ loading: false });
    }


    render() {
        const { visible, onCancel, onCreate, form, loading, assetCodeOptions, formStatus, data } = this.props;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const Option = Select.Option;

        const columns = [{
            title: 'Username',
            dataIndex: 'USERNAME',
            key: 'USERNAME',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="Search name"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={this.handleSearch(selectedKeys, confirm)}
                    />
                    <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Search</Button>
                    <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
                </div>
            ),
            filterIcon: filtered => <Icon type="smile-o" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    });
                }
            },
            render: (text) => {
                const { searchText } = this.state;
                return searchText ? (
                    <span>
                        {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                            fragment.toLowerCase() === searchText.toLowerCase()
                                ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                        ))}
                    </span>
                ) : text;
            },
            sorter: (a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            }
        }, {
            title: 'Role',
            dataIndex: 'ROLE_NAME',
            key: 'ROLE_NAME',
        },
        {
            title: 'Active?',
            dataIndex: 'IS_ACTIVE',
            key: 'IS_ACTIVE',
            render: (c, value, r) => (
                <Checkbox checked={value.IS_ACTIVE} onChange={this.onIsActiveChange(value, r, c)}></Checkbox>
            )
        },];

        if (this.state.loading) {
            return (
                <Spin tip="Loading..." size="large"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100px',
                        height: '100px',
                        'margin-top': '-20px', /* Half the height */
                        'margin-left': '-20px'
                    }}
                >
                </Spin>
            );
        }
        else {

            return (
                <div>


                    <h2>RoleCreation</h2>

                    <div className="my=-6">

                        {/*  <Divider>New User</Divider> */}

                        <div style={{ background: '#ECECEC', padding: '30px' }}>
                            <Card title="New User" bordered={false} className="w-full">


                                <Row gutter={24}>
                                    <Col span={6}>
                                        <FormItem

                                            label="Select Role"
                                        >

                                            <Select style={{width:"100%"}} value={this.state.selectedRole} onChange={this.handleRoleChange}>
                                                {this.state.roles && this.state.roles.map(role => (
                                                    <Option value={role.ID_AUTH_ROLE}>{role.ROLE_NAME}</Option>
                                                ))
                                                }
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem

                                            label="Username"
                                        >
                                            <Input value={this.state.newUsername} onChange={this.handleTextChange('newUsername')} />
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem

                                            label="Password"
                                        >

                                            <Input type="password" value={this.state.newPassword} onChange={this.handleTextChange('newPassword')} />
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{marginTop:'3%'}}>
                                        <FormItem

                                        >

                                            <Button style={{backgroundColor:'#03A89E	',color:'white'}} onClick={this.handleSaveClick}>
                                                Add User <Icon type="user-add" theme="outlined" />
                                            </Button>
                                        </FormItem>
                                    </Col>
                                </Row>


                                {/* <div className="mx-16 w-1/4">
                                    Select Role      
                                    <Select style={{ width: 120 }} value={this.state.selectedRole} onChange={this.handleRoleChange}>
                                        {this.state.roles && this.state.roles.map(role => (
                                            <Option value={role.ID_AUTH_ROLE}>{role.ROLE_NAME}</Option>
                                        ))
                                        }
                                    </Select>
                                </div> */}

                                {/* <div className="w-1/4">
                                    Username
                                    <Input value={this.state.newUsername} onChange={this.handleTextChange('newUsername')} />
                                </div> */}
                                {/* <div className="w-1/4">
                                    Password
                                    <Input type="password" value={this.state.newPassword} onChange={this.handleTextChange('newPassword')} />
                                </div>

                                <div className="w-1/4">
                                    <Button className="m-20" type="primary" onClick={this.handleSaveClick}>
                                        Add User <Icon type="user-add" theme="outlined" />
                                    </Button>
                                </div> */}
                            </Card>
                        </div>




                    </div>

                    <Divider>Users of Application</Divider>

                    <Table columns={columns} bordered dataSource={this.state.data} />

                </div>
            )
        }
    }


}

export default withStyles(styles, { withTheme: true })(RoleCreation);