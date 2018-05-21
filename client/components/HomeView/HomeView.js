import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
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

class HomeView extends React.Component {

  state = {
    endTime: flexibilityEndTime,
    active: 'flexibility',
    parameters: {
      flexibilityChargeLevelRequest: 85,
      chargeStatus: 55,
    },
    batteryIcon: 'battery full',
    nudge: {
      heading: "",
      text: "",
      imagesrc: "",
    },
    blockNumber: parseInt(this.props.location.pathname.split("/run/")[1]),
    errors: [],
  }

  componentWillMount(){
    this.initialize()
  }

  setErrors = (errors) => {
  this.setState({ ...this.state, errors });
  }

  initialize = () => {

    const blockConfigs = this.props.viewer.blockConfigs

    if (blockConfigs.length >= this.state.blockNumber){

      const parameters = this.state.parameters
      const chargeStatus = parseInt(blockConfigs[this.state.blockNumber-1].chargeStatus * 100)
      const flexibilityChargeLevelRequest = parseInt(blockConfigs[this.state.blockNumber-1].flexibilityChargeLevelRequest * 100)
      parameters['chargeStatus'] = chargeStatus
      parameters['flexibilityChargeLevelRequest'] = flexibilityChargeLevelRequest

      this.setState({paramters: parameters})

      const nudge = this.state.nudge

      const heading = this.props.viewer.blockConfigs[this.state.blockNumber-1].nudge.heading
      const text = this.props.viewer.blockConfigs[this.state.blockNumber-1].nudge.text
      const imagesrc = this.props.viewer.blockConfigs[this.state.blockNumber-1].nudge.image
      nudge['heading'] = heading
      nudge['text'] = text
      nudge['imagesrc'] = imagesrc

      this.setState({nudge: nudge})

      this.createBlock()
    }
    else {
      this.props.router.push('/done')
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
     this.setState({flexibilityChargeLevelRequest: value});
  };

  onClickConfirmation = () => {
    var nextScreen = ""
    if (this.state.blockNumber+1 > this.props.viewer.blockConfigs.length){
        nextScreen = "/done"
    }
    else {
        const blockNumber = this.state.blockNumber + 1
        nextScreen = "/run/".concat((blockNumber).toString())
    }
    this.props.router.push(nextScreen)
  }


  createBlock = () => {
     const blockVariables = {
       user: this.props.viewer.user.id,
       blockConfig: this.props.viewer.blockConfigs[this.state.blockNumber-1].id

     }
     createBlockMutation(this.props.relay.environment, blockVariables, this.onCompletedCreateBlock, this.setErrors)

   }
   onCompletedCreateBlock = () => {
     console.log("Block created")
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
                  <Statistic.Value>{this.state.parameters.flexibilityChargeLevelRequest}%</Statistic.Value>
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
                  value={this.state.parameters.flexibilityChargeLevelRequest}
                  onChange={this.handleSliderChange}/>
              </MuiThemeProvider>

              <div className={styles.chargingLabel}>
                Ladeziel {this.state.parameters.flexibilityChargeLevelRequest}%
              </div>
            </div>

            <Neighbour/>
            <Template
              heading={this.state.nudge.heading}
              text={this.state.nudge.text}
              imagesrc={this.state.nudge.imagesrc}
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

export default createFragmentContainer(
  withAuth(HomeView),
  graphql`
    fragment HomeView_viewer on Viewer {
      ...Page_viewer
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
        flexibilityChargeLevelRequest
        flexibilityTimeProvision
        flexibilityChargeLevelProvision
        fullChargePrice
        nudge{
          id
          name
          heading
          text
          image
        }
      }
    }
  `,
);
