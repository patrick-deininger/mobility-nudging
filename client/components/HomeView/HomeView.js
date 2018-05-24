import React from 'react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';
import Page from 'components/Page/Page';
import Neighbour from 'components/Nudges/Neighbour/Neighbour'
import Template from 'components/Nudges/Template/Template'
import RankingScreen from 'components/Nudges/RankingScreen/RankingScreen';
import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './HomeView.scss';
import classNames from 'classnames';
import createBlockMutation from '../../modules/core/mutations/CreateBlock';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'
//import Slider, { Range } from 'rc-slider';
//import 'rc-slider/assets/index.css';
// import HorizontalSlider from 'components/Slider/Slider';
import SliderUI from 'material-ui/Slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


const flexibilityEndTime = '19:28';
const IndividualFlexibilityEndTime = 'tbd';
const noFlexibilityEndTime = '18:15';


const FinishBlockMutation = graphql`
  mutation HomeViewMutation (
    $blockId: ID!
  ) {
    finishBlock(blockId: $blockId) {
      block {
        id
      }
    }
  }
`;


class HomeView extends React.Component {

  state = {
    endTime: flexibilityEndTime,
    active: 'flexibility',
    parameters: {
      defaultChargeLevel: 85,
      chargeStatus: 55,
    },
    batteryIcon: 'battery full',
    nudgeStatic: {
      heading: "",
      text: "",
      imagesrc: "",
    },
    blockNumber: parseInt(this.props.match.params.blockNumber),
    sessionId: this.props.match.params.sessionId,
    blockConfigId: this.props.viewer.blockConfigs[parseInt(this.props.match.params.blockNumber)-1].id,
    blockId: this.props.match.params.blockId,
    errors: [],
  }

  componentWillMount(){
    this.initialize()
  }

  // shouldComponentUpdate(){
  //
  //   console.log("Update")
  //   const blockNumber = parseInt(this.props.location.pathname.split("/run/")[1].split("/")[0])
  //   const sessionId = this.props.location.pathname.split("/run/")[1].split("/")[1]
  //   const blockConfig = this.props.viewer.blockConfigs[parseInt(this.props.location.pathname.split("/run/")[1].split("/")[0])-1].id
  //
  //
  //   this.setState({ blockNumber: blockNumber, sessionId: sessionId, blockConfig: blockConfig });
  //
  // }

  setErrors = (errors) => {
  this.setState({ ...this.state, errors });
  }

  initialize = () => {

    const blockConfigs = this.props.viewer.blockConfigs

    if (blockConfigs.length >= this.state.blockNumber){
      const blockConfig = blockConfigs[this.state.blockNumber-1]

      const parameters = this.state.parameters
      const chargeStatus = parseInt(blockConfig.chargeStatus * 100)
      const defaultChargeLevel = parseInt(blockConfig.defaultChargeLevel * 100)
      parameters['chargeStatus'] = chargeStatus
      parameters['defaultChargeLevel'] = defaultChargeLevel

      this.setState({parameters: parameters})

      const nudgeStatic = this.state.nudgeStatic

      const heading = blockConfig.nudgeStatic.heading
      const text = blockConfig.nudgeStatic.text
      const imagesrc = blockConfig.nudgeStatic.image
      nudgeStatic['heading'] = heading
      nudgeStatic['text'] = text
      nudgeStatic['imagesrc'] = imagesrc

      this.setState({nudgeStatic: nudgeStatic})

    }
    else {
      this.props.router.push(`/done/${this.state.sessionId}`)
    }


    let batteryStatus = 'battery full'
    if (this.state.parameters.chargeStatus <= 20){
      batteryStatus = 'battery empty'
    }
    else if(this.state.parameters.chargeStatus <= 40){
      batteryStatus = 'battery low'
    }
    else if(this.state.parameters.chargeStatus <= 60){
      batteryStatus = 'battery medium'
    }
    else if(this.state.parameters.chargeStatus <= 80){
      batteryStatus = 'battery high'
    }
    else if(this.state.parameters.chargeStatus <= 100){
      batteryStatus = 'battery full'
    }
    this.setState({batteryIcon: batteryStatus});
  }

  onClickFlexibility = () => {
    const newStatus = 'flexibility';
    this.setState({...this.state, endTime: flexibilityEndTime, active: newStatus});
  }

  onClickNoFlexibility = () => {
    const endTime = '18:15';
    const newStatus = 'noFlexibility';
    this.setState({...this.state, endTime: noFlexibilityEndTime, active: newStatus});
  }

  onClickIndividualFlexibility = () => {
      const endTime = '18:47';
      const newStatus = 'individualFlexibility';
      this.setState({...this.state, endTime: IndividualFlexibilityEndTime, active: newStatus});
  }

  handleSliderChange = (event, value) => {
    const parameters = this.state.parameters
    parameters['defaultChargeLevel'] = value
    this.setState({parameters: parameters});
  };

