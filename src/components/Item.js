import React from 'react';
import firebase from 'firebase';
import '../styles/item.css'

const homeAddress = 'http://192.168.0.102:3000/';

const Item = (props) => {

  const DoneBtn = () => (
    <div>
      {!props.task.done ?
        <span aria-label="done" role="img">
          ◻
        </span>:
        <span aria-label="done" role="img">
          ✔️
        </span>
      }
    </div>
  );

  const EditBtn = () => (
    <div>
      <span aria-label="edit" role="img" onClick={props.toEditItem}>
        ✏️
      </span>
    </div>
  );

  const DelBtn = () => (
    <div>
      <span aria-label="delete" role="img" onClick={props.deleteTask}>
        ❌
      </span>
    </div>
  );


  // function toEditItem() {
  //   const db = firebase.database();
  //   const uid = firebase.auth().currentUser.uid;
  //   db.ref('Users').child(uid).update({
  //     'editItem': props.task.key
  //   }).then(result=>{
  //     // {window.location.replace(homeAddress + 'editing')}
  //   })
  // }

  return (
    <div className={'item ' + (props.task.done ? 'checked' : '')}>

      <div className="ok" onClick={props.doneTask}>
        <DoneBtn />
        <p className = {(props.task.done ? 'through_line' : '')}>
          {props.task.nameItem}
        </p>
      </div>

      <div className="upd">
        <EditBtn />
        <DelBtn />
      </div>
      
    </div>
  );
};

export default Item;
