import LandingRedirectView from 'components/LandingRedirectView/LandingRedirectView';
import Auth from 'modules/auth/Auth';
import HomeView from 'components/HomeView/HomeView';
import FinishedScreen from 'components/FinishedScreen/FinishedScreen';
import Cockpit from 'components/admin/Cockpit/Cockpit';
import AddSessionConfig from 'components/admin/AddSessionConfig/AddSessionConfig';


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

const HomeViewQuery = graphql`
  query routes_HomeView_Query {
    viewer {
      ...HomeView_viewer
    }
  }
`;

const FinishedScreenQuery = graphql`
  query routes_FinishedScreen_Query {
    viewer {
      ...FinishedScreen_viewer
    }
  }
`;

const CockpitQuery = graphql`
  query routes_Cockpit_Query {
    viewer {
      ...Cockpit_viewer
    }
  }
`;

const AddSessionConfigQuery = graphql`
  query routes_AddSessionConfig_Query {
    viewer {
      ...AddSessionConfig_viewer
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
    <Route path='run/:number' Component={HomeView} query={HomeViewQuery} />
    <Route path='done' Component={FinishedScreen} query={FinishedScreenQuery} />
    <Route path='cockpit' Component={Cockpit} query={CockpitQuery} />
    <Route path='add-session-config' Component={AddSessionConfig} query={AddSessionConfigQuery} />
  </Route>
);
