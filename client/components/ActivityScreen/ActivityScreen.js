import React from 'react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';
import Page from 'components/Page/Page';
import Neighbour from 'components/Nudges/Neighbour/Neighbour'
import Timer from 'components/Timer/Timer'
import Template from 'components/Nudges/Template/Template'
import RankingScreen from 'components/Nudges/RankingScreen/RankingScreen';
import createEventMutation from 'components/mutations/CreateEventMutation/CreateEventMutation';
import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form, Icon, Popup, Accordion } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './ActivityScreen.scss';
import classNames from 'classnames';
//import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import TimePicker from 'rc-time-picker'
import moment from 'moment'
import 'rc-time-picker/assets/index.css';
// import HorizontalSlider from 'components/Slider/Slider';
// import SliderUI from 'material-ui/Slider';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';



const IndividualFlexibilityEndTime = 'tbd';



const FinishBlockMutation = graphql`
  mutation ActivityScreenMutation (
    $blockId: ID!
  ) {
    finishBlock(blockId: $blockId) {
      block {
        id
      }
    }
  }
`;


class ActivityScreen extends React.Component {

  state = {
    endTime: '',
    //select active Button
    active: '',
    activeAccordionCharge: false,
    activeAccordionTime: false,
    dayShift: false,
    parameters: {
      //raw input
      clocktime: "",

      chargeStatus: "",
      chargeDistance: "",
      chargeCapacity: "",
      energyPrice: "",
      powerPrice: "",
      representationCurrentState: "",

      flexibilityTimeRequest: "",
      defaultChargeLevel: "",
      minimumChargeLevel: "",
      representationTargetState: "",

      flexibilityTimeProvision: "",
      savedEmissions: "",
      avoidedEnvironmentalCosts: "",
      avoidedEnergyCosts: "",

      penaltyProbability: "",
      penaltyAmount: "",

      // Calculated
      currentTime: "",
      flexibilityEndTime: "",
      individualFlexibilityEndTime: "",
      noFlexibilityEndTime: "",
      targetChargeLevel: "",
      targetMinimumChargeLevel: "",
      maximumDistance: "",
      sliderMax: "",
      chargeStatusDisplay: "",
      earliestFinishTime: "",


    },

    batteryIcon: 'battery full',
    nudgeStatic: {
      heading: "",
      text: "",
      imagesrc: "",
      nudgeType: "",
    },
    nudgeDynamic: {
      heading: "",
      text: "",
      imagesrc: "",
      nudgeType: "",
    },
    blockNumber: parseInt(this.props.match.params.blockNumber),
    sessionId: this.props.match.params.sessionId,
    blockConfigId: this.props.viewer.blockConfigs[parseInt(this.props.match.params.blockNumber)-1].id,
    blockConfig: '',
    blockId: this.props.match.params.blockId,
    errors: [],
  }

  componentWillMount(){
    this.initialize()
  }


  setErrors = (errors) => {
  this.setState({ ...this.state, errors });
  }

