import { withStyles } from '@material-ui/core/styles/index';
import classNames from 'classnames';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FuseAnimate } from '@fuse';

const styles = theme => ({
  root: {
    background: "url('/assets/images/backgrounds/strawberry.jpg') no-repeat",
    backgroundSize: 'cover'

  },

});

class Dashboard extends Component {
  state = {
    tabValue: 0
  };

  // handleTabChange = (event, value) => {
  //     this.setState({ tabValue: value });
  // };

  render() {
    const { classes } = this.props;
    const { tabValue } = this.state;

    return (
      <div className={classNames(classes.root, "flex flex-col flex-1 flex-no-shrink p-24  md:p-0")}>

        <div
          className={classNames(classes.intro, "flex flex-col flex-no-grow items-center p-16 text-center  md:flex-no-shrink  md:text-left")}>
          <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <label className="dashboardLabel">
              "Some minds are like soup in a poor restaurant better left unstirred."
                        </label>

          </FuseAnimate>
          <span>
            <span><FuseAnimate animation={{ translateX: [0, '100%'] }} delay={900} >
              <img src="assets/images/cards/pancakes.jpg" alt="pancake" className="mainImg" />
            </FuseAnimate>
            </span>
            <span>
              <FuseAnimate animation={{ translateX: [0, '100%'] }} delay={1900} >
                <img src="assets/images/cards/hamburger.jpg" alt="pancake" className="mainImg" />
              </FuseAnimate>
            </span>
          </span>
        </div>

      </div >
    )
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(Dashboard));
