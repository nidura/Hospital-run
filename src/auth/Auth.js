import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as userActions from 'auth/store/actions';
import {bindActionCreators} from 'redux';
import * as Actions from 'store/actions';
import firebaseService from 'firebaseService';
import auth0Service from 'auth0Service';
import * as authActions from 'auth/store/actions';
import axios from 'axios';
import {message} from 'antd';


class Auth extends Component {

    constructor(props){
        super(props);

        axios.interceptors.response.eject(0);

        axios.interceptors.response.use(function (response) {
            console.log('response interceptor', response);
            return response;
        }, function (error) {
//            console.log('response interceptor error', error.response.status);
            if(error.response && error.response.status && error.response.status==401){
                // message.warning('Unauthorized');
                console.log('logging out');
                props.logout();
            }
            return Promise.reject(error);
        });   
    }

    componentDidMount()
    {
        

        /**
         * Login with Auth0
         */
        this.auth0Check();

        /**
         * Login with Firebase
         */
        this.firebaseCheck();
    }

    auth0Check = () => {

        if ( auth0Service.isAuthenticated() )
        {
            this.props.showMessage({message: 'Logging in with Auth0'});

            /**
             * Retrieve user data from Auth0
             */
            auth0Service.getUserData().then(tokenData => {

                this.props.setUserDataAuth0(tokenData);

                this.props.showMessage({message: 'Logged in with Auth0'});
            })
        }
    };

    firebaseCheck = () => {
        if ( !firebaseService.auth )
        {
            return;
        }

        firebaseService.auth.onAuthStateChanged(authUser => {
            if ( authUser )
            {
                this.props.showMessage({message: 'Logging in with Firebase'});

                /**
                 * Retrieve user data from Firebase
                 */
                firebaseService.getUserData(authUser.uid).then(user => {

                    this.props.setUserDataFirebase(user, authUser);

                    this.props.showMessage({message: 'Logged in with Firebase'});
                })
            }
        });
    };

    render()
    {
        const {children} = this.props;

        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
            logout          : authActions.logoutUser,
            setUserDataAuth0   : userActions.setUserDataAuth0,
            setUserDataFirebase: userActions.setUserDataFirebase,
            showMessage        : Actions.showMessage,
            hideMessage        : Actions.hideMessage
        },
        dispatch);
}

export default connect(null, mapDispatchToProps)(Auth);