  initialize = () => {

    const blockConfigs = this.identifyRelevantBlockConfigs()

    if (blockConfigs.length >= this.state.blockNumber){
      const blockConfig = blockConfigs[this.state.blockNumber-1]

      this.setState({blockConfig: blockConfig})

      // Paramters
      const parameters = this.state.parameters

      const clocktime = blockConfig.clocktime
      const chargeStatus = parseInt(blockConfig.chargeStatus * 100)
      const chargeDistance = blockConfig.chargeDistance
      const chargeCapacity = blockConfig.chargeCapacity
      const energyPrice = blockConfig.energyPrice
      const powerPrice = blockConfig.powerPrice
      const representationCurrentState = blockConfig.representationCurrentState

      const flexibilityTimeRequest = blockConfig.flexibilityTimeRequest
      const timeToFullCharge = blockConfig.timeToFullCharge
      const defaultChargeLevel = parseInt(blockConfig.defaultChargeLevel * 100)
      const minimumChargeLevel = parseInt(blockConfig.minimumChargeLevel * 100)
      const representationTargetState = blockConfig.representationTargetState

      const flexibilityTimeProvision = blockConfig.flexibilityTimeProvision
      const savedEmissions = blockConfig.savedEmissions
      const avoidedEnvironmentalCosts = blockConfig.avoidedEnvironmentalCosts
      const avoidedEnergyCosts = blockConfig.avoidedEnergyCosts

      const penaltyProbability = blockConfig.penaltyProbability
      const penaltyAmount = blockConfig.penaltyAmount


      // Calculated
      const date = new Date(blockConfig.clocktime)
      const currentTime = this.toClockFormat(date)
      const flexibilityEndTime = this.toClockFormat(this.calcTime(date, flexibilityTimeRequest))
      const noFlexibilityEndTime = this.toClockFormat(this.calcTime(date, Math.max(0, (defaultChargeLevel - chargeStatus)*(timeToFullCharge/100))))
      const maximumDistance = chargeDistance/defaultChargeLevel * 100
      const earliestFinishTime = this.calcTime(date, Math.max(0, (defaultChargeLevel - chargeStatus)*(timeToFullCharge/100)))



      var targetChargeLevel = ''
      var targetMinimumChargeLevel = ''
      var sliderMax = ''
      var chargeStatusDisplay = ''
      if (representationCurrentState == 'percent'){
        targetChargeLevel = defaultChargeLevel
        targetMinimumChargeLevel = minimumChargeLevel
        sliderMax = 100
        chargeStatusDisplay = chargeStatus
      } else if (representationCurrentState == 'km') {
        targetChargeLevel = chargeDistance
        targetMinimumChargeLevel = chargeDistance*minimumChargeLevel/defaultChargeLevel
        sliderMax = parseInt(maximumDistance)
        chargeStatusDisplay = chargeDistance

      }


      parameters['clocktime'] = clocktime
      parameters['chargeStatus'] = chargeStatus
      parameters['chargeDistance'] = chargeDistance
      parameters['chargeCapacity'] = chargeCapacity
      parameters['energyPrice'] = energyPrice
      parameters['powerPrice'] = powerPrice
      parameters['representationCurrentState'] = representationCurrentState

      parameters['flexibilityTimeRequest'] = flexibilityTimeRequest
      parameters['defaultChargeLevel'] = defaultChargeLevel
      parameters['timeToFullCharge'] = timeToFullCharge
      parameters['minimumChargeLevel'] = minimumChargeLevel
      parameters['representationTargetState'] = representationTargetState

      parameters['flexibilityTimeProvision'] = flexibilityTimeProvision
      parameters['savedEmissions'] = savedEmissions
      parameters['avoidedEnvironmentalCosts'] = avoidedEnvironmentalCosts
      parameters['avoidedEnergyCosts'] = avoidedEnergyCosts

      parameters['penaltyProbability'] = penaltyProbability
      parameters['penaltyAmount'] = penaltyAmount

      // calculated
      parameters['currentTime'] = currentTime
      parameters['flexibilityEndTime'] = flexibilityEndTime
      parameters['noFlexibilityEndTime'] = noFlexibilityEndTime
      parameters['targetChargeLevel'] = targetChargeLevel
      parameters['targetMinimumChargeLevel'] = targetMinimumChargeLevel
      parameters['maximumDistance'] = maximumDistance
      parameters['sliderMax'] = sliderMax
      parameters['chargeStatusDisplay'] = chargeStatusDisplay
      parameters['earliestFinishTime'] = earliestFinishTime





      this.setState({parameters: parameters})

      // Set initial endTime
      const endTime = flexibilityEndTime
      this.setState({endTime: endTime})

      // Nudge Static
      const nudgeStatic = this.state.nudgeStatic

      const headingS = blockConfig.nudgeStatic.heading
      const textS = blockConfig.nudgeStatic.text
      const imagesrcS = blockConfig.nudgeStatic.image
      const nudgeTypeS = blockConfig.nudgeStatic.nudgeType
      nudgeStatic['heading'] = headingS
      nudgeStatic['text'] = textS
      nudgeStatic['imagesrc'] = imagesrcS
      nudgeStatic['nudgeType'] = nudgeTypeS

      this.setState({nudgeStatic: nudgeStatic})

      // Nudge Dynamic
      const nudgeDynamic = this.state.nudgeDynamic

      const headingD = blockConfig.nudgeDynamic.heading
      const textD = blockConfig.nudgeDynamic.text
      const imagesrcD = blockConfig.nudgeDynamic.image
      const nudgeTypeD = blockConfig.nudgeDynamic.nudgeType
      nudgeDynamic['heading'] = headingD
      nudgeDynamic['text'] = textD
      nudgeDynamic['imagesrc'] = imagesrcD
      nudgeDynamic['nudgeType'] = nudgeTypeD

      this.setState({nudgeDynamic: nudgeDynamic})

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


  identifyRelevantBlockConfigs = () => {
      // Identify all blockConfigs that match to current session
      const sessions = this.props.viewer.sessions
      var sessionConfigId  = ""

      for (var i = 0; i < sessions.length; i++){
        if (sessions[i].id == this.state.sessionId){
          sessionConfigId = sessions[i].sessionConfig.id
        }
      }

      const sessionBlockConfigs = this.props.viewer.sessionBlockConfigs
      var blockConfigIds = []

      for (var i = 0; i < sessionBlockConfigs.length; i++){
        if (sessionBlockConfigs[i].sessionConfig.id == sessionConfigId){
          blockConfigIds.push(sessionBlockConfigs[i].blockConfig.id)
        }
      }

      var blockConfigs = []
      const allBlockConfigs = this.props.viewer.blockConfigs

      for (var i = 0; i < blockConfigIds.length; i++){
        for (var j = 0; j < allBlockConfigs.length; j++){
          if (allBlockConfigs[j].id == blockConfigIds[i]){
            blockConfigs.push(allBlockConfigs[j])
          }
        }
      }
      return(blockConfigs)
  }


  calcTime = (date, minutes) => {
    const newDate = new Date(date.getTime() + minutes * 60000)
    return newDate
  }

  toClockFormat = (date) => {
    return (date.getHours() < 10 ? '0':'') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0':'') + date.getMinutes()
  }

  onClickFlexibility = () => {
    const newStatus = 'flexibility';
    const newActive = false

    this.setState({...this.state, active: newStatus, activeAccordionTime: newActive});
    this.updateTargetChargeLevel(this.state.parameters.defaultChargeLevel)
    this.updateEndTime(this.state.parameters.flexibilityEndTime)
  }

  onClickNoFlexibility = () => {
    const newStatus = 'noFlexibility';
    const newActive = false
    this.setState({...this.state, active: newStatus, activeAccordionTime: newActive});
    this.updateEndTime(this.state.parameters.noFlexibilityEndTime)
  }

  onClickIndividualFlexibility = () => {
    const individualFlexibilityEndTime = this.state.parameters.individualFlexibilityEndTime
    const flexibilityEndTime = this.state.parameters.flexibilityEndTime
    const noFlexibilityEndTime = this.state.parameters.noFlexibilityEndTime
    const previousActive = this.state.active
    var endTime = ''

    if (individualFlexibilityEndTime == ""){
      if (previousActive == "noFlexibility"){
        endTime = noFlexibilityEndTime
      } else {
        endTime = flexibilityEndTime
      }

    } else {
      endTime = individualFlexibilityEndTime
    }

    const newStatus = 'individualFlexibility';
    const newActive= true
    this.setState({...this.state, activeAccordionTime: newActive, active: newStatus});
    this.updateEndTime(endTime)
  }

  handleAccordionTimeClick = (e, titleProps) => {
    const { activeAccordionTime } = this.state
    const newIndex = !activeAccordionTime
    this.onClickIndividualFlexibility()
    this.setState({ activeAccordionTime: newIndex })
  }

  handleAccordionChargeClick = (e, titleProps) => {
    const { activeAccordionCharge } = this.state
    const newIndex = !activeAccordionCharge

    this.setState({ activeAccordionCharge: newIndex })
  }

  handleRangeChange = (event, value) => {
    const parameters = this.state.parameters
    const targetChargeLevel = event[1]
    parameters['targetMinimumChargeLevel'] = event[0]
    this.setState({parameters: parameters});
    this.updateTargetChargeLevel(targetChargeLevel)
    this.updateTime()
    this.onClickIndividualFlexibility()
  };

  handleSliderChange = (event, value) => {
    const parameters = this.state.parameters
    var targetChargeLevel = event

    if (event < parameters.minimumChargeLevel){
      parameters['targetMinimumChargeLevel'] = event
    }

    this.setState({parameters: parameters});
    this.updateTargetChargeLevel(targetChargeLevel)

  };

  updateTime = () => {
    const date = new Date(this.state.parameters.clocktime)
    const targetChargeLevel = this.state.parameters.targetChargeLevel
    const chargeStatus = this.state.parameters.chargeStatus
    const timeToFullCharge = this.state.parameters.timeToFullCharge
    var helpTime = this.calcTime(date, (targetChargeLevel - chargeStatus)*(timeToFullCharge/100))
    var endTime = ''
    var earliestFinishTime = ''

    if (this.calcTime(date, 0) > helpTime) {
      endTime = this.toClockFormat(this.calcTime(date, 0))
    } else {
      endTime = this.toClockFormat(this.calcTime(date, Math.max(0, (targetChargeLevel - chargeStatus)*(timeToFullCharge/100))))
      // earliestFinishTime = calculateEarliestFinishTime()
    }

    const parameters = this.state.parameters
    parameters['noFlexibilityEndTime'] = endTime

    this.setState({parameters: parameters});
    this.updateEndTime(endTime)

  }

  updateEarliestFinishTime = () => {
    const date = new Date(this.state.parameters.clocktime)
    const targetChargeLevel = this.state.parameters.targetChargeLevel
    const chargeStatus = this.state.parameters.chargeStatus
    const timeToFullCharge = this.state.parameters.timeToFullCharge
    const parameters = this.state.parameters
    parameters['earliestFinishTime'] = this.calcTime(date, Math.max(0, (targetChargeLevel - chargeStatus)*(timeToFullCharge/100)))
    parameters['individualFlexibilityEndTime'] = this.toClockFormat(parameters['earliestFinishTime'])
    this.setState({parameters: parameters})
    this.updateEndTime(this.toClockFormat(parameters['earliestFinishTime']))
    this.updateDay()
  }

  updateEndTime = (newEndTime) => {
    var endTime = newEndTime

    const earliestFinishTime = this.state.parameters.earliestFinishTime

    var endTimeHours = parseInt(endTime.split(":")[0])
    var endTimeMinutes  = parseInt(endTime.split(":")[1])
    var dayShift = ''

    if (endTimeHours < earliestFinishTime.getHours()){
      dayShift = true
    } else if (endTimeHours == earliestFinishTime.getHours()) {
        if (endTimeMinutes < earliestFinishTime.getMinutes()){
          dayShift = true
        }
        else {
          dayShift = false
        }
      }
    else {
      dayShift = false
    }

    this.setState({dayShift: dayShift});
    this.setState({endTime: endTime});
  }

  updateDay = () => {
    const earliestFinishTime = this.state.parameters.earliestFinishTime
    const endTime = this.state.endTime
    var endTimeHours = parseInt(endTime.split(":")[0])
    var endTimeMinutes  = parseInt(endTime.split(":")[1])
    var dayShift = ''

    if (endTimeHours < earliestFinishTime.getHours()){
      dayShift = true
    } else if (endTimeHours == earliestFinishTime.getHours()) {
        if (endTimeMinutes < earliestFinishTime.getMinutes()){
          dayShift = true
        }
        else {
          dayShift = false
        }
      }
    else {
      dayShift = false
    }

    this.setState({dayShift: dayShift});
  }

  updateTargetChargeLevel = (newTargetChargeLevel) => {
    const parameters = this.state.parameters
    parameters['targetChargeLevel'] = newTargetChargeLevel
    this.setState({parameters: parameters})
    this.updateEarliestFinishTime()
  }

  handleTimerChange = (event, value) => {

    const parameters = this.state.parameters
    const individualDate = new Date(event)

    const individualFlexibilityEndTime = this.toClockFormat(individualDate)
    const earliestFinishTime = this.state.parameters.earliestFinishTime


    parameters['individualFlexibilityEndTime'] = individualFlexibilityEndTime
    this.setState({parameters: parameters});
    this.updateEndTime(individualFlexibilityEndTime)


    // console.log(individualDate)
    // console.log(earliestFinishTime.getTime())

    // check if individualFlexibilityEndTime is realistic
    // if (individualDate.getTime() >= earliestFinishTime.getTime()){
    //
    //   const dayShift = false
    //
    //   this.setState({dayShift: dayShift});
    // } else {
    //   const dayShift = true
    //   this.setState({dayShift: dayShift});
    // }

  }

  onClickConfirmation = () => {
      const eventVariables =  {
        event: "Confirmation",
        userId: this.props.viewer.user.id,
        blockId: this.state.blockId,
        sessionId: this.state.sessionId,

        screen: "NudgeScreen",
        providedFlexibilityTime: 0,
        targetChargingLevel: this.state.parameters.targetChargeLevel,
        targetMinimumChargingLevel: this.state.parameters.targetMinimumChargeLevel,
        chargingLevelRepresentation: this.state.parameters.representationCurrentState,
      }

      this.createEvent(eventVariables)

      var nextScreen = `/fb/${this.state.blockNumber}/${this.state.sessionId}/${this.state.blockId}`
      this.props.router.push(nextScreen)
  }

  createEvent = (eventVariables) => {
    createEventMutation(this.props.relay.environment, eventVariables, this.onCompletedCreateEvent, this.setErrors);
  }

  onCompletedCreateEvent = () => {
    console.log('created event')
  }

  render() {
    const {parameters, nudgeStatic, nudgeDynamic} = this.state;
    const now = moment(new Date(parameters.clocktime))

    return (

      <Page title='Edision' viewer={this.props.viewer}>
        <section className={styles.container}>

          <Segment padded='very' className={styles.segment}>

          <div className={styles.currentKPIsContainer}>
            <div className={styles.currentTime}>
              <Segment  className={styles.clock}>
                  <Icon name='clock' size='large' color='grey' />
                  <span className={styles.clockSpan}>{parameters.currentTime}</span>
              </Segment>
            </div>

            <div className={styles.chargeStatus}>
              <Segment  className={styles.charge}>

                  <Icon name={this.state.batteryIcon} size='large' color='grey' />
                  <span className={styles.chargeSpan}>{parameters.chargeStatusDisplay}
                    {parameters.representationCurrentState == 'percent' ? (
                      <span>%</span>
                    ):(
                      <span className={styles.spanKM}>km</span>
                    )}
                  </span>
              </Segment>
            </div>
          </div>

        <span>
            <h1 className={styles.heading}>Ladevorgang definieren</h1>
        </span>

          <div className={styles.objectivesContainer}>

          <Accordion>
            <Accordion.Title  active={this.state.activeAccordionTime} onClick={this.handleAccordionTimeClick}>
              <div className={styles.timeSegment}>
                  <Statistic size='small'>
                    {this.state.dayShift == true && (
                      <Statistic.Label>Morgen</Statistic.Label>
                    )}
                    {this.state.dayShift == false && (
                      <Statistic.Label>Heute</Statistic.Label>
                    )}

                    <Statistic.Label>Geladen um</Statistic.Label>
                    <Statistic.Value>{this.state.endTime}</Statistic.Value>
                </Statistic>
              </div>
            </Accordion.Title>
            <Accordion.Content active={this.state.activeAccordionTime}>

              <TimePicker
                defaultValue={now}
                showSecond={false}
                onChange={this.handleTimerChange}/>
            </Accordion.Content>
          </Accordion>

          <Accordion>
            <Accordion.Title active={this.state.activeAccordionCharge} onClick={this.handleAccordionChargeClick}>
              <div className={styles.chargingLevelSegment}>
                  <Statistic size='small'>
                    <Statistic.Label>Ladeziel</Statistic.Label>
                    <Statistic.Value>{parameters.targetChargeLevel}
                      {parameters.representationCurrentState == 'percent' ? (
                        <span>%</span>
                      ):(
                        <span className={styles.spanKM}>km</span>
                      )}
                    </Statistic.Value>
                  </Statistic>
                </div>

           </Accordion.Title>
           <Accordion.Content active={this.state.activeAccordionCharge}>
             <div className={styles.sliderContainer}>
               {this.state.active != 'noFlexibility' ? (
                 <Range
                   min={0}
                   max={parameters.sliderMax}
                   defaultValue={[parameters.targetMinimumChargeLevel, parameters.targetChargeLevel]}
                   value={[parameters.targetMinimumChargeLevel, parameters.targetChargeLevel]}
                   onChange={this.handleRangeChange} />
               ):(
                 <Slider
                   min={0}
                   max={parameters.sliderMax}
                   defaultValue={parameters.targetChargeLevel}
                   value={parameters.targetChargeLevel}
                   onChange={this.handleSliderChange}
                   />
               )}


               <div className={styles.chargingLabel}>
                 {this.state.active == 'noFlexibility' ? (
                   <div></div>
                 ):(
                   <div>Minimum {parameters.targetMinimumChargeLevel}
                     {parameters.representationCurrentState == 'percent' ? (
                       <span>%</span>
                     ):(
                       <span className={styles.spanKM}>km</span>
                     )}
                   </div>
                 )}

                 <div>Ladeziel {parameters.targetChargeLevel}
                   {parameters.representationCurrentState == 'percent' ? (
                     <span>%</span>
                   ):(
                     <span className={styles.spanKM}>km</span>
                   )}
                 </div>
               </div>
             </div>
           </Accordion.Content>
         </Accordion>

       </div>



        <Template
          heading={nudgeStatic.heading}
          text={nudgeStatic.text}
          imagesrc={nudgeStatic.imagesrc}
        />

        <Form className={styles.form}>
          <Button.Group widths="3"  fluid basic className={styles.buttonGroup} size='large'>
            <Popup
            trigger={
              <Button
                id="flexibility"
                onClick={this.onClickFlexibility}
                active={this.state.active == "flexibility"}
                >
                <div className={styles.text}>
                  <p>Flexibilität bereitstellen bis</p>
                  {parameters.flexibilityEndTime}
                </div>
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
                 basic
                 >
                 <div className={styles.text}>
                   Individuellen Ladezeitpunkt bestimmen
                 </div>
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
                  basic
                  >
                  <div className={styles.text}>
                    <p>Schnellstmögliches Laden bis</p>
                    {this.toClockFormat(parameters.earliestFinishTime)}
                  </div>
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
  withAuth(ActivityScreen),
  {
  viewer: graphql`
      fragment ActivityScreen_viewer on Viewer
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
        sessions{
          id
          sessionConfig{
            id
          }
        }
        sessionBlockConfigs{
          id
          sessionConfig{
            id
          }
          blockConfig{
            id
          }
        }
        blockConfigs {
          id
          clocktime
          chargeStatus
          chargeDistance
          chargeCapacity
          energyPrice
          powerPrice
          representationCurrentState

          flexibilityTimeRequest
          defaultChargeLevel
          timeToFullCharge
          minimumChargeLevel
          representationTargetState

          flexibilityTimeProvision
          savedEmissions
          avoidedEnvironmentalCosts
          avoidedEnergyCosts

          penaltyProbability
          penaltyAmount

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
    query ActivityScreenRefetchQuery($session: ID!, $blockConfig: ID!){
      viewer {
        ...ActivityScreen_viewer @arguments(session: $session, blockConfig: $blockConfig)

      }
    }
    `,
);
