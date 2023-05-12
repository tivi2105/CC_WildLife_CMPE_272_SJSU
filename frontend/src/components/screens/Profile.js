import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Homenav from './Homenav';
import 'bootstrap/dist/css/bootstrap.min.css';
import PopUpDailoge from './PopUpDailoge';
import Profilecards from './Profilecards';
import IconButton from '@material-ui/core/IconButton';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import imageCompression from "browser-image-compression";
import {toast} from 'react-toastify';
import {UserContext} from '../../App';
import {InputGroup,FormControl} from "react-bootstrap";

const Profile = () => {
  
  const [isOpen,setIsOpen] = useState(false);
  const [mypics,setPics] = useState([])
  const {state, dispatch} = useContext(UserContext);
  

  const [img, setImg] = useState({
    compressedLink : "",
  })
  
  
  

  useEffect(()=>{

    fetch('/mypost',{
      headers:{
        'Authorization':'Bearer '+localStorage.getItem('jwt')
      }
    }).then(res=>res.json())
    .then(result=>setPics(result))
  },[])

  
  const togglePopus = () => {
    setIsOpen(!isOpen);
  }


  const selectImage = e => {
    const imageFile = e.target.files[0];
    console.log(imageFile.size/1024/1024);
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 200,
      useWebWorker: true
    };
    

    if (imageFile.size / 1024 / 1024 <= 10) {
      imageCompression(imageFile, options).then(x => {
        console.log(x.size/1024/1024);
        setImg({
          compressedLink : URL.createObjectURL(x),
          compressedBlob : x,
        });
      })
    } else {
      toast.error('Select Image upto 10 Mb',{position:toast.POSITION.TOP_RIGHT});
      return 0;
    }

  };

  const updateData = () =>{
    
    if(img.compressedBlob){
    console.log(img.compressedBlob)
    const data = new FormData()
    data.append("file", img.compressedBlob)
    data.append("upload_preset", "social-web-app")
    data.append("cloud_name", "doidlafka")
    
    fetch("https://api.cloudinary.com/v1_1/doidlafka/image/upload", {
      method: "post",
      body: data
    }).then(res => res.json()).then((data) => {
      console.log("in thennn")
      localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
      dispatch({type:"UPDATEPIC",payload:data.url})

      fetch('/updatepic',{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+ localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          pic:data.url
        })
      }).then(res=>res.json()).then(result=>console.log(result))

    }).catch(err=>console.log(err));
  }
  }




  return(
    <>
    <Homenav />
    <div className='container-fluid'>
      <div className='row'>
        
        
        <div className='col-md-4 picture'>
          <img height='300px' width='300px' src={state ? state.pic : "loading"} alt='imaheHere'></img>
        </div>

        <div className='col-md-8 d-block'>
          
          <div className='d-flex'>
            <h3 className='m-4'>{state ? state.name : "wait.." }</h3>
            <Link className='m-4 fixed'><button className='btn btn-outline-warning' variant="contained"  onClick={togglePopus}>Edit Profile</button></Link> 
            {isOpen && <PopUpDailoge
              togglePopus = {togglePopus} content={<>
                
                <div className='text-center popupitems'>
                
                {
                  img.compressedLink ? (
                    <img src = {img.compressedLink} alt='imgaeHere' height="200px" width="200px" id='openImage'/>
                  ) : (
                    <img src = {state.pic} alt='imgaeHere' height="200px" width="200px" id='openImage'/>
                  )
                
                }

                
                <input accept="image/*" id="icon-button-file"
                  type="file" style={{ display: 'none' }} 
                  onChange={e => selectImage(e)}
                  />
                  <label htmlFor="icon-button-file">
                  <IconButton color="primary" aria-label="upload picture" 
                  component="span">
                    <PhotoCameraIcon className='btn-outline-light' style={{ fontSize: 40}}/>
                  </IconButton>
                </label>
                  
                </div>
                <div className='row'>
                <InputGroup className="p-3" size='lg'>
            <FormControl
              aria-label="Example text with button addon"
              aria-describedby="basic-addon1"
              placeholder='Password' 

              onFocus = {(e) => (e.target.placeholder = '')}
              onBlur = {(e) => e.target.placeholder = 'Password'}
              onChange = {(e) => {
                
              }}
            />
            
          </InputGroup>
                  
                </div>

                
                
              
                <br className='text-dark'></br>    

                <div className='row' id='accbtn'>
                  <button className='btn btn-warning' onClick={()=>{
                    updateData()
                    togglePopus()
                    
                    }}>Save</button>
                </div>     
              </>}
              
            />}
          </div>

          <div className='d-flex'>
            <p className='my-5 p-3'><strong>{mypics ? mypics.length : "wait.." }</strong> posts</p>
            <p className='my-5 p-3'><strong>{state ? state.followers.length : "0"}</strong> followers</p>
            <p className='my-5 p-3'><strong>{state ? state.following.length : "0"}</strong> following</p>
          </div>
            
          {/* <div>
            <p className='m-3'>someBioIfAnny</p>
            <p className='m-3'>someBioIfAnny</p>
          </div> */}
          
        </div>
        {/* <div className='border-light border-bottom my-4'></div> */}
      </div>
      <div className='row'>
            {
              
              mypics.map((item, index)=>{
                
                return <Profilecards key={index} url={item.photo} body={item.body}/> ;

              })
            }
            </div>
      
    </div>
    </>
  )
}

export default Profile;