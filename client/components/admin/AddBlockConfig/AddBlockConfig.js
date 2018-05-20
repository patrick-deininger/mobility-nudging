import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header, Grid, Dropdown } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';

import styles from './AddBlockConfig.scss';

const CreateBlockConfigMutation = graphql`
  mutation AddBlockConfigMutation (

    $chargeStatus: Float!
    $chargeDistance: Float!
    $timeToFullCharge: Float!
    $flexibilityTimeRequest: Float!
    $flexibilityChargeLevelRequest: Float!
    $flexibilityTimeProvision: Float!
    $flexibilityChargeLevelProvision: Float!
    $fullChargePrice: Float!
    $nudgeId: ID!

  )
  {
    createBlockConfig (

      chargeStatus: $chargeStatus
      chargeDistance: $chargeDistance
      timeToFullCharge: $timeToFullCharge
      flexibilityTimeRequest: $flexibilityTimeRequest
      flexibilityChargeLevelRequest: $flexibilityChargeLevelRequest
      flexibilityTimeProvision: $flexibilityTimeProvision
      flexibilityChargeLevelProvision: $flexibilityChargeLevelProvision
      fullChargePrice: $fullChargePrice
      nudgeId: $nudgeId
    )
      {
        blockConfig {
          id
        }
      }
  }
`;


class AddBlockConfig extends React.Component {
  state = {
    input: {
        clocktime: "",
        charge_status: "",
        charge_distance: "",
        time_to_full_charge: "",
        flexibility_time_request: "",
        flexibility_charge_level_request: "",
        flexibility_time_provision: "",
        flexibility_charge_level_provision: "",
        full_charge_price: "",
        nudge_id: ""
    },
    nudgeOptions: [],
    errors: [],

  }

  componentWillMount(){
    console.log(this.props.viewer.nudgeConfigs)
    console.log(this.props.viewer)
    const nudgeOptions = this.props.viewer.nudgeConfigs.map((x) => (
    {
      key: x.id,
      value: x.id,
      text: x.name,
    }));
    this.setState({ ...this.state, nudgeOptions });
    console.log(nudgeOptions)
  }

  setErrors = (errors) => {
    this.setState({ ...this.state, errors });
  }

  handleFieldChange = (e, { value }) => {
    const input = this.state.input;
    const inputName = e.target.id;
    input[inputName] = e.target.value;
    this.setState({ ...this.state, input });
  }




  onSubmitHandler = (ev) => {
    console.log("onSubmit")
    const BlockConfigVariables = {
      //clocktime: this.state.input.clocktime,
      chargeStatus: this.state.input.charge_status,
      chargeDistance: this.state.input.charge_distance,
      timeToFullCharge: this.state.input.time_to_full_charge,
      flexibilityTimeRequest: this.state.input.flexibility_time_request,
      flexibilityChargeLevelRequest: this.state.input.flexibility_charge_level_request,
      flexibilityTimeProvision: this.state.input.flexibility_time_provision,
      flexibilityChargeLevelProvision: this.state.input.flexibility_charge_level_provision,
      fullChargePrice: this.state.input.full_charge_price,
      nudgeId: this.state.input.nudge_id,
    };


    console.log(BlockConfigVariables)
    commitMutation(this.props.relay.environment, {
          mutation: CreateBlockConfigMutation,
          variables: BlockConfigVariables,
          onCompleted: (resp) => {
            console.log("Created new BlockConfig")
            this.props.router.push('/cockpit');
          },
          onError: (err) => {
            console.error(err)
          },
        }
      );
  }




  render() {

    const { input, erros } = this.state;


    return (
      <Page viewer={this.props.viewer}>

        <div className={styles.container}>
          <Segment padded='very'>
            <Header as='h1'>Neue Block Konfiguration</Header>

          <div className={styles.form}>

          <Grid className={styles.nameFields}>
            <Grid.Row columns={2} className={styles.row}>
              <Grid.Column className={styles.column}>
              <Input
                id='clocktime'
                className={styles.inputField}
                value={input.clocktime}
                type='text'
                size='large'
                fluid
                required
                placeholder='Uhrzeit'
                onChange={this.handleFieldChange}
              />
              </Grid.Column>
              <Grid.Column className={styles.column}>
                <Input
                  id='charge_status'
                  className={styles.inputField}
                  value={input.charge_status}
                  type='text'
                  size='large'
                  fluid
                  required
                  placeholder='Ladezustand'
                  onChange={this.handleFieldChange}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2} className={styles.row}>
              <Grid.Column className={styles.column}>
                <Input
                  id='charge_distance'
                  className={styles.inputField}
                  value={input.charge_distance}
                  type='text'
                  size='large'
                  fluid
                  required
                  placeholder='Reichweite'
                  onChange={this.handleFieldChange}
                />
              </Grid.Column>
              <Grid.Column className={styles.column}>
                <Input
                  id='time_to_full_charge'
                  className={styles.inputField}
                  value={input.time_to_full_charge}
                  type='text'
                  size='large'
                  fluid
                  required
                  placeholder='Ladezeit'
                  onChange={this.handleFieldChange}
                />
              </Grid.Column>
            </Grid.Row>

          <Grid.Row columns={2} className={styles.row}>
            <Grid.Column className={styles.column}>
              <Input
                id='flexibility_time_request'
                className={styles.inputField}
                value={input.flexibility_time_request}
                type='text'
                size='large'
                fluid
                required
                placeholder='Flexibilitätsdauer'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
            <Grid.Column className={styles.column}>
              <Input
                id='flexibility_charge_level_request'
                className={styles.inputField}
                value={input.flexibility_charge_level_request}
                type='text'
                size='large'
                fluid
                required
                placeholder='Flexibilitätsladeziel'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2} className={styles.row}>
            <Grid.Column className={styles.column}>
              <Input
                id='flexibility_time_provision'
                className={styles.inputField}
                value={input.flexibility_time_provision}
                type='text'
                size='large'
                fluid
                required
                placeholder='Provision für Flexibilitätsdauer'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
            <Grid.Column className={styles.column}>
              <Input
                id='flexibility_charge_level_provision'
                className={styles.inputField}
                value={input.flexibility_charge_level_provision}
                type='text'
                size='large'
                fluid
                required
                placeholder='Provision für Flexibilitätsladeziel'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2} className={styles.row}>
            <Grid.Column className={styles.column}>
              <Input
                id='full_charge_price'
                className={styles.inputField}
                value={input.full_charge_price}
                type='text'
                size='large'
                fluid
                required
                placeholder='Aufladepreis (voll)'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
            <Grid.Column className={styles.column}>
              <Dropdown
                 id="nudge_name"
                 className={styles.nameField}
                 options={this.state.nudgeOptions}
                 search
                 selection
                 fluid
                 placeholder='Nudge Name'
                 onChange={this.handleDropdownChange}
               />
            </Grid.Column>
          </Grid.Row>
        </Grid>



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
  withAuth(AddBlockConfig),
  graphql`
    fragment AddBlockConfig_viewer on Viewer {
      ...Page_viewer
      nudgeConfigs{
        id
        name
      }

    }
  `,
);
