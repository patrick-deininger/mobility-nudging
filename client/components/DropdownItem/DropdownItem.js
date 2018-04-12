import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { Button, Segment, Header, Item } from 'semantic-ui-react';
import styles from './DropdownItem.scss';


export default class DropdownItem extends React.Component {

  /*static propTypes = {
    bookImage: PropTypes.string,
    bookTitle: PropTypes.string,
    bookAuthor: PropTypes.string,
    onClick: PropTypes.func
  }*/

  render() {
    return (
      <div onClick={this.props.onClick} className={styles.flexcontainer}>
        <main className={styles.main}>
          <h1 className={styles.title}>{this.props.bookTitle}</h1>
          <h3 className={styles.author}>{this.props.bookAuthor}</h3>
        </main>
        <aside className={styles.picture}>
            <img size='small' src={this.props.bookImage}/>
        </aside>
      </div>
    );
  }
}
