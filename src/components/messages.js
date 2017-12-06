import React from 'react';
import PropTypes from 'prop-types';
// Bootstrap components
import { Glyphicon } from 'react-bootstrap';

class Message extends React.Component {

    render() {
        let isUser = this.props.isUser( this.props.details.email );
        return (
            <p className={ `message ${ isUser ? 'user-message' : 'not-user-message' }`}>
                <span className="author"><Glyphicon glyph='user' /> { isUser ? 'Me' : `${ this.props.details.email }` }:</span>
                <br/>{ this.props.details.message }
            </p>
        );
    }

    static propTypes = {
        details: PropTypes.shape({
            email: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired
        })
    }

}
export default Message;