import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { Table, Rating, Button, Popup, Icon, Modal, Input, Label, Form } from 'semantic-ui-react';
import styles from './ConfigList.scss';



class ConfigList extends React.Component {

  state = {input: {rating: 0}, errors: []};

  setErrors = (errors) => {
    this.setState({ ...this.state, errors });
  }

  render() {

    if (this.props.show == "sessionConfig"){
      const sessionConfigs = this.props.viewer.sessionConfigs;

      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.name}>Name</Table.HeaderCell>
                <Table.HeaderCell className={styles.number}>Anzahl</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sessionConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell>{e.numberOfSessions}</Table.Cell>
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
      console.log(blockConfigs)
      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.standard}>Uhrzeit</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>Ladezustand</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>Reichweite</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>Ladezeit</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>Flexibilitätsdauer</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>Flexibilitätsladeziel</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>Provision für F.-Dauer</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>Provision für F.-Ladeziel</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>Aufladepreis (voll)</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>Nudge</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {blockConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.clocktime}</Table.Cell>
                  <Table.Cell>{e.chargeStatus}</Table.Cell>
                  <Table.Cell>{e.chargeDistance}</Table.Cell>
                  <Table.Cell>{e.timeToFullCharge}</Table.Cell>
                  <Table.Cell>{e.flexibilityTimeRequest}</Table.Cell>
                  <Table.Cell>{e.flexibilityChargeLevelRequest}</Table.Cell>
                  <Table.Cell>{e.flexibilityTimeProvision}</Table.Cell>
                  <Table.Cell>{e.flexibilityChargeLevelProvision}</Table.Cell>
                  <Table.Cell>{e.fullChargePrice}</Table.Cell>
                  <Table.Cell>{e.nudge.name}</Table.Cell>
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
                <Table.HeaderCell className={styles.name}>Name</Table.HeaderCell>
                <Table.HeaderCell className={styles.number}>Anzahl</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {nudgeConfigs.map(e => { return(
                <Table.Row key={e.id}>
                  <Table.Cell>{e.name}</Table.Cell>
                  <Table.Cell>{e.name}</Table.Cell>
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

  }`
);
