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
    console.log("ConfigList")
    console.log(this.props.viewer.sessionConfigs)

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

      return (
        <div className={styles.root}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.standard}>clocktime</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>charge_status</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>charge_distance</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>time_to_full_charge</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>flexibility_time_request</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>flexibility_charge_level_request</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>flexibility_time_provision</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>flexibility_charge_level_provision</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>full_charge_price</Table.HeaderCell>
                <Table.HeaderCell className={styles.standard}>nudge</Table.HeaderCell>
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
