import LandingRedirectView from 'components/LandingRedirectView/LandingRedirectView';
import Auth from 'modules/auth/Auth';
import HomeView from 'components/HomeView/HomeView';
import FinishedScreen from 'components/FinishedScreen/FinishedScreen';
import Cockpit from 'components/admin/Cockpit/Cockpit';
import AddSessionConfig from 'components/admin/AddSessionConfig/AddSessionConfig';
import AddNudgeStaticConfig from 'components/admin/AddNudgeStaticConfig/AddNudgeStaticConfig';
import AddNudgeDynamicConfig from 'components/admin/AddNudgeDynamicConfig/AddNudgeDynamicConfig';
import AddBlockConfig from 'components/admin/AddBlockConfig/AddBlockConfig';
import AddSessionBlockConfig from 'components/admin/AddSessionBlockConfig/AddSessionBlockConfig';
import AddFeedbackConfig from 'components/admin/AddFeedbackConfig/AddFeedbackConfig';
import AddContextConfig from 'components/admin/AddContextConfig/AddContextConfig';
import FeedbackScreen from 'components/FeedbackScreen/FeedbackScreen';
import ContextScreen from 'components/ContextScreen/ContextScreen';
import SurveyScreen from 'components/SurveyScreen/SurveyScreen';


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

const AddNudgeStaticConfigQuery = graphql`
  query routes_AddNudgeStaticConfig_Query {
    viewer {
      ...AddNudgeStaticConfig_viewer
    }
  }
`;

const AddNudgeDynamicConfigQuery = graphql`
  query routes_AddNudgeDynamicConfig_Query {
    viewer {
      ...AddNudgeDynamicConfig_viewer
    }
  }
`;

const AddBlockConfigQuery = graphql`
  query routes_AddBlockConfig_Query {
    viewer {
      ...AddBlockConfig_viewer
    }
  }
`;

const AddSessionBlockConfigQuery = graphql`
  query routes_AddSessionBlockConfig_Query {
    viewer {
      ...AddSessionBlockConfig_viewer
    }
  }
`;

const AddFeedbackConfigQuery = graphql`
  query routes_AddFeedbackConfig_Query {
    viewer {
      ...AddFeedbackConfig_viewer
    }
  }
`;

const AddContextConfigQuery = graphql`
  query routes_AddContextConfig_Query {
    viewer {
      ...AddContextConfig_viewer
    }
  }
`;

const FeedbackScreenQuery = graphql`
  query routes_FeedbackScreen_Query {
    viewer {
      ...FeedbackScreen_viewer
    }
  }
`;

const ContextScreenQuery = graphql`
  query routes_ContextScreen_Query {
    viewer {
      ...ContextScreen_viewer
    }
  }
`;

const SurveyScreenQuery = graphql`
  query routes_SurveyScreen_Query {
    viewer {
      ...SurveyScreen_viewer
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
    <Route path='run/:blockNumber/:sessionId/:blockId' Component={HomeView} query={HomeViewQuery} />
    <Route path='fb/:blockNumber/:sessionId/:blockId' Component={FeedbackScreen} query={FeedbackScreenQuery} />
    <Route path='context/:blockNumber/:sessionId' Component={ContextScreen} query={ContextScreenQuery} />
    <Route path='done/:sessionId/:lastBlockId' Component={FinishedScreen} query={FinishedScreenQuery} />
    <Route path='cockpit' Component={Cockpit} query={CockpitQuery} />
    <Route path='add-session-config' Component={AddSessionConfig} query={AddSessionConfigQuery} />
    <Route path='add-nudge-static-config' Component={AddNudgeStaticConfig} query={AddNudgeStaticConfigQuery} />
    <Route path='add-nudge-dynamic-config' Component={AddNudgeDynamicConfig} query={AddNudgeDynamicConfigQuery} />
    <Route path='add-block-config' Component={AddBlockConfig} query={AddBlockConfigQuery} />
    <Route path='add-session-block-config' Component={AddSessionBlockConfig} query={AddSessionBlockConfigQuery} />
    <Route path='add-feedback-config' Component={AddFeedbackConfig} query={AddFeedbackConfigQuery} />
    <Route path='add-context-config' Component={AddContextConfig} query={AddContextConfigQuery} />
    <Route path='q/:sessionId/:blockId' Component={SurveyScreen} query={SurveyScreenQuery} />
  </Route>
);
