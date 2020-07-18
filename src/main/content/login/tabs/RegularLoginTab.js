import React, { Component } from 'react';
import Formsy from 'formsy-react';
import { TextFieldFormsy } from '@fuse';
import { withStyles, Button, Divider, Typography, Checkbox } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import * as Actions from 'auth/store/actions';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

const styles = theme => ({
    root: {
        width: '100%'
    }
});

class RegularLoginTab extends Component {
    state = {
        canSubmit: false,
        isGuest: false
    };

    constructor(props) {
        super(props);
        this.props.clearStatus();
    }

    form = React.createRef();

    disableButton = () => {
        this.setState({ canSubmit: false });
    };

    enableButton = () => {
        this.setState({ canSubmit: true });
    };

    onSubmit = async (model) => {
        if (await this.state.isGuest) {
            model = {
                email: "guest",
                password: "Guest"
            }
        }
        this.props.setLoginStatusToProgress();
        this.props.submitLogin(model);
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.login.error && (this.props.login.error.email || this.props.login.error.password)) {
            this.form.updateInputsWithError({
                ...this.props.login.error
            });

            this.props.login.error = null;
            this.disableButton();
        }

        if (this.props.user.role !== 'guest') {
            const pathname = this.props.location.state && this.props.location.state.redirectUrl ? this.props.location.state.redirectUrl : '/';
            this.props.history.push({
                pathname
            });
        }
        return null;
    }
    onChange(e) {
        this.setState({
            isGuest: e.target.checked
        })
    }
    render() {
        const { classes } = this.props;
        const { canSubmit } = this.state;

        return (
            <div className={classes.root}>
                <label className="labelName">  <Checkbox onChange={this.onChange.bind(this)} /> Login as Guest</label>

                {/* <Checkbox onChange={this.onChange.bind(this)} >Checkbox</Checkbox> */}
                <Formsy
                    onValidSubmit={this.onSubmit}
                    onValid={this.enableButton}
                    onInvalid={this.disableButton}
                    ref={(form) => this.form = form}
                    className="flex flex-col justify-center w-full"
                >
                    <label className="labelName"> Username/Email</label>
                    <TextFieldFormsy
                        className="mb-16"
                        type="text"
                        name="email"

                        validations={{
                            minLength: 4
                        }}
                        validationErrors={{
                            minLength: 'Min character length is 4'
                        }}
                        required
                    />
                    <label className="labelName"> Password</label>
                    <TextFieldFormsy
                        className="mb-16"
                        type="password"
                        name="password"
                        // label="Password"
                        validations={{
                            minLength: 4
                        }}
                        validationErrors={{
                            minLength: 'Min character length is 4'
                        }}
                        required
                    />

                    {this.props.login.loginClicked ?
                        <div align="center" className="w-full">
                            Please Wait..
                    </div>
                        :
                        <div align="center" className="redText w-full">
                            {this.props.login.message && this.props.login.message}
                        </div>

                    }






                    <Button
                        type="submit"
                        variant="raised"
                        color="primary"
                        className="w-full mx-auto mt-16 normal-case"
                        aria-label="LOG IN"
                        disabled={!canSubmit || this.props.login.loginClicked}
                        value="legacy"
                    >
                        Login
                    </Button>
                </Formsy>

            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        submitLogin: Actions.submitLogin,
        clearStatus: Actions.clearStatus,
        setLoginStatusToProgress: Actions.setLoginStatusToProgress,
    }, dispatch);
}

function mapStateToProps({ auth }) {
    return {
        login: auth.login,
        user: auth.user
    }
}

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(RegularLoginTab)));
