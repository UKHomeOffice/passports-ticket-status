'use strict';

const React = require('react');
const Merges = require('./merges');
const IssueTicket = require('./issue-ticket');
const CommitTicket = require('./commit-ticket');
const UpdatesTicket = require('./updates-ticket');
const _ = require('lodash');

class Tickets extends React.Component {
    areCellsAvailable(cells, x, y, yLast) {
        cells[x] = cells[x] || [];
        y = y || 0;
        yLast = yLast > y ? yLast : y;
        for (let yy = y; yy <= yLast; yy++) {
            if (cells[x][yy]) return true;
        }
    }

    nextAvailableBlock(cells, y, yLast) {
        let x = 0;
        while (this.areCellsAvailable(cells, x, y, yLast)) x++;
        return x;
    }

    lastCellInRow(cells, y) {
        let lastX = 0;
        for (let x = cells.length; x >= 0; x--) {
            if (cells[x] && cells[x][y]) break;
            lastX = x;
        }
        return lastX;
    }

    makeCellsUnavailable(cells, x, y, yLast, val) {
        cells[x] = cells[x] || [];
        for (let yy = y; yy <= yLast; yy++) cells[x][yy] = val || 1;
    }

    getTop(ticket) {
        return this.props.releaseIndexes[_.first(ticket.releases)] || 0;
    }

    getBottom(ticket) {
        return this.props.releaseIndexes[_.last(ticket.releases)] || 0;
    }

    getHeight(ticket) {
        return Math.max(this.getTop(ticket) - this.getBottom(ticket), 0);
    }

    render() {
        let tickets = _.values(this.props.tickets);

        // sort tickets by smallest first and then by name
        tickets = _.sortBy(tickets, 'id');
        tickets = _.sortBy(tickets, ticket => this.getHeight(ticket));

        let cells = [];

        return (
            <div className="tickets">
                { tickets.map(ticket => {
                    let TicketType = (ticket.status === 'NOTICKET') ? CommitTicket : IssueTicket;

                    let top = this.getTop(ticket);
                    let bottom = this.getBottom(ticket);
                    let left = this.nextAvailableBlock(cells, top, bottom);
                    this.makeCellsUnavailable(cells, left, top, bottom, ticket.id);

                    return (
                        <div key={ticket.id}>
                            <TicketType
                                ticket={ticket}
                                top={top}
                                bottom={bottom}
                                left={left} />
                            <Merges
                                merges={ticket.merges}
                                left={left}
                                releaseIndexes={this.props.releaseIndexes} />
                        </div>
                    );
                }) }
                { this.props.updates.map(update => {
                    let left = this.lastCellInRow(cells, update.top);
                    return (
                        <UpdatesTicket
                            key={update.releaseId}
                            updates={update.updates}
                            top={update.top}
                            bottom={update.top}
                            left={left} />
                    );
                })}
            </div>
        );
    }
}

module.exports = Tickets;
