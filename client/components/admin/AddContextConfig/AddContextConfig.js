import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';
import Template from 'components/Nudges/Template/Template'

import styles from './AddContextConfig.scss';

const CreateContextConfigMutation = graphql`
  mutation AddContextConfigMutation (
    $name: String!
    $description: String!
    $heading: String!
    $text: String!

  ) {
    createContextConfig(
      name: $name,
      description: $description,
      heading: $heading,
      text: $text,

    ) {
      contextConfig {
        id
      }
    }
  }
`;


class AddContextConfig extends React.Component {
  state = {
    input: {
      name: "",
      description: "",
      heading: "",
      text: "",

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

    const ContextConfigVariables = {
      name: this.state.input.name,
      description: this.state.input.description,
      heading: this.state.input.heading,
      text: this.state.input.text,

    };

    commitMutation(this.props.relay.environment, {
          mutation: CreateContextConfigMutation,
          variables: ContextConfigVariables,
          onCompleted: (resp) => {
            console.log("Created new ContextConfig")
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
            <Header as='h1'>Neue Context Konfiguration</Header>

          <div className={styles.form}>


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
  withAuth(AddContextConfig),
  graphql`
    fragment AddContextConfig_viewer on Viewer {
      ...Page_viewer

    }
  `,
);
