import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import HelloWorld from '../components/HelloWorld.vue' 
import userDetails from '../components/userDetails.vue'



const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/create', name: 'Create', component: HelloWorld },
  { path: '/user', name:'user' , component:userDetails}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})



router.beforeEach((to,from,next)=>{
  const loggedInUser = localStorage.getItem("loggedInUser")

  if(!loggedInUser && to.path == '/user') {
    return next ('/create')
  }

  // if(loggedInUser && to.path === '/'){
  //   return next ('/create')
  // }

 
  next()

})



window.history.pushState(null, null, window.location.href)
window.onpopstate = function () {
window.history.go(1)
}

export default router
