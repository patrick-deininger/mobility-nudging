import React from 'react';
//import { graphql, createFragmentContainer } from 'react-relay';
import { Table } from 'semantic-ui-react';
import styles from './RankingScreen.scss';



const rankingEntries = [
                        {id: "1", name: "Peter", score: "54", rank: "#1"},
                        {id: "2", name: "Felix", score: "37", rank: "#2"},
                        {id: "3", name: "Daniel", score: "26", rank: "#3"},
                        {id: "4", name: "Paul", score: "13", rank: "#4"},
                        {id: "5", name: "David", score: "7", rank: "#5"},
                      ];

class RankingScreen extends React.Component {



  render() {

      return (
        <div className={styles.root}>
          <h2 className={styles.heading}>Clique</h2>
          <Table singleLine className={styles.books}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.name}>Name</Table.HeaderCell>
                <Table.HeaderCell className={styles.score}>Score</Table.HeaderCell>
                <Table.HeaderCell className={styles.rank}>Rang</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>

              {rankingEntries.map(e =>


                    <Table.Row key={e.id} >
                      {e.name == "Paul" &&
                        <Table.Cell className={styles.user}>{e.name}</Table.Cell>
                      }
                      {e.name != "Paul" &&
                        <Table.Cell >{e.name}</Table.Cell>
                      }


                      {e.name == "Paul" &&
                        <Table.Cell className={styles.user}>{e.score}</Table.Cell>
                      }
                      {e.name != "Paul" &&
                        <Table.Cell >{e.score}</Table.Cell>
                      }


                      {e.name == "Paul" &&
                        <Table.Cell className={styles.user}>{e.rank}</Table.Cell>
                      }
                      {e.name != "Paul" &&
                        <Table.Cell >{e.rank}</Table.Cell>
                      }

                    </Table.Row>

                )}


            </Table.Body>

          </Table>
        </div>
      );
    }
  }

export default RankingScreen
