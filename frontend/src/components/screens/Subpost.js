import Card from './Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom';
import Homenav from './Homenav';
import {UserContext} from '../../App';
import TablePage from './TablePage';

const Home = (props) => {
  const history = useHistory();
  const [data,setData] = useState([]);
  const {state,dispatch} = React.useContext(UserContext)
  

    useEffect(()=>{


      

      fetch('/getsubpost',{
        method:"get",
        headers:{
          "Authorization":"Bearer "+localStorage.getItem("jwt"),
        }
      }).then(res=>res.json()).then(result=>{
        setData(result.posts)
      });
    },[])
    
    const updateHome = (result) =>{
      const newData = data.filter(item=>{
        return item._id !== result._id;
      })
      setData(newData);
    }

    const updateData = (result) =>{
      const newData = data.map((item)=>{
        if(item._id===result._id)
        {
          return result;
        }
        else{
          return item;
        }
      })
      setData(newData);
    }



  const createPost = () => {
    history.push('/create')
  }
  return (
    <>
    <div className='container-fluid'>
        <Homenav />
        <div className='row'>

        <div className='col-md-6 post' style={{backgroundColor:'#23395b'}}>
          <div className='p-3 text-center'>
          <button onClick={createPost} className='btn btn-warning' style={{width:'200px'}}>Create Post </button>
          </div>
        </div>
        
        </div>
    </div>

    <div className='animals-table'>
      <h1 style={{ color: '#ffc107'}}>Animals</h1>
      <TablePage />
    </div>

    {/* {
      data.length===0? ( <div className="d-flex justify-content-center mt-5" > 
     <div className="spinner-grow text-warning" style={{width: "10rem", height: "10rem"}} role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
</div>) :

      data.map(item=>{
        return (
          <Card body={item.body} postedBy={item.postedBy.name} photo={item.photo} key={item._id} 
          id={item._id}  likes={item.likes} isLiked={item.likes.includes(state._id)} 
          comments={item.comments} postedById={item.postedBy._id} updateFunc={updateData}
          updateHome={updateHome}
          />
        )
      })
    } */}
      

    </>
  )
}

export default Home;