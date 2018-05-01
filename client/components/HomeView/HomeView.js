import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import Page from 'components/Page/Page';
import Neighbour from 'components/Nudges/Neighbour/Neighbour'
import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './HomeView.scss';
import classNames from 'classnames';



class HomeView extends React.Component {

  state = {
    endTime: '19:28',
    active: 'flexibility',
  }

  onClickFlexibility = () => {
    const endTime = '19:28';
    const newStatus = 'flexibility';
    this.setState({...this.state, endTime: '19:28', active: newStatus});
  }

  onClickNoFlexibility = () => {
    const endTime = '18:15';
    const newStatus = 'noFlexibility';
    this.setState({...this.state, endTime: '18:15', active: newStatus});
  }

  render() {

    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>


          <Segment padded='very'>

            <div className={styles.currentTime}>
              <Segment floated='right'>
                16:11
              </Segment>
            </div>

            <div className={styles.timeContainer}>
              <Segment circular className={styles.timeSegment}>
                <Statistic className={styles.timeLabel}>
                  <Statistic.Label>Geladen um</Statistic.Label>
                  <Statistic.Value>{this.state.endTime}</Statistic.Value>
                </Statistic>
              </Segment>
            </div>


        <Neighbour className={styles.neighbour}>

        </Neighbour>

        <div> </div>

        <Form className={styles.form}>
          <Button.Group widths="2" basic className={styles.buttonGroup}>
            <Button
              id="flexibility"
              onClick={this.onClickFlexibility}
              active={this.state.active == "flexibility"}
              >
              Flexibilität bereitstellen
            </Button>

            <Button
              id="noFlexibility"
              onClick={this.onClickNoFlexibility}
              active={this.state.active == "noFlexibility"}
              >
              Keine Flexibilität bereitstellen
            </Button>

          </Button.Group>

          <Button fluid color="green" className={styles.conformationButton}>
            Bestätigen
          </Button>
        </Form>

          </Segment>
      </section>
      </Page>
    );
  }
}

export default createFragmentContainer(
  withAuth(HomeView),
  graphql`
    fragment HomeView_viewer on Viewer {
      ...Page_viewer
    }
  `,
);
