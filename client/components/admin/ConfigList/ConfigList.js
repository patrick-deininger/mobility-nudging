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
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Begonnene Durchläufe</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Beendete Durchläufe</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Anzahl Blöcke</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Status</Table.HeaderCell>
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
                  <Table.Cell textAlign='right'>{e.sessionConfigStatus}</Table.Cell>
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
                  <Table.Cell>
                    <Popup
                      trigger={
                        <Button icon='search'/>
                       }
                       content={
                         <div className={styles.to_read}>
                           <ConfigList viewer={this.props.viewer} show="BlockConfigParams"/>
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
      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.standardBlockConfig}>Name</Table.HeaderCell>
                <Table.HeaderCell className={styles.standardBlockConfig}>Uhrzeit</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Ladezustand</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Reichweite</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Ladezeit</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Flexibilitätsdauer</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Flexibilitätsladeziel</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Provision für F.-Dauer</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Provision für F.-Ladeziel</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Aufladepreis (voll)</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Statischer Nudge</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {blockConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell>{e.clocktime}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.chargeStatus}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.chargeDistance}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.timeToFullCharge}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.flexibilityTimeRequest}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.flexibilityChargeLevelRequest}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.flexibilityTimeProvision}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.flexibilityChargeLevelProvision}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.fullChargePrice}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.nudgeStatic.name}</Table.Cell>
                </Table.Row>)
              }
              )}
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

              </Table.Row>
            </Table.Header>
            <Table.Body>
              {relevantSessionBlockConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.blockConfig.name}</Table.Cell>
                  <Table.Cell>{e.blockConfig.nudgeStatic.name}</Table.Cell>
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
      representationCurrentState

      flexibilityTimeRequest
      defaultChargeLevel
      timeToFullCharge
      fullChargePrice
      minumumChargeLevel
      representationTargetState

      flexibilityTimeProvision
      savedEmissions
      avoidedEnvironmentalCosts
      avoidedEnergyCosts

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
