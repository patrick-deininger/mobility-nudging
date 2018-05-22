import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { Table, Rating, Button, Popup, Icon, Modal, Input, Label, Form } from 'semantic-ui-react';
import styles from './ConfigList.scss';



class ConfigList extends React.Component {

  state = {input: {rating: 0}, errors: []};

  setErrors = (errors) => {
    this.setState({ ...this.state, errors });
  }

  countNumberOfSessions = (id) => {
    const sessions = this.props.viewer.sessions;

    var l = sessions.length
    var sessionCount = 0
    for (var x = 0; x < l; x++){
      if (sessions[x].sessionConfig.id == id){
        sessionCount += 1
      }
    }

    return(sessionCount)
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

  render() {

    if (this.props.show == "sessionConfig"){
      const sessionConfigs = this.props.viewer.sessionConfigs;

      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.standardSessionConfig}>Name</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Geplante Durchläufe</Table.HeaderCell>
                  <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Begonnene Durchläufe</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Anzahl Blöcke</Table.HeaderCell>
                  <Table.HeaderCell textAlign='right' className={styles.standardSessionConfig}>Blöcke</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sessionConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell textAlign='right'>{e.numberOfSessions}</Table.Cell>
                  <Table.Cell textAlign='right'>{this.countNumberOfSessions(e.id)}</Table.Cell>
                  <Table.Cell textAlign='right'>{this.countNumberOfBlocks(e.id)}</Table.Cell>
                  <Table.Cell textAlign='right'>tbd</Table.Cell>
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
                <Table.HeaderCell className={styles.standardBlockConfig}>Uhrzeit</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Ladezustand</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Reichweite</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Ladezeit</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Flexibilitätsdauer</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Flexibilitätsladeziel</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Provision für F.-Dauer</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Provision für F.-Ladeziel</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Aufladepreis (voll)</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.standardBlockConfig}>Nudge</Table.HeaderCell>
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
                  <Table.Cell textAlign='right'>{e.nudge.name}</Table.Cell>
                </Table.Row>)
              }
              )}
            </Table.Body>
          </Table>
        </div>
      );
    }

    if (this.props.show == "nudgeConfig"){
      const nudgeConfigs = this.props.viewer.nudgeConfigs;

      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.nudgeStandard}>Name</Table.HeaderCell>
                <Table.HeaderCell  className={styles.nudgeStandard}>Heading</Table.HeaderCell>
                <Table.HeaderCell className={styles.nudgeText}>Text</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' className={styles.nudgeStandard}>Image</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {nudgeConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
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


  }
}

export default createFragmentContainer(
  ConfigList,
  graphql`
  fragment ConfigList_viewer on Viewer {
    sessionConfigs{
      id
      name
      numberOfSessions
    }
    blockConfigs{
      id
      name
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
      }
    }
    nudgeConfigs{
      id
      name
      heading
      text
      image
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
    }

  }`
);
