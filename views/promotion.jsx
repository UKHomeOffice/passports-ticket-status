'use strict';

const React = require('react');
const ReleaseStatus = require('./release-status');

class Promotion extends ReleaseStatus {
    render() {
        return (
            <a href={this.props.promotion.link}
                target={'build-' + this.props.promotion.buildId}
                className={'env ' + this.props.promotion.envClass + (this.props.promotion.rough ? ' rough': '')}
                title={this.formatDate(this.props.promotion.timestamp)}>
                {this.props.promotion.env}</a>
        );
    }
}

module.exports = Promotion;
