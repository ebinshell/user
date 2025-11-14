<template>
  <div class="flex">
    <div class="login-container">
    <h2>User Login</h2>

    <form @submit.prevent="loginUser">
      <input v-model="name" type="text" placeholder="Enter your Name" required />
      <input v-model="email" type="email" placeholder="Enter your Email" required />
      <button type="submit">Log In</button>

      <p>
        Don't have an account?
        <router-link to="/create">Create User</router-link>
      </p>
    </form>
  </div>
  </div>

</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      name: '',
      email: '',
      api: 'http://localhost:3000/api/users'
    }
  },
  methods: {
    async loginUser() {
      try {
        const res = await fetch(this.api)
        const users = await res.json()

        const foundUser = users.find(
          u =>
            u.name.toLowerCase() === this.name.toLowerCase() &&
            u.email.toLowerCase() === this.email.toLowerCase()
        )

        if (foundUser) {
          alert(`Welcome back, ${foundUser.name}!`)
          localStorage.setItem('loggedInUser', JSON.stringify(foundUser))
          this.$router.push({ path: '/user' }) 
        } else {
          alert('User not found! Please create a new account.')
          this.$router.push({ path: '/create' })
        }
      } catch (err) {
        console.error(err)
        alert('Failed to fetch users. Start backend server!')
      }
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
body {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex{
  display: flex;
  justify-content: center;
  margin: 80px auto;
}
.login-container {
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  width: 350px;
  text-align: center;
}
.login-container h2 {
  margin-bottom: 20px;
  color: #2d3436;
}
.login-container input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #b2bec3;
  border-radius: 5px;
  font-size: 14px;
}
.login-container button {
  width: 100%;
  padding: 10px;
  background-color: #0984e3;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.login-container button:hover {
  background-color: #74b9ff;
}
p {
  margin-top: 10px;
}
</style>
