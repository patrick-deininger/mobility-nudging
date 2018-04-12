import React from 'react';
import { Popup, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import styles from './GroupInvitationButton.scss';

export default class UserAvatar extends React.Component {

  static propTypes = {
    size: PropTypes.number,
    showPopup: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func
  }

  static defaultProps = {
    size: 50,
    showPopup: true,
    className: '',
    onClick: () => {}
  }

  render() {
    if (!this.props.showPopup) {
      return <div className={[styles.image, this.props.className].join(' ')} style={{ height: this.props.size, width: this.props.size }} />;
    }

    return (
      <Popup
        position='top center'
        inverted
        trigger={
          <Button onClick={this.props.onClick} className={[styles.button, this.props.className].join(' ')} icon circular style={{ width: 50, height: 50 }}>
            <Icon name='add' size='large'/>
          </Button>
        }
      >
        <Popup.Content>
          Invite people
        </Popup.Content>
      </Popup>
    );
  }
}
