import React from 'react';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import styles from './UserAvatar.scss';

export default class UserAvatar extends React.Component {

  static S3_BASE_URL = 'https://s3-eu-west-1.amazonaws.com';
  static S3_BUCKET = 'gutenberg-images';
  static S3_KEY_PREFIX = process.env.NODE_ENV === 'prod' ? 'profile' : 'dev/profile';

  static propTypes = {
    user: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      profileImage: PropTypes.string.isRequired,
    }),
    size: PropTypes.number,
    showPopup: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    size: 50,
    showPopup: false,
    className: ''
  }

  render() {
    const { user } = this.props;
    const profileImage = `${UserAvatar.S3_BASE_URL}/${UserAvatar.S3_BUCKET}/${UserAvatar.S3_KEY_PREFIX}/${user.profileImage}`;

    if (!this.props.showPopup) {
      return <div className={[styles.image, this.props.className].join(' ')} style={{ backgroundImage: `url(${profileImage})`, height: this.props.size, width: this.props.size }} />;
    }

    return (
      <Popup
        className={styles.root}
        position='top center'
        inverted
        trigger={
          <div className={[styles.image, this.props.className].join(' ')} style={{ backgroundImage: `url(${profileImage})`, height: this.props.size, width: this.props.size }} />
        }
      >
        <Popup.Content className={styles.tooltipHeader}>
          {`${user.firstName} ${user.lastName}`}
        </Popup.Content>
      </Popup>
    );
  }
}
