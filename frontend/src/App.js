
import React,{useEffect,createContext,useReducer,useContext} from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Login from './components/screens/Login';
import {Route, BrowserRouter , Switch, useHistory} from 'react-router-dom' 
import FgtPass from './components/screens/FgtPass';
import Signup from './components/screens/Signup';
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Createpost from './components/screens/CreatePost';
import {reducer, initialState} from './reducers/userReducer';
import Individualprfle from './components/screens/Individualprfle';
import Subpost from './components/screens/Subpost'
export const UserContext = createContext()





const Routing = ()=>{
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext)
useEffect(()=>{
  const user = JSON.parse(localStorage.getItem("user"));
  if(user)
  {
    dispatch({type:"USER",payload:user})

  }
  else{
    history.push('/login')
  }
},[])
  return(
    <Switch>
      
    <Route exact path='/' component={Home} />
    <Route exact path='/forgot' component={FgtPass} />
    <Route exact path='/newaccount' component={Signup} />
    <Route exact path='/login' component={Login} />
    <Route exact path='/profile' component={Profile} />
    <Route exact path='/create' component={Createpost} />
    <Route exact path='/profile/:userid' component={Individualprfle} />
    <Route exact path='/subscribedposts' component={Subpost} />


  </Switch>

  )
}

function App(){
  const [state,dispatch] = useReducer(reducer,initialState)
  return(
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>

      <Routing />
      
      
      </BrowserRouter>
      </UserContext.Provider>

    
   
  );
}


export default App;


