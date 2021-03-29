let userState;

if(window.localStorage.getItem('auth')){
  userState =JSON.parse(window.localStorage.getItem('auth'));
}
else{
  userState=null;  //{}
}
//Create user reducer function
// action is like {type:'LOGGED_IN_USER',payload:{name:'Manish Kumar',role:"SDE"}}
const authReducer = (state = userState, action) => {
    switch (action.type) {
      case "LOGGED_IN_USER":
        return { ...state, ...action.payload };
      case "LOGOUT":
        return action.payload;
      default:
        return state;
    }
  }

export default authReducer;