import React, { Component } from 'react';
import Amplify, { Auth, Storage, API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { NavbarBrand, Navbar, Nav, NavItem, NavLink } from 'reactstrap';
import Home from './home';
import Upload from './upload';
import Browse from './browse';
import Settings from './settings';
import Result from './result';
import Tools from './tools';
declare var media_analysis_config;

global.user = {};

Amplify.configure({
  Auth: {
    region: media_analysis_config.SOLUTION_REGION,
    userPoolId: media_analysis_config.SOLUTION_USERPOOLID,
    userPoolWebClientId: media_analysis_config.SOLUTION_USERPOOLWEBCLIENTID,
    identityPoolId: media_analysis_config.SOLUTION_IDENTITYPOOLID
  },
  Storage: {
        bucket: media_analysis_config.SOLUTION_BUCKET,
        region: media_analysis_config.SOLUTION_REGION,
        identityPoolId: media_analysis_config.SOLUTION_IDENTITYPOOLID
    },
  API: {
      endpoints: [
        {
            name: "MediaAnalysisApi",
            region: media_analysis_config.SOLUTION_REGION,
            endpoint: media_analysis_config.SOLUTION_ENDPOINT
        }
      ]
  }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showUpload: false,
      showSignout: false
    };
  }

  componentDidMount () {
    Auth.currentAuthenticatedUser()
        .then(
          data => {

            global.user = data

            //console.log(data);
            console.log("Apps states: " + data.attributes['custom:role']);

            // Show signout button
            this.setState(state => ({showSignout: true}));

            // Hide/show proper views based on rights
            switch (data.attributes['custom:role']) {
              case "student":
                this.setState(state => ({showUpload: true}));
                break;
              case "teacher":
                this.setState(state => ({showUpload: true}));
                break;
              case "admin":
                this.setState(state => ({showUpload: true}));
                break;
              default:
                break;
            };

            this.setState({ state: this.state })
          })
        .catch(
          err => { console.log(err);
            this.user = null;
          });
  }

  render() {
    // this.setUserRole();

    console.log("User: ");
    console.log(global.user);

    return (
      <div>
        <Router>
          <div>
            <Navbar color="dark">
              <NavbarBrand tag={Link} to="/browse"><img
                alt=""
                src="/assets/logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
              Homeschool medias</NavbarBrand>

              {global.user && (
              <Nav className="ml-auto">
                <NavItem color="white">
                  <NavLink tag={Link} to="/upload" className="text-light">Upload</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/settings" className="text-light ">user:{ global.user.username }</NavLink>
                </NavItem>
              </Nav>
              )}
            </Navbar>
            <hr />
            <Switch>
                <Route exact path='/' component={Browse} />
                <Route path='/home' component={Browse} />
                <Route path='/upload' component={Upload} />
                <Route path='/browse' component={Browse} />
                <Route path='/settings' component={Settings} />
                <Route path='/result/:objectid' component={Result} />
            </Switch>
          </div>
        </Router>
        <hr />
      </div>
    );
  }
}

export default App;
