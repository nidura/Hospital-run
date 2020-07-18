import { FuseAnimate } from '@fuse';
import { CardContent, Typography, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles/index';
import { Col, Row } from "antd";
import classNames from 'classnames';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import RegularLoginTab from './tabs/RegularLoginTab';

const styles = theme => ({
    root: {
        background: "url('/assets/images/backgrounds/coffee-1031526_1920.jpg') no-repeat",
        backgroundSize: 'cover'

    },
    intro: {
        color: '#ffffff'
    },
    card: {
        width: '100%',
        maxWidth: 400
    }
});

class Login extends Component {
    state = {
        tabValue: 0
    };

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

    render() {
        const { classes } = this.props;
        const { tabValue } = this.state;

        return (
            <div className={classNames(classes.root, "flex flex-col flex-1 flex-no-shrink p-24  md:p-0")}>

                <div
                    className={classNames(classes.intro, "flex flex-col flex-no-grow items-center p-16 text-center  md:flex-no-shrink  md:text-left")}>

                    <FuseAnimate animation="transition.expandIn">
                        <img className="w-128 mb-32" src="assets/images/logos/esoft_logo.png" alt="logo" />
                    </FuseAnimate>

                    <FuseAnimate animation="transition.slideUpIn" delay={300}>
                        <label className="mainLabel">
                            Hospital Run
                        </label>
                        {/* <Typography variant="display2" className="font-light" style={{ color: "red #important" }}>
                            XYZ Cafeteria
                        </Typography> */}
                    </FuseAnimate>


                </div>

                <FuseAnimate animation={{ translateX: [0, '100%'] }}>
                    <Row gutter={24}>
                        <Col span={10} offset={7}>
                            <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 ">

                                <Typography variant="title" className="text-center md:w-full mb-48" style={{ color: "lightyellow", }}>LOGIN TO YOUR ACCOUNT</Typography>

                                <RegularLoginTab />

                            </CardContent>
                        </Col>
                    </Row>
                </FuseAnimate>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(withRouter(Login));
