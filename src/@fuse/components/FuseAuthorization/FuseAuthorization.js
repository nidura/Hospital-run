import React, { Component } from 'react';
import { matchRoutes } from 'react-router-config';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { setUserData, setUserDataOnly } from 'auth/store/actions/user.actions';
import { setNavigation } from 'store/actions/fuse/navigation.actions';
import store from 'store';
import axios from 'axios';


let redirect = false;

class FuseAuthorization extends Component {
  constructor(props) {
    super(props);
    this.checkAuth();
  }

  componentDidUpdate(prevProps) {
    /**
         * If route is changed
         * Update auths
         */
    if (!_.isEqual(this.props.location.pathname, prevProps.location.pathname)) {
      this.checkAuth();
    }
  }

  checkAuth() {
    const userData = sessionStorage.getItem('h2biz_18_userData');
    const userDataJson = JSON.parse(String(userData));
    const navigationConfig = sessionStorage.getItem('h2biz_18_navigationConfig');
    // //console.log('navigationConfig', navigationConfig);
    const navigationConfigJson = JSON.parse(String(navigationConfig));


    if (userData && navigationConfig) {
      // console.log('userDataJson', userDataJson);
      // console.log('navigationConfigJson', navigationConfigJson);
    }

    const matched = matchRoutes(this.props.routes, this.props.location.pathname)[0];
    // //console.log('this.props.location.pathname', this.props.location.pathname);
    // //console.log('this.props.user.extraPrivileges', this.props.user.extraPrivileges);
    // const hasExtraPrivilage =( -1 !== this.props.user.extraPrivileges.indexOf(this.props.location.pathname));
    // const hasReducedPrivilage =( -1 !== this.props.user.reducedPriviledges.indexOf(this.props.location.pathname));
    // //console.log('hasExtraPrivilage', hasExtraPrivilage);


    // const hasHasPathPermission =( -1 !== this.props.user.reducedPriviledges.indexOf(this.props.location.pathname));

    // console.log('this.props.user.userPermission', this.props.user.userPermission);
    // console.log('this.props.location.pathname', this.props.location.pathname);
    // console.log('matched', matched);
    // console.log('this.props.routes', this.props.routes);

    if (matched && matched.route.auth /* && matched.route.auth.length > 0 && this.props.location.pathname!="/login" */) {
      // console.log('this.props.user.userPermission', this.props.user.userPermission);
      // console.log('this.props.location.pathname', this.props.location.pathname);
      // console.log('this.props.user', this.props.user);
      // if (hasReducedPrivilage || (!matched.route.auth.includes(this.props.user.role) && !hasExtraPrivilage))

      let loadFromSession = false;
      if (this.props.user.role === 'guest' && userDataJson && userDataJson.role !== 'guest') {
        // console.log('LOAD FROM SESSION');

        /* (dispatch) =>{
                    dispatch(setUserData(userDataJson));
                    dispatch(setNavigation(navigationConfigJson));
                } */


        /* this.props.history.push({
                    pathname: this.props.location.pathname
                }); */

        loadFromSession = true;
      }

      if (loadFromSession && userDataJson.userPermission[this.props.location.pathname] && userDataJson.userPermission[this.props.location.pathname].length > 0) {
        // console.log('Aquired user data from session');

        const requestInterceptor = axios.interceptors.request.use((config) => {
          config.headers = { Authorization: userDataJson.token };

          return config;
        }, error => Promise.reject(error));

        // console.log('requestInterceptor from session storage',requestInterceptor);

        store.dispatch(setUserData(userDataJson));
        store.dispatch(setNavigation(navigationConfigJson));
      } else if (!this.props.user.userPermission[this.props.location.pathname] || this.props.user.userPermission[this.props.location.pathname].length == 0) {
        // console.log('Not loading from session, lets see user prop and location ',this.props.user, this.props.location.pathname);

        redirect = true;
        /* this.props.history.push({
                    pathname: '/login',
                    state   : {redirectUrl: this.props.location.pathname}
                }); */
        if (this.props.user.role === 'guest') {
          this.props.history.push({
            pathname: '/login',
            state: { redirectUrl: this.props.location.pathname },
          });
        } else {
          this.props.history.push({
            pathname: '/',
          });
        }
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (redirect) {
      redirect = false;
      return false;
    }

    return true;
  }

  render() {
    const { children } = this.props;

    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

function mapStateToProps({ fuse, auth }) {
  return {
    user: auth.user,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FuseAuthorization));
