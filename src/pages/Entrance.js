import React from 'react'
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import '../styles/form.css'

const homeAddress = 'http://192.168.0.102:3000/';

class Entrance extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: '',
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

    // функция входа в аккаунт
    entranceAccount = (e) => {
        e.preventDefault();

        const {email, password} = this.state;

        // вход
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(result => { 
                window.location.replace(homeAddress + 'main');
            },
                  error => {alert(error);})
        .catch(error => console.log.error);
    };

    render () {
        return (
            <div className="form">
                <div>
                    <h2>Вход</h2>
                    <form>
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
                        
                        <button onClick={this.entranceAccount}
                        >Войти</button>
                    </form>

                    <p><Link to="/registration">Регистрация</Link></p>
                </div> 
            </div>
        );
    }
}

export default Entrance;