import React from 'react';
import Formulaire from './formulaire';
import Message from './messages';
import database from '../database';
import PropTypes from 'prop-types';

//css
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import '../animation.css';

class App extends React.Component {

    state = {
        messages: {}
    }

    componentWillMount() {
        this.ref = database.syncState( '/', {
            context: this,
            state: 'messages'
        });
    }

    componentDidUpdate() {
       // Mettre le scroll en bas
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    }

    isUser( pseudo ) {
        // return false;
        return pseudo === this.props.match.params.pseudo;
    }

    addMessage( message ) {

        // copier le state
        const messages = { ...this.state.messages };

        // ajoute le timestamp
        const timestamp = Date.now();

        // creation du message unique
        messages[ `message-${ timestamp }` ] = message;


        const maxMessages = this.props.maxMessages || 10;
        Object.keys( messages )
            // selectionne les messages de la fin du tableau à la fin du tableau - le nombre maximum de messages
            .slice( 0, -( maxMessages ) )
            // pour chaque message a supprimer, attribue une value null
            .map( key => messages[ key ] = null );

        // met a jour le state
        this.setState( {  messages } );

    }

    render() {

        const messages = Object
            .keys( this.state.messages )
            .map( key =>
                <CSSTransition
                     key={ key }
                     classNames="message"
                     timeout={{ enter: 200, exit: 200 }}
                >
                <Message
                    key={ key }
                    details={ this.state.messages[ key ] }
                    isUser={ this.isUser.bind( this ) }
                />
                </CSSTransition>
            );

        return (
            <div className="box">
                <div className="messages" ref={ div => this.messagesDiv = div }>
                    <TransitionGroup
                        className="messages-container">
                        { messages }
                    </TransitionGroup>
                </div>
                <Formulaire
                    addMessage={ this.addMessage.bind( this ) }
                    pseudo={ this.props.match.params.pseudo }
                    length={ 200 }
                />
            </div>
        );
    }

    static propTypes = {
        maxMessages: PropTypes.number,
        match: PropTypes.shape({
            params: PropTypes.shape({
                pseudo: PropTypes.string.isRequired
            })
        })
    }
}
export default App;