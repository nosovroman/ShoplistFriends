import React from 'react'
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import '../styles/form.css'

const homeAddress = 'http://192.168.0.102:3000/';

class Registration extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                window.location.replace(homeAddress + 'main');
            }
        });
    }

    componentWillUnmount() {
        this.authSubscription();
    }

    // обработчик изменений email/pass
    handleChange = ({ target: {value, id}}) => {
        this.setState({
            [id]: value
        })
    };

    // функция регистрации аккаунта
    createAccount = (e) => {
        e.preventDefault();

        const {email, password} = this.state;

        // регистрация firebase
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(
                result => {
                    const db = firebase.database();
                    db.ref('Users').update({
                        [firebase.auth().currentUser.uid]: {
                            'email': email
                        }
                    }).then(
                        result => {
                            // переход на вход
                            window.location.replace(homeAddress+'entrance')
                        }

                    );
                },
                error => {
                    alert(error);
                }
            )
            .catch(error => console.log.error);
    };

    render () {
        return (
            <div className="form">
                <div>
                    <h2>Регистрация</h2>

                    <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Адрес эл. почты"
                        onChange={this.handleChange}
                    /> <br />
                    <input 
                        type="password"
                        id="password"
                        name="pass"
                        placeholder="Пароль"
                        onChange={this.handleChange}
                    /> <br />
                    
                    <button onClick={this.createAccount}
                    >Зарегистрироваться</button>

                    <p><Link to="/entrance">Уже есть аккаунт</Link></p>
                </div>
            </div>
        );
    }
}

export default Registration;