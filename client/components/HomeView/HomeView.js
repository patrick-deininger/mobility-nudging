import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import Page from 'components/Page/Page';
import Neighbour from 'components/Nudges/Neighbour/Neighbour'
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
    sliderValue: 85,
    currentChargingLevel: 55,
    batteryIcon: 'battery full',
    blockNumber: parseInt(this.props.location.pathname.split("/run/")[1]),
    errors: [],
  }

  componentWillMount(){
    this.createBlock()
    this.chooseConfig()

  }

  setErrors = (errors) => {
  this.setState({ ...this.state, errors });
  }

  chooseConfig = () => {
    console.log(this.props.viewer)
    const blockConfigs = this.props.viewer.blockConfigs
    if (blockConfigs.length > this.state.blockNumber-1){

      const chargeStatus = parseInt(blockConfigs[this.state.blockNumber-1].chargeStatus * 100)
      console.log(chargeStatus)
      this.setState({currentChargingLevel: chargeStatus})
    }
    else {
      this.props.router.push('/done')
    }


    let batteryStatus = 'battery full'
    if (this.state.currentChargingLevel <= 20){
      batteryStatus = 'battery empty'
    }
    else if(this.state.currentChargingLevel <= 40){
      batteryStatus = 'battery low'
    }
    else if(this.state.currentChargingLevel <= 60){
      batteryStatus = 'battery medium'
    }
    else if(this.state.currentChargingLevel <= 80){
      batteryStatus = 'battery high'
    }
    else if(this.state.currentChargingLevel <= 100){
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
     this.setState({sliderValue: value});
   };


   createBlock = () => {
     const blockVariables = {
       user: this.props.viewer.user.id,
       blockConfig: this.props.viewer.blockConfigs[this.state.blockNumber-1].id

     }
     console.log(blockVariables)
     createBlockMutation(this.props.relay.environment, blockVariables, this.onCompletedCreateBlock, this.setErrors)

   }

   onCompletedCreateBlock = () => {
     console.log("Block created")
   }


  render() {
    console.log(this.props.viewer)
    var nextScreen = ""
    if (this.state.blockNumber > this.props.viewer.blockConfigs.length){
        console.log("CHANGE")
        nextScreen = "/done"
    }
    else {
        nextScreen = "/run/".concat((this.state.blockNumber+1).toString())
    }


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

            <div className={styles.currentChargingLevel}>
              <Segment floated='left'>
                  <Icon name={this.state.batteryIcon} size='large' />
                 {this.state.currentChargingLevel}%
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
                  <Statistic.Value>{this.state.sliderValue}%</Statistic.Value>
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
                  value={this.state.sliderValue}
                  onChange={this.handleSliderChange}/>
              </MuiThemeProvider>

              <div className={styles.chargingLabel}>
                Ladeziel {this.state.sliderValue}%
              </div>
            </div>

            <Neighbour/>

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

          <Button as={Link} to={nextScreen} fluid color="green" className={styles.conformationButton}>
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
          nudge
          chargeStatus

      }
    }
  `,
);
