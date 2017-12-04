import React from 'react';
import PropTypes from 'prop-types'

// Bootstrap components
import { FormGroup, InputGroup, FormControl, Button, Form, HelpBlock, Glyphicon } from 'react-bootstrap';


// CONSTANTS
import { FEEDBACKFORM } from '../constants';


class Connexion extends React.Component {

    state = {
      pseudo:''
    };

    goToChat( event ) {

        event.preventDefault();

        if( this.getValidationState() ===  FEEDBACKFORM.SUCCESS ) {
            // get the pseudo from the input form
            const pseudo = this.pseudoInput.value;

            // change url
            let url = `/pseudo/${ pseudo }`;
            this.props.history.push( url );
            // window.location.assign( url );
        }
    };

    getValidationState() {
        const length = this.state.pseudo.length;
        if ( length > 3 )       return FEEDBACKFORM.SUCCESS;
        else if (length > 0)    return FEEDBACKFORM.ERROR;
        else                    return null;
    }

    handleChange( event ) {
        this.setState( { pseudo: event.target.value } );
    }

    render() {
        return (
            <div id="page-connection" className="page full-page">
                <div className="page-box-max">
                    <h1>Prstbt ChatBox</h1>
                    <Form onSubmit={ this.goToChat.bind( this ) }>
                        <FormGroup validationState={ this.getValidationState() }>
                            <InputGroup>
                                <InputGroup.Addon><Glyphicon glyph="user" /></InputGroup.Addon>
                                <FormControl type="text"
                                             placeholder="Pseudo"
                                             required
                                             inputRef={ input => { this.pseudoInput = input } }
                                             value={ this.state.pseudo }
                                             onChange={ this.handleChange.bind( this ) }
                                />
                            </InputGroup>
                            <FormControl.Feedback  />
                            <HelpBlock>Ton pseudo doit avoir au moins une longueur de 3 caracteres</HelpBlock>
                        </FormGroup>
                        <Button bsStyle="primary"
                                bsSize="large"
                                block
                                type="submit">Go</Button>
                    </Form>
                </div>
            </div>
        );
    }

    // because it's called 'withRouter' by the app
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

}
export default Connexion;