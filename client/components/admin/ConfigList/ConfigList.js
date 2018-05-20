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
    const sessionConfigs = this.props.viewer.sessionConfigs;


    return (
      <div className={styles.root}>
        <Table singleLine className={styles.books}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className={styles.title}>Name</Table.HeaderCell>
              <Table.HeaderCell className={styles.author}>Anzahl</Table.HeaderCell>
              {this.props.state == "reading" &&
                <Table.HeaderCell className={styles.finished}></Table.HeaderCell>
              }
              {this.props.state == "to-read" &&
                <Table.HeaderCell className={styles.rating}></Table.HeaderCell>
              }
              {this.props.state == "read" &&
                <Table.HeaderCell className={styles.rating}>Rating</Table.HeaderCell>
              }
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
  }`
);
