import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { Table, Rating, Button, Popup, Icon, Modal, Input, Label, Form } from 'semantic-ui-react';
import styles from './ConfigList.scss';



class ConfigList extends React.Component {

  state = {input: {rating: 0}, errors: []};

  setErrors = (errors) => {
    this.setState({ ...this.state, errors });
  }

  countNumberOfSessionsRunning = (id) => {
    const sessions = this.props.viewer.sessions;

    var l = sessions.length
    var sessionRunningCount = 0
    for (var x = 0; x < l; x++){
      if (sessions[x].sessionConfig.id == id){
        if (sessions[x].sessionStatus == "running"){
            sessionRunningCount += 1
        }
      }
    }
    return(sessionRunningCount)
  }

  countNumberOfSessionsFinished = (id) => {
    const sessions = this.props.viewer.sessions;

    var l = sessions.length
    var sessionFinishedCount = 0
    for (var x = 0; x < l; x++){
      if (sessions[x].sessionConfig.id == id){
        if (sessions[x].sessionStatus == "finished"){
            sessionFinishedCount += 1
        }
      }
    }
    return(sessionFinishedCount)
  }

  countNumberOfBlocks = (id) => {
    const sessionBlockConfigs = this.props.viewer.sessionBlockConfigs;

    var l = sessionBlockConfigs.length
    var blockCount = 0
    for (var x = 0; x < l; x++){
      if (sessionBlockConfigs[x].sessionConfig.id == id){
        blockCount += 1
      }
    }
    return(blockCount)
  }

  relevantSessionBlockConfigs = (sessionBlockConfigs, currentSessionConfigId) => {
    var relevantSessionBlockConfigs = []
    var l = sessionBlockConfigs.length

    for (var i = 0; i < l; i++){
      if(sessionBlockConfigs[i].sessionConfig.id == currentSessionConfigId){
        relevantSessionBlockConfigs.push(sessionBlockConfigs[i])
      }
    }
    return(relevantSessionBlockConfigs)
  }

  relevantBlockConfig = (blockConfigs, currentBlockConfigId) => {
    var relevantBlockConfig
    var l = blockConfigs.length

    for (var i = 0; i < l; i++){
      if(blockConfigs[i].id == currentBlockConfigId){
        relevantBlockConfig = blockConfigs[i]
      }
    }
    return(relevantBlockConfig)
  }

  render() {

    if (this.props.show == "sessionConfig"){
      const sessionConfigs = this.props.viewer.sessionConfigs;

      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.standardSessionConfig}>Name</Table.HeaderCell>
                <Table.HeaderCell className={styles.standardSessionConfig}>Beschreibung</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Geplante Durchläufe</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Aktive Durchläufe</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Beendete Durchläufe</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Anzahl Blöcke</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Blöcke</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sessionConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell>{e.description}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.numberOfSessions}</Table.Cell>
                  <Table.Cell textAlign='right'>{this.countNumberOfSessionsRunning(e.id)}</Table.Cell>
                  <Table.Cell textAlign='right'>{this.countNumberOfSessionsFinished(e.id)}</Table.Cell>
                  <Table.Cell textAlign='right'>{this.countNumberOfBlocks(e.id)}</Table.Cell>
                  <Table.Cell textAlign='right'>
                    <Popup
                    trigger={
                      <Button icon='block layout'/>
                     }
                     content={
                       <div className={styles.to_read}>
                         <ConfigList viewer={this.props.viewer} show="SessionBlockConfig" currentSessionConfigId={e.id}/>
                       </div>
                     }
                     />

