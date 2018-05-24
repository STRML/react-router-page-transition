'use strict';
var React = require('react');
var CSSTransitionGroup = require('react-addons-css-transition-group');
var Router = require('react-router-component');
var assign = require('object.assign');

var AnimatedLocations = React.createClass({

    mixins: [Router.RouterMixin, Router.RouteRenderingMixin],

    propTypes: {
        component: React.PropTypes.node,
        popStateTransitionName: React.PropTypes.string,
        transitionEnter: React.PropTypes.bool,
        transitionLeave: React.PropTypes.bool,
        transitionName: React.PropTypes.string,
        transitionEnterTimeout: React.PropTypes.number,
        transitionLeaveTimeout: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            component: 'div'
        };
    },

    getRoutes: function () {
        return this.props.children;
    },

    render: function () {

        // If this is a popstate, we might want to do another transition (like a wipe back).
        var isPopState = this.state.navigation.isPopState;

        // Check if the enter/leave transitions should be enabled.
        // If this is a popstate, we enable the transitions if a popState transition was specified.
        // If it is a normal navigation, we run the transition unless the navigating element had the prop
        // `noTransition`.
        var enabled = isPopState ?
            !!this.props.popStateTransitionName :
            !this.state.navigation.noTransition;
        var props = {
            transitionEnter: enabled,
            transitionLeave: enabled,
            // default timeouts for react-css-transition-group ^0.14.8
            transitionEnterTimeout: 300,
            transitionLeaveTimeout: 300
        };

        // If this was a popState and we supplied a transition name, use it.
        if (isPopState && this.props.popStateTransitionName) {
            props.transitionName = this.props.popStateTransitionName;
        }
        // Otherwise, if the navigating component defined a transition name, use that.
        else if (this.state.navigation.transitionName) {
            props.transitionName = this.state.navigation.transitionName;
        }
        // Otherwise the default transition name (supplied as props) will be used.

        // transfer overwrite timeouts
        if (this.props.transitionEnterTimeout)
            props.transitionEnterTimeout = this.props.transitionEnterTimeout;

        if (this.props.transitionLeaveTimeout)
            props.transitionLeaveTimeout = this.props.transitionLeaveTimeout;

        // It's important to pass the key here so it is set on the handler. This way, the handler
        // gets blown away on navigation which causes the CSSTransitionGroup to properly animate.
        var handler = this.renderRouteHandler({key: this.state.match.path});
        return React.createElement(CSSTransitionGroup, assign({}, this.props, props), handler);
    }
});

module.exports = AnimatedLocations;
