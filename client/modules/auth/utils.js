import React, { Component } from 'react';
import { hasValidJwtToken } from './jwtUtils';

export const postAuthRoute = '/'



export function isAuthenticated(ComposedClass) {
  // Higher order component used to check if the user is authenticated
  class isAuthenticated extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isAuthenticated: false,
        isAdmin: false
      };
    }

    componentWillMount() {
      const parsedToken = hasValidJwtToken().parsedToken;
      if (parsedToken) {
        this.setState({ isAuthenticated: true });
        if (parsedToken.is_superuser) {
          this.setState({ isAdmin: true });
        }
      }
      if (!parsedToken) {
        this.setState({ isAuthenticated: false });
      }
    }

    render() {
      const { isAdmin, isAuthenticated } = this.state;
      return (<ComposedClass
        isAdmin={isAdmin}
        isAuthenticated={isAuthenticated} {...this.props}
      />);
    }

  }

  return isAuthenticated;
}


export function withAuth(ComposedClass, requireAuth = true) {
  class RequireAuth extends Component {

    constructor(props) {
      super(props)
      this.state = {
        shouldRedirect: true
      };
    }

    componentWillMount() {
      const { router, isAuthenticated } = this.props;
      if (!requireAuth && isAuthenticated) {
        router.push(postAuthRoute);
      } else if (requireAuth && !isAuthenticated) {
        router.push('/login');
      } else {
        this.setState({ shouldRedirect: false })
      }
    }

    render() {
      return (
        <div>
          { this.state.shouldRedirect ? null : <ComposedClass {...this.props} /> }
        </div>
      )
    }

  }

  return isAuthenticated(RequireAuth)
}
