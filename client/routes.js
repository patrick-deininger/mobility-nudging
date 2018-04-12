import LandingRedirectView from 'components/LandingRedirectView/LandingRedirectView';
import Auth from 'modules/auth/Auth';


import { Route, makeRouteConfig } from 'found';
import React from 'react';
import { graphql } from 'react-relay';


const LandingRedirectViewQuery = graphql`
  query routes_Landing_Query {
    viewer {
      ...LandingRedirectView_viewer
    }
  }
`;

const AuthQuery = graphql`
  query routes_Auth_Query {
    viewer {
      ...Auth_viewer
    }
  }
`;

export default makeRouteConfig(
  <Route path='/'>
    <Route Component={LandingRedirectView} query={LandingRedirectViewQuery} />
    <Route Component={Auth} query={AuthQuery}>
      <Route path='login' />
      <Route path='signup' />
    </Route>
  </Route>
);
