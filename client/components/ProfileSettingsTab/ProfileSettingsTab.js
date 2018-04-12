import React from 'react';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay';
import PropTypes from 'prop-types';
import { withAuth } from 'modules/auth/utils';
import Dropzone from 'react-dropzone';
import { Modal, Icon, Button, Header, Form } from 'semantic-ui-react';
import { hasValidJwtToken } from 'modules/auth/jwtUtils';

import UserAvatar from '../UserAvatar/UserAvatar';

import styles from './ProfileSettingsTab.scss';

const UpdateUserMutation = graphql`
  mutation ProfileSettingsTab_UpdateUser_Mutation(
    $userIdInput: ID!, $firstNameInput: String!, $lastNameInput: String!
  ) {
    updateUser(userId: $userIdInput, firstName: $firstNameInput, lastName: $lastNameInput) {
      user {
        id
      }
    }
  }
`;

class ProfileSettingsTab extends React.Component {
  static defaultProps = {
    visible: true
  };

  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    visible: PropTypes.bool
  }

  state = { user: Object.assign({}, this.props.viewer.user), droppedFiles: [], success: false, accept: '', files: [], dropzoneActive: false, uploading: false }

  onDragEnter = () => {
    this.setState({ ...this.state, dropzoneActive: true });
  }

  onDragLeave = () => {
    this.setState({ ...this.state, dropzoneActive: false });
  }

  onDrop = (files) => {
    this.setState({ ...this.state, files });
  }

  handleChange = (e, { value }) => {
    const name = e.target.name;
    const { user } = this.state;
    user[name] = value;
    this.setState({ ...this.state, user });
  }

  handleSave = () => {
    const { user } = this.props.viewer;
    const variables = {
      userIdInput: user.id,
      firstNameInput: this.state.user.firstName,
      lastNameInput: this.state.user.lastName
    };

    commitMutation(this.props.relay.environment, {
      mutation: UpdateUserMutation,
      variables,
      onCompleted: () => {
        if (this.state.success) {
          return;
        }
        this.setState({ ...this.state, success: true });
        setTimeout(() => {
          this.setState({ ...this.state, success: false });
        }, 2000);
      }
    });
  }

  // Wrapping of async arrow function needs to happen since 'this' won't be resolved
  // correctly caused by a bug in react-hot-loader.
  handleProfileImageSave = () => (async () => {
    const file = this.state.files[0];
    window.URL.revokeObjectURL(file.preview);

    this.setState({ ...this.state, uploading: true });

    // Acquire presigned url from backend.
    let response = await fetch(`/s3/sign?localName=${file.name}`, {
      method: 'get',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${hasValidJwtToken().token}`,
      },
    });
    const payload = await response.json();

    // Upload image to S3.
    response = await fetch(payload.url, {
      method: 'put',
      body: file
    });

    // Register uploaded image with backend.
    response = await fetch(`/s3/register?assetName=${payload.filename}`, {
      method: 'get',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${hasValidJwtToken().token}`,
      },
    });

    const filename = payload.filename;

    if (response.status === 200) {
      const { user } = this.state;
      user.profileImage = filename;
      this.setState({ ...this.state, uploading: false, user });
    }
  })();

  render() {
    const { user } = this.state;
    const { visible } = this.props;
    if (!visible) {
      return null;
    }

    return (
      <div className={styles.root}>
        <div className={styles.overlayContainer}>
          <UserAvatar user={user} size={200} />
          <Modal
            size='small'
            dimmer='blurring'
            trigger={
              <div className={styles.overlayWrap}>
                <Icon name='write' size='huge' />
              </div>
            }
          >
            <Modal.Header>Change Image</Modal.Header>
            <Modal.Content>
              <div className={styles.clearfix}>
                <Dropzone
                  accept='image/jpeg,image/png'
                  multiple={false}
                  onDrop={this.onDrop}
                  onDragEnter={this.onDragEnter}
                  onDragLeave={this.onDragLeave}
                  className={styles.dropzone}
                >
                  { this.state.files.length > 0 ?
                    <img width='200' className={styles.profileImagePreview} alt='Profile preview' src={this.state.files[0].preview} />
                  :
                  this.state.dropzoneActive ? 'Release to drop' : 'Click or drop image here' }
                </Dropzone>
                <Button className={styles.saveImage} onClick={this.handleProfileImageSave} color='green' loading={this.state.uploading}>Update image</Button>
              </div>
            </Modal.Content>
          </Modal>
        </div>
        <Form className={styles.profileInfo}>
          <Form.Group>
            <Form.Input placeholder='First name' label='First name' name='firstName' value={user.firstName} onChange={this.handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Input placeholder='Last name' label='Last name' name='lastName' value={user.lastName} onChange={this.handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Input placeholder='E-Mail' label='E-Mail' name='email' disabled value={user.email} onChange={this.handleChange} />
          </Form.Group>
          { this.state.success ?
            <Button color='green'>
              <Icon name='check' />Changes saved
            </Button>
          :
            <Button onClick={this.handleSave} color='green'>Save changes</Button>
          }
        </Form>
      </div>
    );
  }
}

export default createFragmentContainer(ProfileSettingsTab, graphql`
  fragment ProfileSettingsTab_viewer on Viewer {
    user {
      id
      firstName
      lastName
      dateJoined
      email
      profileImage
    }
  }
`);
