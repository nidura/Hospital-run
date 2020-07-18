import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple, DemoContent } from '@fuse';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Tree, Table, Spin, Divider, Card, message } from 'antd';
import axios from 'axios/index';
import { getAllUsers } from '../../../CommonAPIs';
import { getAllRoles } from '../../../CommonAPIs';
import { format } from 'path';
import _ from 'lodash';
import {connect} from 'react-redux';
import UserProfileForm from './UserProfileForm'


const styles = theme => ({
    layoutRoot: {}
});

const FormItem = Form.Item;

class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }


    }

    fetchData = () => {

    }

    setLoading = (val) =>{
        this.setState({loading:val});
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
                <div className="w-full p-20">


                    <h2>User Profile</h2>

                    <strong>Your role is {this.props.user.role}</strong>
                    
                    <div>You can change your password below</div>

                    <UserProfileForm userId={this.props.user.userId} setLoading={this.setLoading}/>
                </div>
            )
        }
    }




}

function mapStateToProps({fuse, auth})
{
    return {
        user: auth.user
    }
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(UserProfile));