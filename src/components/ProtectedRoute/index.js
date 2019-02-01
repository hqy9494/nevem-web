import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from 'react-router-dom';

/* eslint-disable react/prop-types */
const ProtectedRoute = ({component, authenticate, failureRedirect, ...rest}) => {
  const authenticated = typeof authenticate === 'function' ? authenticate() : Boolean(authenticate);
  return (
    <Route {...rest} render={props => (
      authenticated ? (
        React.createElement(component, props)
      ) : (
        <Redirect to={{
          pathname: failureRedirect,
          state: {from: props.location}
        }}/>
      )
    )}/>
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
    PropTypes.object,
  ]),
  failureRedirect: PropTypes.string
};

ProtectedRoute.defaultProps = {
  authenticate: false,
  failureRedirect: '/login'
};

export default ProtectedRoute;
