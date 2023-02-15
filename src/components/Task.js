import React from 'react';
import firebase from 'firebase';
import '../styles/task.css'

const homeAddress = 'http://192.168.0.102:3000/';

const Task = (props) => {
  // const ActionBtn = () => (
  //   <div>
  //     <span aria-label="delete" role="img" onClick={props.deleteTask}>
  //         ❌
  //     </span>
  //     {/* {!task.done ? (
  //       <span aria-label="done" role="img" onClick={props.doneTask}>
  //         ✔️
  //       </span>
  //     ) : (
  //       <span aria-label="delete" role="img" onClick={props.deleteTask}>
  //         ❌🗑️
  //       </span>
  //     )} */}
  //   </div>
  // );

  // function toList() {
  //   const db = firebase.database();
  //   const uid = firebase.auth().currentUser.uid;
  //   db.ref('Users').child(uid).update({
  //     'location': props.task.key
  //   }).then(result=>{
  //     // console.log(this.props)
  //     // this.props.history.push('/list')
  //     // this.props.goToList;
  //     // {window.location.replace(homeAddress + 'list')}
  //   });
  // }

  return (/*+" id:" + props.task.key */
      <div className="task">
        <p onClick={props.goToList}>{props.task.value.nameList}</p> 
        <div onClick={props.deleteTask}>
          ❌
        </div>
        {/* {console.log(props)} */}
      </div>
  );
};

export default Task;
