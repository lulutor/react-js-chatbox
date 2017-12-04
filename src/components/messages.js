import React from 'react';
import PropTypes from 'prop-types';
// Bootstrap components
import { Glyphicon } from 'react-bootstrap';

class Message extends React.Component {

    render() {
        let isUser = this.props.isUser( this.props.details.pseudo );
        return (
            <p className={ `message ${ isUser ? 'user-message' : 'not-user-message' }`}>
                <span className="author"><Glyphicon glyph='user' /> { isUser ? 'Me' : `${ this.props.details.pseudo }` }:</span>
                <br/>{ this.props.details.message }
            </p>
        );
    }

    static propTypes = {
        details: PropTypes.shape({
            pseudo: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired
        })
    }

}
export default Message;