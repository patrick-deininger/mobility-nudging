import React from 'react';
import styles from './Page.scss';
import Header from 'components/Header/Header';
import { graphql, createFragmentContainer } from 'react-relay';
import { Helmet } from 'react-helmet';

class Page extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <Helmet>
          <title>{this.props.title}</title>
        </Helmet>
        <Header viewer={this.props.viewer} activeGroup={this.props.activeGroup}/>
        <main className={styles.content}>
          {this.props.children}
        </main>
      </div>
    )
  }
}

export default createFragmentContainer(
  Page,
  graphql`
    fragment Page_viewer on Viewer {
      ...Header_viewer
    }
  `,
)
