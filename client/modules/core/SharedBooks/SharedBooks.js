/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay';
import Page from 'components/Page/Page';
import SharedBooksList from 'components/SharedBooksList/SharedBooksList';
import { withAuth } from 'modules/auth/utils'

class SharedBooks extends React.Component {
  render() {
    return (
      <div>
        <Page title='Books' viewer={this.props.viewer}>
          <SharedBooksList viewer={this.props.viewer}/>
        </Page>
      </div>
    );
  }
}


export default createFragmentContainer(
  withAuth(SharedBooks),
  graphql`
    fragment SharedBooks_viewer on Viewer {
      ...Page_viewer
      ...SharedBooksList_viewer
    }
  `
);
