import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header, Grid, Dropdown } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';

import styles from './AddBlockConfig.scss';

const CreateBlockConfigMutation = graphql`
  mutation AddBlockConfigMutation (
    $name: String!
    $description: String!
    $context: ID!
    $feedback: ID!

    $chargeStatus: Float!
    $chargeDistance: Float!
    $chargeCapacity: Float!
    $energyPrice: Float!
    $powerPrice: Float!
    $representationCurrentState: String!


    $flexibilityTimeRequest: Float!
    $defaultChargeLevel: Float!
    $timeToFullCharge: Float!
    $minimumChargeLevel: Float!
    $representationTargetState: String!

    $flexibilityTimeProvision: Float!
    $savedEmissions: Float!
    $avoidedEnvironmentalCosts: Float!
    $avoidedEnergyCosts: Float!

    $penaltyProbability: Float!
    $penaltyAmount: Float!

    $nudgeStatic: ID!
    $nudgeDynamic: ID!
  )
  {
    createBlockConfig (
      name: $name
      description: $description
      context: $context
      feedback: $feedback

      chargeStatus: $chargeStatus
      chargeDistance: $chargeDistance
      chargeCapacity: $chargeCapacity
      energyPrice: $energyPrice
      powerPrice: $powerPrice
      representationCurrentState: $representationCurrentState

      flexibilityTimeRequest: $flexibilityTimeRequest
      defaultChargeLevel: $defaultChargeLevel
      timeToFullCharge: $timeToFullCharge
      minimumChargeLevel: $minimumChargeLevel
      representationTargetState: $representationTargetState

      flexibilityTimeProvision: $flexibilityTimeProvision
      savedEmissions: $savedEmissions
      avoidedEnvironmentalCosts: $avoidedEnvironmentalCosts
      avoidedEnergyCosts: $avoidedEnergyCosts

      penaltyProbability: $penaltyProbability
      penaltyAmount: $penaltyAmount

      nudgeStatic: $nudgeStatic
      nudgeDynamic: $nudgeDynamic
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
        name: "",
        description: "",
        context_id: "",
        feedback_id: "",

        clocktime: "",
        charge_status: "",
        charge_distance: "",
        charge_capacity: "",
        energy_price: "",
        power_price: "",
        representation_current_state: "",

        flexibility_time_request: "",
        default_charge_level: "",
        time_to_full_charge: "",
        minimum_charge_level: "",
        representation_target_state: "",

        flexibility_time_provision: "",
        saved_emissions: "",
        avoided_environmental_costs: "",
        avoided_energy_costs: "",

        penalty_probability: "",
        penalty_amount: "",

        nudge_static_id: "",
        nudge_dynamic_id: "",
    },
    contextOptions: [],
    feedbackOptions: [],
    representationCurrentStateOptions: [
      { key: 'percent', value: 'percent', text: 'Prozent' },
      { key: 'km', value: 'km', text: 'Kilometer' },
    ],
    representationTargetStateOptions: [
      { key: 'percent', value: 'percent', text: 'Prozent' },
      { key: 'km', value: 'km', text: 'Kilometer' },
    ],
    nudgeStaticOptions: [],
    nudgeDynamicDOptions: [],
    errors: [],

  }

  componentWillMount(){
    const contextOptions = this.props.viewer.contextConfigs.map((x) => (
    {
      key: x.id,
      value: x.id,
      text: x.name,
    }));
    this.setState({ contextOptions: contextOptions });

    const feedbackOptions = this.props.viewer.feedbackConfigs.map((x) => (
    {
      key: x.id,
      value: x.id,
      text: x.name,
    }));
    this.setState({ feedbackOptions: feedbackOptions });

    const nudgeStaticOptions = this.props.viewer.nudgeStaticConfigs.map((x) => (
    {
      key: x.id,
      value: x.id,
      text: x.name,
    }));
    this.setState({ nudgeStaticOptions: nudgeStaticOptions });

    const nudgeDynamicOptions = this.props.viewer.nudgeDynamicConfigs.map((x) => (
    {
      key: x.id,
      value: x.id,
      text: x.name,
    }));
    this.setState({ nudgeDynamicOptions: nudgeDynamicOptions });
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


  handleDropdownChangeContext = (e, { value }) => {
    const input = this.state.input;
    input['context_id'] = value;
    this.setState({ ...this.state, input });
  }

  handleDropdownChangeFeedback = (e, { value }) => {
    const input = this.state.input;
    input['feedback_id'] = value;
    this.setState({ ...this.state, input });
  }

  handleDropdownChangeRepresentationCurrentStateOptions = (e, { value }) => {
    const input = this.state.input;
    input['representation_current_state'] = value;
    this.setState({ ...this.state, input });
  }

  handleDropdownChangeRepresentationTargetStateOptions = (e, { value }) => {
    const input = this.state.input;
    input['representation_target_state'] = value;
    this.setState({ ...this.state, input });
  }

  handleDropdownChangeNudgeStatic = (e, { value }) => {
    const input = this.state.input;
    input['nudge_static_id'] = value;
    this.setState({ ...this.state, input });
  }

  handleDropdownChangeNudgeDynamic = (e, { value }) => {
    const input = this.state.input;
    input['nudge_dynamic_id'] = value;
    this.setState({ ...this.state, input });
  }

  onSubmitHandler = (ev) => {

    const BlockConfigVariables = {
      name: this.state.input.name,
      description: this.state.input.description,
      context: this.state.input.context_id,
      feedback: this.state.input.feedback_id,

      //clocktime: this.state.input.clocktime,
      chargeStatus: this.state.input.charge_status,
      chargeDistance: this.state.input.charge_distance,
      chargeCapacity: this.state.input.charge_capacity,
      energyPrice: this.state.input.energy_price,
      powerPrice: this.state.input.power_price,
      representationCurrentState: this.state.input.representation_current_state,

      flexibilityTimeRequest: this.state.input.flexibility_time_request,
      defaultChargeLevel: this.state.input.default_charge_level,
      timeToFullCharge: this.state.input.time_to_full_charge,
      //fullChargePrice: this.state.input.full_charge_price,
      minimumChargeLevel: this.state.input.minimum_charge_level,
      representationTargetState: this.state.input.representation_target_state,

      flexibilityTimeProvision: this.state.input.flexibility_time_provision,
      savedEmissions: this.state.input.saved_emissions,
      avoidedEnvironmentalCosts: this.state.input.avoided_environmental_costs,
      avoidedEnergyCosts: this.state.input.avoided_energy_costs,

      penaltyProbability: this.state.input.penalty_probability,
      penaltyAmount: this.state.input.penalty_amount,

      nudgeStatic: this.state.input.nudge_static_id,
      nudgeDynamic: this.state.input.nudge_dynamic_id,
    };

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
            Allgemein
            <Grid.Row columns={2} className={styles.row}>
              <Grid.Column className={styles.column}>
                <Input
                  id='name'
                  className={styles.inputField}
                  value={input.name}
                  type='text'
                  size='large'
                  fluid
                  required
                  placeholder='Name'
                  onChange={this.handleFieldChange}
                />
              </Grid.Column>
              <Grid.Column className={styles.column}>
                <Input
                  id='description'
                  className={styles.inputField}
                  value={input.description}
                  type='text'
                  size='large'
                  fluid
                  required
                  placeholder='Beschreibung'
                  onChange={this.handleFieldChange}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2} className={styles.row}>
              <Grid.Column className={styles.column}>
                <Dropdown
                   id="context"
                   className={styles.nameField}
                   options={this.state.contextOptions}
                   search
                   selection
                   fluid
                   placeholder='Kontext'
                   onChange={this.handleDropdownChangeContext}
                 />
              </Grid.Column>
              <Grid.Column className={styles.column}>
                <Dropdown
                   id="feedback"
                   className={styles.nameField}
                   options={this.state.feedbackOptions}
                   search
                   selection
                   fluid
                   placeholder='Feedback'
                   onChange={this.handleDropdownChangeFeedback}
                 />
              </Grid.Column>
            </Grid.Row>

            Aktueller Zustand/Paramter
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
                  placeholder='Ladezustand (aktuell) [0.xx]'
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
                  placeholder='Reichweite (aktuell) [km]'
                  onChange={this.handleFieldChange}
                />
              </Grid.Column>
              <Grid.Column className={styles.column}>
                <Input
                  id='charge_capacity'
                  className={styles.inputField}
                  value={input.charge_capacity}
                  type='text'
                  size='large'
                  fluid
                  required
                  placeholder='Gesamtkapazität [kWh]'
                  onChange={this.handleFieldChange}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2} className={styles.row}>
              <Grid.Column className={styles.column}>
                <Input
                  id='energy_price'
                  className={styles.inputField}
                  value={input.energy_price}
                  type='text'
                  size='large'
                  fluid
                  required
                  placeholder='Arbeitspreis [€/kWh]'
                  onChange={this.handleFieldChange}
                />
              </Grid.Column>
              <Grid.Column className={styles.column}>
                <Input
                  id='power_price'
                  className={styles.inputField}
                  value={input.power_price}
                  type='text'
                  size='large'
                  fluid
                  required
                  placeholder='Leistungspreis [€/kW]'
                  onChange={this.handleFieldChange}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2} className={styles.row}>
              <Grid.Column className={styles.column}>
                <Dropdown
                   id="representation_current_state"
                   className={styles.nameField}
                   options={this.state.representationCurrentStateOptions}
                   search
                   selection
                   fluid
                   placeholder='Repräsentation aktueller Zustand'
                   onChange={this.handleDropdownChangeRepresentationCurrentStateOptions}
                 />
              </Grid.Column>
              <Grid.Column className={styles.column}>
              </Grid.Column>
            </Grid.Row>

          Zielzustand
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
                placeholder='Flexibilitätsdauer (Anfrage) [min]'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
            <Grid.Column className={styles.column}>
              <Input
                id='default_charge_level'
                className={styles.inputField}
                value={input.default_charge_level}
                type='text'
                size='large'
                fluid
                required
                placeholder='Defaultladeziel [0.xx]'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
          </Grid.Row>


          <Grid.Row columns={2} className={styles.row}>
            <Grid.Column className={styles.column}>
              <Input
                id='minimum_charge_level'
                className={styles.inputField}
                value={input.minimum_charge_level}
                type='text'
                size='large'
                fluid
                required
                placeholder='Mindestladezustand [0.xx]'
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
                placeholder='Aufladezeit (voll) [min]'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2} className={styles.row}>
            <Grid.Column className={styles.column}>
              <Dropdown
                 id="representation_target_state"
                 className={styles.nameField}
                 options={this.state.representationTargetStateOptions}
                 search
                 selection
                 fluid
                 placeholder='Repräsentation Zielzustand'
                 onChange={this.handleDropdownChangeRepresentationTargetStateOptions}
               />
            </Grid.Column>
            <Grid.Column className={styles.column}>
            </Grid.Column>
          </Grid.Row>

          Nutzen
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
                placeholder='Provision für Flexibilitätsdauer [€/min]'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
            <Grid.Column className={styles.column}>
              <Input
                id='saved_emissions'
                className={styles.inputField}
                value={input.saved_emissions}
                type='text'
                size='large'
                fluid
                required
                placeholder='Eingesparte CO2-Emissionen [g]'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2} className={styles.row}>
            <Grid.Column className={styles.column}>
              <Input
                id='avoided_environmental_costs'
                className={styles.inputField}
                value={input.avoided_environmental_costs}
                type='text'
                size='large'
                fluid
                required
                placeholder='Vermiedene Umweltkosten [€]'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
            <Grid.Column className={styles.column}>
              <Input
                id='avoided_energy_costs'
                className={styles.inputField}
                value={input.avoided_energy_costs}
                type='text'
                size='large'
                fluid
                required
                placeholder='Vermiedene Energieausgleichskosten [€]'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
          </Grid.Row>

          Penalty
          <Grid.Row columns={2} className={styles.row}>
            <Grid.Column className={styles.column}>
              <Input
                id='penalty_probability'
                className={styles.inputField}
                value={input.penalty_probability}
                type='text'
                size='large'
                fluid
                required
                placeholder='Penalty-Wahrscheinlichkeit'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
            <Grid.Column className={styles.column}>
              <Input
                id='penalty_amount'
                className={styles.inputField}
                value={input.penalty_amount}
                type='text'
                size='large'
                fluid
                required
                placeholder='Penalty-Höhe'
                onChange={this.handleFieldChange}
              />
            </Grid.Column>
          </Grid.Row>

          Nudge
          <Grid.Row columns={2} className={styles.row}>
            <Grid.Column className={styles.column}>
              <Dropdown
                 id="nudge_static_name"
                 className={styles.nameField}
                 options={this.state.nudgeStaticOptions}
                 search
                 selection
                 fluid
                 placeholder='Statischer Nudge Name'
                 onChange={this.handleDropdownChangeNudgeStatic}
               />
            </Grid.Column>
            <Grid.Column className={styles.column}>
              <Dropdown
                 id="nudge_dynamic_name"
                 className={styles.nameField}
                 options={this.state.nudgeDynamicOptions}
                 search
                 selection
                 fluid
                 placeholder='Dynamischer Nudge Name'
                 onChange={this.handleDropdownChangeNudgeDynamic}
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
      contextConfigs{
        id
        name
      }
      feedbackConfigs{
        id
        name
      }
      nudgeStaticConfigs{
        id
        name
      }
      nudgeDynamicConfigs{
        id
        name
      }

    }
  `,
);
