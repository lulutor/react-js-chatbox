import React from 'react';
import PropTypes from 'prop-types';
// Bootstrap components
import { Form, FormGroup, FormControl, ControlLabel, Button, Glyphicon } from 'react-bootstrap';

class Formulaire extends React.Component {

    state = {
      length: this.props.length
    };

    createMessage( event ) {

        event.preventDefault();

        const message = {
            message: this.message.value,
            pseudo: this.props.pseudo
        };

        this.props.addMessage( message );


        document.getElementById( this.messageForm.props.id ).reset();

        this.setState( { length: this.props.length } );

    }

    updateCounter( event ) {
        const length = this.props.length - this.message.value.length;
        this.setState( { length } );
    }

    onKeyDown( event ) {
        // pressing enter
        if( event.keyCode === 13 ) {
            // with alt key or ctrl key
            if( event.altKey || event.ctrlKey ) {
                // add a line
                this.message.value += '\n';
            }
            else {
                // just enter: send the message
                this.createMessage( event );
            }
        }

    }

    render() {

        return (
            <Form
                id='writingForm'
                className="form"
                ref={ form => this.messageForm = form }
                onSubmit={ this.createMessage.bind( this ) }
            >

                <FormGroup controlId="formControlsTextarea">
                    <ControlLabel>Your message <span className="info">{ this.state.length }</span></ControlLabel>
                    <FormControl
                        onKeyDown={ this.onKeyDown.bind( this )  }
                        required
                        maxLength={ this.props.length }
                        inputRef={ msg => this.message = msg }
                        onChange={ this.updateCounter.bind( this ) }
                        componentClass="textarea"
                        placeholder="What's up dude?!" />
                </FormGroup>
                <Button bsStyle="primary"
                        bsSize="large"
                        block
                        type="submit"><Glyphicon glyph="send" /> &nbsp; SEND</Button>

            </Form>
        );

    }

    static propTypes = {
        addMessage: PropTypes.func.isRequired,
        pseudo: PropTypes.string.isRequired,
        length: PropTypes.number.isRequired
    };

}
export default Formulaire;