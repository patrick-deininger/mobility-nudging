import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';
import Template from 'components/Nudges/Template/Template'

import styles from './AddNudgeStaticConfig.scss';

const CreateNudgeStaticConfigMutation = graphql`
  mutation AddNudgeStaticConfigMutation (
    $name: String!
    $description: String!
    $heading: String!
    $text: String!
    $image: String!
  ) {
    createNudgeStaticConfig(
      name: $name,
      description: $description,
      heading: $heading,
      text: $text,
      image: $image
    ) {
      nudgeStaticConfig {
        id
      }
    }
  }
`;


class AddNudgeStaticConfig extends React.Component {
  state = {
    input: {
      name: "",
      description: "",
      heading: "",
      text: "",
      image: "",
    },
    errors: [],

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

    const NudgeStaticConfigVariables = {
      name: this.state.input.name,
      description: this.state.input.description,
      heading: this.state.input.heading,
      text: this.state.input.text,
      image: this.state.input.image,
    };

    commitMutation(this.props.relay.environment, {
          mutation: CreateNudgeStaticConfigMutation,
          variables: NudgeStaticConfigVariables,
          onCompleted: (resp) => {
            console.log("Created new NudgeStaticConfig")
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
            <Header as='h1'>Neue statische Nudge Konfiguration</Header>

          <div className={styles.form}>


          <Input
            id='name'
            className={styles.inputField}
            value={input.name}
            type='text'
            size='large'
            fluid
            required
            placeholder='Nudge Name'
            onChange={this.handleFieldChange}
          />

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

          <Input
            id='heading'
            className={styles.inputField}
            value={input.heading}
            type='text'
            size='large'
            fluid
            required
            placeholder='Überschrift'
            onChange={this.handleFieldChange}
          />

          <Input
            id='text'
            className={styles.inputField}
            value={input.text}
            type='text'
            size='large'
            fluid
            required
            placeholder='Text'
            onChange={this.handleFieldChange}
          />

          <Input
            id='image'
            className={styles.inputField}
            value={input.image}
            type='text'
            size='large'
            fluid
            required
            placeholder='Bildquelle'
            onChange={this.handleFieldChange}
          />

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

          <div className={styles.template}>
            <Template
              heading={this.state.input.heading}
              text={this.state.input.text}
              imagesrc={this.state.input.image}/>
          </div>

        </Segment>
      </div>
    </Page>
        )

      }
}

export default createRefetchContainer(
  withAuth(AddNudgeStaticConfig),
  graphql`
    fragment AddNudgeStaticConfig_viewer on Viewer {
      ...Page_viewer

    }
  `,
);
