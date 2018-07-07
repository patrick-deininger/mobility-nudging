import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';

import styles from './SurveyScreen.scss';



class SurveyScreen extends React.Component {


  onSubmitHandler = (ev) => {
    this.props.router.push('/cockpit');
  }



  render() {



    return (
      <Page viewer={this.props.viewer}>

        <div className={styles.container}>
          <Segment padded='very'>
            <Header as='h1'>Umfrage</Header>

          <div className={styles.form}>




           <Button
             color='green'
              fluid
              type='submit'
              size='huge'
              onClick={this.onSubmitHandler}
            >
              Bestätigen
            </Button>



          </div>

        </Segment>
      </div>
    </Page>
        )

      }
}

export default createRefetchContainer(
  withAuth(SurveyScreen),
  graphql`
    fragment SurveyScreen_viewer on Viewer {
      ...Page_viewer

    }
  `,
);
