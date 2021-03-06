import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../hoc/axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import checkValidity from '../../../hoc/checkValidity/checkValidity';

class ContactData extends Component {
    constructor(props){
        super(props);
        this.state = {
            orderForm: {
                name: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Name',
                    },
                    value: '',
                    validation: {
                        required: true,
                        type: 'text',
                    },
                    valid: false,
                    touched: false,
                },
                street: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Street',
                    },
                    value: '',
                    validation: {
                        required: true,
                        type: 'alphanumeric',
                    },
                    valid: false,
                    touched: false,
                },
                zipCode: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'ZIP Code',
                    },
                    value: '',
                    validation: {
                        required: true,
                        length: 5,
                        type: 'number',
                    },
                    valid: false,
                    touched: false,
                },
                country: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Country',
                    },
                    value: '',
                    validation: {
                        required: true,
                        type: 'text',
                    },
                    valid: false,
                    touched: false,
                },
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'Your Email',
                    },
                    value: '',
                    validation: {
                        required: true,
                        type: 'email',
                    },
                    valid: false,
                    touched: false,
                },
                deliveryMethod: {
                    elementType: 'select',
                    elementConfig: {
                        options: [
                            { value: 'fastest', displayValue: 'Fastest' },
                            { value: 'cheapest', displayValue: 'Cheapest' },
                        ],
                    },
                    value: 'cheapest',
                    valid: true,
                    touched: true,
                },
            },
            formIsValid: false,
        };
    };

    orderHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[
                formElementIdentifier
            ].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId,
        };
        this.props.onOrderBurger(order, this.props.token);
    };

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm,
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier],
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = updatedFormElement.validation
            ? checkValidity(event.target.value, updatedFormElement.validation)
            : true;
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        const validityArr = [];
        for (let category in this.state.orderForm) {
            validityArr.push(this.state.orderForm[category].valid);
        }
        this.setState({
            orderForm: updatedOrderForm,
            formIsValid: validityArr.every(l=>l),
        });
    };

    componentDidMount() {
        const formElement = document.getElementById('formElement');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key],
            });
        }
        let form = (
            <form 
                id="formElement"
                onSubmit={this.orderHandler}
            >
                {formElementsArray.map((formElement) => (
                    <Input
                        key={formElement.id}
                        valid={formElement.config.valid}
                        touched={formElement.config.touched}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => {
                            this.inputChangedHandler(event, formElement.id)
                        }
                        }
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>
                    Submit
                </Button>
            </form>
        );
        if (this.props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Information</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.ingrs,
        price: state.price,
        loading: state.orders.loading,
        token: state.auth.token,
        userId: state.auth.userId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onOrderBurger: (orderData, token) => 
            dispatch(actions.purchaseBurger(orderData, token)),
        
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withErrorHandler(ContactData, axios));
