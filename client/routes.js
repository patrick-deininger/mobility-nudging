import LandingRedirectView from 'components/LandingRedirectView/LandingRedirectView';
import Auth from 'modules/auth/Auth';
import SharedBooks from 'modules/core/SharedBooks/SharedBooks';
import AddBookToBookshelf from 'modules/core/AddBookToBookshelf/AddBookToBookshelf';
import GroupView from 'modules/core/GroupView/GroupView';
import GroupCreateView from 'modules/core/GroupCreateView/GroupCreateView';
import GroupInviteView from 'modules/core/GroupInviteView/GroupInviteView';
import AcceptGroupInviteView from 'modules/core/AcceptGroupInviteView/AcceptGroupInviteView';
import SettingsView from 'modules/core/SettingsView';

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

const SharedBooksQuery = graphql`
  query routes_SharedBooks_Query {
    viewer {
      ...SharedBooks_viewer
    }
  }
`;

const GroupViewQuery = graphql`
  query routes_GroupView_Query($nameUrl: String!) {
    viewer {
      ...GroupView_viewer
    }
  }
`;

const GroupCreateViewQuery = graphql`
  query routes_GroupCreateView_Query {
    viewer {
      ...GroupCreateView_viewer
    }
  }
`;

const GroupInviteViewQuery = graphql`
  query routes_GroupInviteView_Query($nameUrl: String!) {
    viewer {
      ...GroupInviteView_viewer
    }
  }
`;

const AddBookToBookshelfQuery = graphql`
  query routes_AddBookToBookshelf_Query {
    viewer {
      ...AddBookToBookshelf_viewer
      ...AddBookToBookshelf_user
    }
  }
`;

const AcceptGroupInviteViewQuery = graphql`
  query routes_AcceptGroupInviteView_Query($verificationToken: String!) {
    viewer {
      ...AcceptGroupInviteView_viewer
    }
  }
`;

const SettingsViewQuery = graphql`
  query routes_SettingsView_Query {
    viewer {
      ...SettingsView_viewer
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
    <Route path='add-book' Component={AddBookToBookshelf} query={AddBookToBookshelfQuery} />
    <Route path='shared-books' Component={SharedBooks} query={SharedBooksQuery} />
    <Route path='group/:nameUrl'>
      <Route Component={GroupView} query={GroupViewQuery} />
      <Route path='/invite' Component={GroupInviteView} query={GroupInviteViewQuery} />
    </Route>

    <Route path='create' Component={GroupCreateView} query={GroupCreateViewQuery} />
    <Route path='accept/:verificationToken' Component={AcceptGroupInviteView} query={AcceptGroupInviteViewQuery} />
    <Route path='settings' Component={SettingsView} query={SettingsViewQuery} />
  </Route>
);
