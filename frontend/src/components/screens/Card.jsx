import { Link} from 'react-router-dom';
import React, { useState, useContext } from 'react';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../../App';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import { BiUserCircle } from 'react-icons/bi';
import {toast} from 'react-toastify';


const Card = (props) => {

  for(let comment in props.comments) {
    console.log(props.comments[comment].postedBy.name);
  }

  const [liketoggle, setLikeToggle] = useState(props.isLiked);

  const [commText, setCommText] = useState('');

  const { state, dispatch } = useContext(UserContext);

  const deletePost = (postid) => {
    console.log("delete is called")
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => props.updateHome(result))
  }

  const [comment, setComment] = useState(false);



  const makeComment = (text, postId) => {

    console.log('comment added')
    setCommText('')
    fetch('/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId,
        text
      })
    }).then(res => res.json()).then(result => {
      console.log(result)
      props.updateFunc(result);
    }).catch(err => console.log(err))
  }




  console.log(props.likes.indexOf(localStorage.getItem("user")._id))


  const likePost = (id) => {
    fetch('/like', {
      method: 'put',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id,
      })
    }).then(res => res.json()).then(result => {
      props.updateFunc(result);
    })
  }


  const unlikePost = (id) => {

    fetch('/unlike', {
      method: 'put',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id,
      })
    }).then(res => res.json()).then(result => props.updateFunc(result));

  }




  const toggleClick = (id) => {
    if (liketoggle) {
      setLikeToggle(false)
      unlikePost(id);

    }
    else {
      setLikeToggle(true);
      likePost(id);
      console.log(props.id);
    }


  }






  return (
    <>
      <div className=' container-fluid posts'>
        <div className='row'>
          <div className='col-md-6 post' style={{backgroundColor:'#23395b'}}>
            <div className='my-3 p-2'>
              <div className='float-end'>
                {(props.postedById === state._id) && <button className='btn btn-transparent' onClick={() => { deletePost(props.id) }}><DeleteRoundedIcon className='text-light'/></button>}
              </div>
              <Link style={{color:'white', fontSize:'35px'}} to={ (props.postedById !== state._id) ?`profile/${props.postedById}` :`profile` } className="btn">{props.postedBy}</Link>
              <p style={{color:'white',fontSize:'25px'}} className='my-3'>{props.body}</p>
            </div>
            <div className='image p-2'>
              <img className='w-50' src={props.photo} alt='thisImage' />
            </div>
            <h6 style={{color:'white',fontSize:'15px', marginTop:'10px'}}>{props.likes.length} like(s)</h6>
            <h6 style={{color:'white',fontSize:'15px'}}>{props.comments.length} comments</h6>

            <div className='p-2 d-flex justify-content-center'>
              {props.isLiked ? (<button className='m-2 btn btn-outline-warning' onClick={() => { toggleClick(props.id) }}><ThumbUpIcon /></button>) : (<button className='m-2 btn btn-outline-light' onClick={() => { toggleClick(props.id) }}><ThumbUpAltOutlinedIcon /></button>)}


              {
                (
                    <div className='d-flex'>
                    {/* <button className='m-2 btn btn-outline-light' onClick={() => { setComment(!comment)}}><CommentOutlinedIcon /></button> */}
                      <input type='text' value={commText} style={{ marginLeft: '100px' }} placeholder='comment here' onKeyPress={
                        (e) => {
                          e.key === 'Enter' ? makeComment(commText,props.id) : console.log('enter not pressed')
                        }
                      } onChange={(event) => { setCommText(event.target.value) }} className='form-control' />
                      <button className='m-2 btn btn-outline-light' onClick={() => { if(commText === '') {toast.error("Comment can't be empty" , {position:toast.POSITION.TOP_RIGHT}); return false;} makeComment(commText,props.id)}}><CommentOutlinedIcon /></button>
                    
                    </div>
                )
              }

            </div>
            <div className='col-md-4 comment-header'>
              <h3 style={{ alignSelf: 'center' }}>Comments</h3>
                {
                  props.comments.map((record, index) => {
                    return (
                      <div key={index} className='comment'>
                        <div className='comment-user'><BiUserCircle />{record.postedBy.name}</div>
                        {/* <h6 className=''> <span style={{ fontWeight: "500"}} className='border-bottom comment'></span>{record.text}</h6> */}
                        <div className='comment-text'>{record.text}</div>
                      </div>
                    )
                  })
                }
              </div>
          </div>
        </div>

      </div>



    </>
  );
}

export default Card;