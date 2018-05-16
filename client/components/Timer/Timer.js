import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form, Icon, Popup , TimePicker } from 'semantic-ui-react';
import { Link } from 'found';
import { DateTimePicker } from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css';
// import Globalize from 'globalize';
// import globalizeLocalizer from 'react-widgets-globalize';
import classNames from 'classnames';
import moment from 'moment'
import momentLocaliser from 'react-widgets-moment'
import styles from './Timer.scss';

momentLocaliser(moment)

class Timer extends React.Component {

  render() {

    return (
        <DateTimePicker className={styles.timepicker}
            time={true}
            date={false}
        />
    );
  }
}

export default Timer