  onClickConfirmation = () => {

    const FinishBlockVariables = {
      blockId: this.state.blockId,
    };

    commitMutation(this.props.relay.environment, {
          mutation: FinishBlockMutation,
          variables: FinishBlockVariables,
          onCompleted: (resp) => {
            console.log("Finished Block")
            this.nextScreen()
          },
          onError: (err) => {
            console.error(err)
          },
        }
      );
  }

 nextScreen = () => {
      var nextScreen = `/fb/${this.state.blockNumber}/${this.state.sessionId}/${this.state.blockId}`
      this.props.router.push(nextScreen)
  }


  render() {
    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>

          <Segment padded='very'>
          <div className={styles.currentKPIsContainer}>
            <div className={styles.currentTime}>
              <Segment floated='right'>
                  <Icon name='clock' size='large' />
                16:11
              </Segment>
            </div>

            <div className={styles.chargeStatus}>
              <Segment floated='left'>
                  <Icon name={this.state.batteryIcon} size='large' />
                 {this.state.parameters.chargeStatus}%
              </Segment>
            </div>
          </div>


           <Popup
           trigger={
              <Icon name='winner' size='huge' />
            }
            content={<RankingScreen/>}
            />

          <div className={styles.objectivesContainer}>

              <div className={styles.timeSegment}>
                <Statistic size='small'>
                  <Statistic.Label>Geladen um</Statistic.Label>
                  <Statistic.Value>{this.state.endTime}</Statistic.Value>
                </Statistic>
              </div>



              <div className={styles.chargingLevelSegment}>
                <Statistic size='small'>
                  <Statistic.Label>Ladeziel</Statistic.Label>
                  <Statistic.Value>{this.state.parameters.defaultChargeLevel}%</Statistic.Value>
                </Statistic>
              </div>

         </div>


            <div className={styles.sliderContainer}>
              <MuiThemeProvider>
                <SliderUI

                  className={styles.slider}
                  min={0}
                  max={100}
                  step={1}
                  value={this.state.parameters.defaultChargeLevel}
                  onChange={this.handleSliderChange}/>
              </MuiThemeProvider>

              <div className={styles.chargingLabel}>
                Ladeziel {this.state.parameters.defaultChargeLevel}%
              </div>
            </div>

            <Neighbour/>
            <Template
              heading={this.state.nudgeStatic.heading}
              text={this.state.nudgeStatic.text}
              imagesrc={this.state.nudgeStatic.imagesrc}
            />

        <Form className={styles.form}>
          <Button.Group widths="3" basic className={styles.buttonGroup}>
            <Popup
            trigger={
              <Button
                id="flexibility"
                onClick={this.onClickFlexibility}
                active={this.state.active == "flexibility"}
                >
                <p>Flexibilität bereitstellen bis</p>
                {flexibilityEndTime}
              </Button>
             }
             content={
               <div>
                 Der Ladezeitpunkt wird auf Vorschlag des Netzbetreibers definiert.
               </div>}
             />

             <Popup
             trigger={
               <Button
                 id="individualFlexibility"
                 onClick={this.onClickIndividualFlexibility}
                 active={this.state.active == "individualFlexibility"}
                 >
                 Individueller Ladezeitpunkt bestimmen
               </Button>
              }
              content={
                <div>
                  Individuellen Ladezeitpunkt bestimmen, bei dem das Fahrzeug spätestens den definierten Ladezustand hat.
                </div>}
              />

              <Popup
              trigger={
                <Button
                  id="noFlexibility"
                  onClick={this.onClickNoFlexibility}
                  active={this.state.active == "noFlexibility"}
                  >
                  <p>Schnellstmögliches Laden bis</p>
                  {noFlexibilityEndTime}
                </Button>
               }
               content={
                 <div>
                  Schnelles Aufladen bis zum definierten Ladezustand. Es wird keine Flexibilität bereitgestellt.
                 </div>}
               />
          </Button.Group>

          <Button onClick={this.onClickConfirmation} fluid color="green" className={styles.conformationButton}>
            Bestätigen
          </Button>
        </Form>
          </Segment>

      </section>
      </Page>
    );
  }
}

export default createRefetchContainer(
  withAuth(HomeView),
  {
  viewer: graphql`
      fragment HomeView_viewer on Viewer
      @argumentDefinitions(
        session: {type: "ID"},
        blockConfig: {type: "ID"},
      ){
        ...Page_viewer
        block(session: $session, blockConfig: $blockConfig){
          id
        }
        user{
          id
        }
        blockConfigs {
          id
          clocktime
          chargeStatus
          chargeDistance
          timeToFullCharge
          flexibilityTimeRequest
          defaultChargeLevel
          flexibilityTimeProvision

          fullChargePrice
          nudgeStatic{
            id
            name
            heading
            text
            image
          }
          nudgeDynamic{
            id
            name
            heading
            text
            image
          }

        }

      }

      `,
  },


  graphql`
    query HomeViewRefetchQuery($session: ID!, $blockConfig: ID!){
      viewer {
        ...HomeView_viewer @arguments(session: $session, blockConfig: $blockConfig)

      }
    }
    `,
);
