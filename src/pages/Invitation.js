import React from 'react';
import firebase from 'firebase';
import '../styles/cancel.css'
import Loader from '../components/Loader';

const homeAddress = 'http://192.168.0.102:3000/';

var curListId, curEmail;
var db;
var uid;
var nameList;

class Invitation extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      input: '',
      nameList: ''
    }
  }

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
        db = firebase.database();
        uid = firebase.auth().currentUser.uid;

        db.ref('Users').child(uid).once('value', snapshot => {
            curListId = snapshot.val().location;
            curEmail = snapshot.val().email;
        }).then(result => {
            db.ref('Users').child(uid).child('Lists')
            .child(curListId).once('value', snapshot => {
                this.setState({nameList: snapshot.val().nameList})
                nameList = snapshot.val().nameList;
            });
        });
    })
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  addUserBtn = (e) => {
    e.preventDefault();
    const { input } = this.state;
    var accessExist = false;
    var friendId = '';

    db.ref('Users').child(uid).on('value', snapshot => {
        if (snapshot.val().location == 'main') {
            window.location.replace(homeAddress + 'main');
        }
    });

    if (input) {
        if (input !== curEmail) {
            var listRef = db.ref('Lists').child(curListId);

            // сначала проверяем, нет ли уже данной почты в списке
            listRef.child('users')
            .once('value', snapshot => {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val() == input) {
                        accessExist = true;
                    }
                });
            }).then(
                result => {
                    if (!accessExist) {
                        // теперь проверяем существование данной почты
                        db.ref('Users').once('value', snapshot => {
                            snapshot.forEach(function (childSnapshot) {
                                if (childSnapshot.val().email == input) {
                                    friendId = childSnapshot.key;
                                }
                            });
                        }).then(result => {
                            // если зарегистрирован, разрешаем доступ
                            if (friendId) {
                                db.ref('Users').child(friendId)
                                .child('Lists').update({
                                    [curListId]: {
                                        'nameList': nameList
                                    }
                                }).then(result => {
                                    listRef.child('users').update({
                                        [friendId]: input
                                    });
                                    alert(`Пользователь ${input} получил доступ к списку "${this.state.nameList}"`)
                                    this.setState({input: ''})
                                });
                            } else {alert(`Пользователь ${input} не зарегистрирован`)}
                        
                        });
                    } else {alert(`У пользователя ${input} уже есть доступ к данному списку`)}    
                }
            );
        }
        else {
            alert('Нельзя добавить себя в свой же список');
        }
    }
  }

  cancelBtn = () => {
    window.location.replace(homeAddress + 'list')
  }

  inputChange = event => {
    this.setState({ input: event.target.value });
  }

  render () {
    const { input } = this.state;

    if (this.state.nameList) {
    return(
      <div className="main">
          <div>
                <h3>Приглашение</h3>
                <p>
                    Вы можете пригласить друга для совместного
                    редактирования вашего
                    списка <em>{this.state.nameList}</em>.
                </p>
                <div className="forma">
                    <input
                        onChange={this.inputChange}
                        placeholder={'Эл. почта пользователя'}
                        value={input}
                    ></input>
                        <button onClick={this.addUserBtn}>Готово</button>                    
                </div>
                <button className="cancel_button" onClick={() => this.cancelBtn()}>Назад</button>
            </div>
      </div>
    );
    } else {
        return(<Loader/>);
    }
  }
}

export default Invitation;