                  </Table.Cell>
                </Table.Row>)
              }
              )}
            </Table.Body>
          </Table>
        </div>
      );
    }

    if (this.props.show == "blockConfig"){
      const blockConfigs = this.props.viewer.blockConfigs;
      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.standardBlockConfig}>Name</Table.HeaderCell>
                <Table.HeaderCell className={styles.standardBlockConfig}>Beschreibung</Table.HeaderCell>
                <Table.HeaderCell className={styles.standardBlockConfig}>Context</Table.HeaderCell>
                <Table.HeaderCell className={styles.standardBlockConfig}>Feedback</Table.HeaderCell>
                <Table.HeaderCell className={styles.standardBlockConfig}>Statischer Nudge</Table.HeaderCell>
                <Table.HeaderCell className={styles.standardBlockConfig}>Dynamischer Nudge</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Details</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {blockConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell>{e.description}</Table.Cell>
                  <Table.Cell>{e.context.name}</Table.Cell>
                  <Table.Cell>{e.feedback.name}</Table.Cell>
                  <Table.Cell>{e.nudgeStatic.name}</Table.Cell>
                  <Table.Cell>{e.nudgeDynamic.name}</Table.Cell>
                  <Table.Cell textAlign='right'>
                    <Popup
                      trigger={
                        <Button icon='search'/>
                       }
                       position='top right'
                       content={
                         <div>
                           <ConfigList viewer={this.props.viewer} show="blockConfigParams" currentBlockConfigId={e.id}/>
                         </div>
                       }
                     />
                   </Table.Cell>
                </Table.Row>)
              }
              )}
            </Table.Body>
          </Table>
        </div>
      );
    }


    if (this.props.show == "blockConfigParams"){
      const blockConfigs = this.props.viewer.blockConfigs;


      const currentBlockConfigId = this.props.currentBlockConfigId
      const e = this.relevantBlockConfig(blockConfigs, currentBlockConfigId);


      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.detailsBlockConfig}>Name</Table.HeaderCell>
                <Table.HeaderCell className={styles.detailsBlockConfig}>Uhrzeit</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Ladezustand</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Reichweite</Table.HeaderCell>

                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Flexibilitätsdauer</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Defaultladeziel</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Ladezeit</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Aufladepreis (voll)</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Mindestladezustand</Table.HeaderCell>

                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Provision</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Eingesp. Emissionen</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Verm. Umweltkosten</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.detailsBlockConfig}>Verm. Energiek.</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>

                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell>{e.clocktime}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.chargeStatus}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.chargeDistance}</Table.Cell>

                  <Table.Cell textAlign='right'>{e.flexibilityTimeRequest}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.defaultChargeLevel}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.timeToFullCharge}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.fullChargePrice}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.minimumChargeLevel}</Table.Cell>

                  <Table.Cell textAlign='right'>{e.flexibilityTimeProvision}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.savedEmissions}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.avoidedEnvironmentalCosts}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.avoidedEnergyCosts}</Table.Cell>
                </Table.Row>

            </Table.Body>
          </Table>
        </div>
      );
    }

    if (this.props.show == "nudgeStaticConfig"){
      const nudgeConfigs = this.props.viewer.nudgeStaticConfigs;

      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.nudgeStandard}>Name</Table.HeaderCell>
                  <Table.HeaderCell className={styles.nudgeStandard}>Beschreibung</Table.HeaderCell>
                <Table.HeaderCell  className={styles.nudgeStandard}>Heading</Table.HeaderCell>
                <Table.HeaderCell className={styles.nudgeText}>Text</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.nudgeStandard}>Image</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {nudgeConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell>{e.description}</Table.Cell>
                  <Table.Cell>{e.heading}</Table.Cell>
                  <Table.Cell>{e.text}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.image}</Table.Cell>
                </Table.Row>)
              }
              )}
            </Table.Body>
          </Table>
        </div>
      );
    }

    if (this.props.show == "nudgeDynamicConfig"){
      const nudgeConfigs = this.props.viewer.nudgeDynamicConfigs;

      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.nudgeStandard}>Name</Table.HeaderCell>
                  <Table.HeaderCell className={styles.nudgeStandard}>Beschreibung</Table.HeaderCell>
                <Table.HeaderCell  className={styles.nudgeStandard}>Heading</Table.HeaderCell>
                <Table.HeaderCell className={styles.nudgeText}>Text</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.nudgeStandard}>Image</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {nudgeConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell>{e.description}</Table.Cell>
                  <Table.Cell>{e.heading}</Table.Cell>
                  <Table.Cell>{e.text}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.image}</Table.Cell>
                </Table.Row>)
              }
              )}
            </Table.Body>
          </Table>
        </div>
      );
    }

    if (this.props.show == "contextConfig"){
      const contextConfigs = this.props.viewer.contextConfigs;

      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.nudgeStandard}>Name</Table.HeaderCell>
                  <Table.HeaderCell className={styles.nudgeStandard}>Beschreibung</Table.HeaderCell>
                <Table.HeaderCell  className={styles.nudgeStandard}>Heading</Table.HeaderCell>
                <Table.HeaderCell className={styles.nudgeText}>Text</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {contextConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell>{e.description}</Table.Cell>
                  <Table.Cell>{e.heading}</Table.Cell>
                  <Table.Cell>{e.text}</Table.Cell>
                </Table.Row>)
              }
              )}
            </Table.Body>
          </Table>
        </div>
      );
    }

    if (this.props.show == "feedbackConfig"){
      const feedbackConfigs = this.props.viewer.feedbackConfigs;

      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.nudgeStandard}>Name</Table.HeaderCell>
                  <Table.HeaderCell className={styles.nudgeStandard}>Beschreibung</Table.HeaderCell>
                <Table.HeaderCell  className={styles.nudgeStandard}>Heading</Table.HeaderCell>
                <Table.HeaderCell className={styles.nudgeText}>Text</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {feedbackConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell>{e.description}</Table.Cell>
                  <Table.Cell>{e.heading}</Table.Cell>
                  <Table.Cell>{e.text}</Table.Cell>
                </Table.Row>)
              }
              )}
            </Table.Body>
          </Table>
        </div>
      );
    }


    if (this.props.show == "SessionBlockConfig"){
      const sessionBlockConfigs = this.props.viewer.sessionBlockConfigs
      const currentSessionConfigId = this.props.currentSessionConfigId
      const relevantSessionBlockConfigs = this.relevantSessionBlockConfigs(sessionBlockConfigs, currentSessionConfigId);


      return (
        <div>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.sessionBlockStandard}>Name</Table.HeaderCell>
                <Table.HeaderCell  className={styles.sessionBlockStandard}>Statischer Nudge</Table.HeaderCell>
                <Table.HeaderCell  className={styles.sessionBlockStandard}>Dynamischer Nudge</Table.HeaderCell>

              </Table.Row>
            </Table.Header>
            <Table.Body>
              {relevantSessionBlockConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.blockConfig.name}</Table.Cell>
                  <Table.Cell>{e.blockConfig.nudgeStatic.name}</Table.Cell>
                  <Table.Cell>{e.blockConfig.nudgeDynamic.name}</Table.Cell>
                </Table.Row>)
              }
              )}
            </Table.Body>
          </Table>
        </div>
      );
    }

  }
}

export default createFragmentContainer(
  ConfigList,
  graphql`
  fragment ConfigList_viewer on Viewer {
    sessionConfigs{
      id
      name
      description
      numberOfSessions
      sessionConfigStatus
    }
    blockConfigs{
      id
      name
      description
      context{
        id
        name
      }
      feedback{
        id
        name
      }

      clocktime
      chargeStatus
      chargeDistance
      chargeCapacity
      energyPrice
      powerPrice
      representationCurrentState

      flexibilityTimeRequest
      defaultChargeLevel
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
      }
      nudgeDynamic{
        id
        name
      }
    }
    nudgeStaticConfigs{
      id
      name
      description
      heading
      text
      image
    }
    nudgeDynamicConfigs{
      id
      name
      description
      heading
      text
      image
    }
    sessions{
      id
      sessionStatus
      sessionConfig{
        id
      }
    }
    feedbackConfigs{
      id
      name
      description
      heading
      text
    }
    contextConfigs{
      id
      name
      description
      heading
      text
    }
    sessionBlockConfigs{
      id
      sessionConfig{
        id
      }
      blockConfig{
        id
        name
        nudgeStatic{
          id
          name
        }
        nudgeDynamic{
          id
          name
        }
      }
    }

  }`
);
