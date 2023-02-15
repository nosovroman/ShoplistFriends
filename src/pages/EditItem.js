import React from 'react';
import firebase from 'firebase';
import Loader from '../components/Loader';
import '../styles/cancel.css'

const homeAddress = 'http://192.168.0.102:3000/';

var curListId, curItemId;
var db;
var uid;

class EditItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      input: '',
      loaded: false
    }
  }

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
        db = firebase.database();
        uid = firebase.auth().currentUser.uid;

        db.ref('Users').child(uid).once('value', snapshot => {
            curListId = snapshot.val().location;
            curItemId = snapshot.val().editItem;
        })
        .then( result => {
            db.ref('Lists').child(curListId).child('Items').child(curItemId)
            .on("value", itemSnapshot => {
              if (itemSnapshot.exists()) {
                this.setState({
                  input: itemSnapshot.val().nameItem,
                  loaded: true
                });
              }
              else {
                {window.location.replace(homeAddress + 'list')}
              }
            });
        },
        error => {
            alert(error);
        });
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  updateBtn = () => {
    const { input } = this.state;

    if (input) {
      db.ref('Lists').child(curListId).child('Items')
      .child(curItemId).update({
        'done': false,
        'nameItem': this.state.input
      }).then(result => {
        {window.location.replace(homeAddress + 'list')}
      });
    } else {
      alert("Нельзя сохранить продукт без названия");
    }
  }

  cancelBtn = () => {
    {window.location.replace(homeAddress + 'list')}
  }


  inputChange = event => {
    this.setState({ input: event.target.value });
  }

  render () {
    const { input } = this.state;
    if (this.state.loaded) {
      return(
        <div className="main">
        <div>
          <h3>Изменение параметров продукта</h3>
          <div className="forma">
            <input
                onChange={this.inputChange}
                placeholder={'Новое название продукта'}
                value={input}
            ></input>
            <button onClick={() => this.updateBtn()}>Обновить</button>
          </div>
          <button className="cancel_button" onClick={() => this.cancelBtn()}>Назад</button>
        </div>
        </div>
      );
    }
    else {
      return (<Loader />);
    }
  }
}

export default EditItem;