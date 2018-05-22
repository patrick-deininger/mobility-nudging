import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header, Dropdown, Grid, Label } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';

import styles from './AddSessionBlockConfig.scss';

const CreateSessionBlockConfigMutation = graphql`
  mutation AddSessionBlockConfigMutation (
    $sessionConfigId: ID!
    $blockConfigId: ID!
  ) {
    createSessionBlockConfig(sessionConfigId: $sessionConfigId, blockConfigId: $blockConfigId) {
      sessionBlockConfig {
        id
      }
    }
  }
`;


class AddSessionBlockConfig extends React.Component {
  state = {
    input: {
      SessionConfigId: "",
      BlockConfigId: "",
    },
    sessionConfigOptions: [],
    blockConfigOptions: [],
    selectedBlockConfigNames: [],
    selectedBlockConfigIds: [],
    errors: [],

  }

  componentWillMount(){
    this.populateSessionConfigOptions()
  }

  componentDidMount(){
    this.populateBlockConfigOptions()
  }

  populateSessionConfigOptions = () => {
    const sessionConfigOptions = this.props.viewer.sessionConfigs.map((x) => (
    {
      key: x.id,
      value: x.id,
      text: x.name,
    }));
    this.setState({ ...this.state, sessionConfigOptions });
  }

  populateBlockConfigOptions = () => {
    const blockConfigOptions = this.props.viewer.blockConfigs.map((x) => (
    {
      key: x.id,
      value: x.id,
      text: x.name,
    }));
    this.setState({ ...this.state, blockConfigOptions });
  }

  handleBlockConfigDropdownChange = (e, { value }) => {
    const input = this.state.input;
    input['BlockConfigId'] = value;
    this.setState({ ...this.state, input });
  }

  handleSessionConfigDropdownChange = (e, { value }) => {
    const input = this.state.input;
    input['SessionConfigId'] = value;
    this.setState({ ...this.state, input });
  }

  addBlockConfig = () => {
      var selectedBlockConfigNames = this.state.selectedBlockConfigNames;
      var selectedBlockConfigIds = this.state.selectedBlockConfigIds;
      var blockConfigs = this.props.viewer.blockConfigs
      var id = this.state.input.BlockConfigId
      var l = blockConfigs.length
      var newSelectedName = ""

      //only add unique values
      if (!selectedBlockConfigIds.includes(id)){

        for (var x = 0; x < l; x++){
          if (id == blockConfigs[x].id){
              newSelectedName = blockConfigs[x].name
              break;
          }
        }

        selectedBlockConfigIds[selectedBlockConfigIds.length] = id;
        selectedBlockConfigNames[selectedBlockConfigNames.length] = newSelectedName;
        this.setState({ ...this.state, selectedBlockConfigNames });
        this.setState({ ...this.state, selectedBlockConfigIds });
      }
  }

  setErrors = (errors) => {
    this.setState({ ...this.state, errors });
  }


  onSubmitHandler = (ev) => {
    console.log("onSubmit")

    var l = this.state.selectedBlockConfigIds.length
    for(var i = 0; i < l; i++){
      const SessionBlockConfigVariables = {
        sessionConfigId: this.state.input.SessionConfigId,
        blockConfigId: this.state.selectedBlockConfigIds[i],
      };

      commitMutation(this.props.relay.environment, {
            mutation: CreateSessionBlockConfigMutation,
            variables: SessionBlockConfigVariables,
            onCompleted: (resp) => {
              console.log("Created new SessionBlockConfig")
              this.props.router.push('/cockpit');
            },
            onError: (err) => {
              console.error(err)
            },
          }
        );
    }
  }

  render() {

    const { input, erros } = this.state;


    return (
      <Page viewer={this.props.viewer}>

        <div className={styles.container}>
          <Segment padded='very'>
            <Header as='h1'>Neue Session Block Konfiguration</Header>

          <div className={styles.form}>

           <Grid>
            <Grid.Row columns={1} className={styles.row}>
             <Grid.Column width={13} className={styles.column}>
              <Dropdown
                 id="sessionConfigs"
                 className={styles.nameField}
                 options={this.state.sessionConfigOptions}
                 search
                 selection
                 fluid
                 placeholder='Session Config'
                 onChange={this.handleSessionConfigDropdownChange}
               />
             </Grid.Column>
            </Grid.Row>
             <Grid.Row columns={2} className={styles.row}>
               <Grid.Column width={13} className={styles.column}>
                 <Dropdown
                    id="blockConfigs"
                    className={styles.nameField}
                    options={this.state.blockConfigOptions}
                    search
                    selection
                    fluid
                    placeholder='Block Config'
                    onChange={this.handleBlockConfigDropdownChange}
                  />
               </Grid.Column>
               <Grid.Column width={1} className={styles.column}>
                 <Button icon='plus' floated='left' onClick={this.addBlockConfig}/>
               </Grid.Column>
             </Grid.Row>
           </Grid>

          {this.state.selectedBlockConfigNames.map(e => {if (e != "") { return( <Label>{e}</Label>)}})}


           <Button
             color='green'
              fluid
              type='submit'
              size='huge'
              onClick={this.onSubmitHandler}
            >
              Hinzufügen
            </Button>

          </div>
        </Segment>
            </div>
          </Page>
        )

      }
}

export default createRefetchContainer(
  withAuth(AddSessionBlockConfig),
  graphql`
    fragment AddSessionBlockConfig_viewer on Viewer {
      ...Page_viewer
      sessionConfigs{
        id
        name
      }
      blockConfigs{
        id
        name
      }

    }
  `,
);
