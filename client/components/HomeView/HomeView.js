import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import Page from 'components/Page/Page';

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
      console.log(this.state.endTime)
    console.log("onClickFlexibility")
    const endTime = '19:28';
    const newStatus = 'flexibility';
    //console.log(newTime)
    this.setState({...this.state, endTime});
    this.setState({...this.state, active: newStatus});
    console.log(this.state.endTime)
    console.log(this.state.active)
  }

  onClickNoFlexibility = () => {
      console.log(this.state.endTime)
    console.log("onClickNoFlexibility")
    const endTime = '18:15';
    const newStatus = 'noFlexibility';
    //console.log(newTime)
    this.setState({...this.state, endTime});
    this.setState({...this.state, active: newStatus});
    console.log(this.state.endTime)
    console.log(this.state.active)
  }

  render() {

    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>

          <Segment className={styles.segment} padded='very'>

            <Segment circular className={styles.timeSegment}>
              <Statistic className={styles.timeLabel}>
                <Statistic.Label>Zeit</Statistic.Label>
                <Statistic.Value>{this.state.endTime}</Statistic.Value>
              </Statistic>
            </Segment>
        <Form className={styles.form}>
          <Button.Group widths="2" basic>
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

          <Button fluid color="green">
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
