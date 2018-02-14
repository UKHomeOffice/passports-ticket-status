'use strict';

const React = require('react');
const Buildstatus = require('./build-status');

class PromoteLink extends Buildstatus {
    render() {
        return (
            <div className={'promote env ' + this.props.env}>
                <a target={'promote-' + this.props.env} href={this.props.link}>Promote to {this.props.env}</a>
            </div>
        );
    }
}

module.exports = PromoteLink;