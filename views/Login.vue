<template>
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
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const api = 'http://localhost:3000/api/users'

async function loginUser() {
  try {
    const res = await fetch(api)
    const users = await res.json()

    const foundUser = users.find(
      u => u.name.toLowerCase() === name.value.toLowerCase() &&
           u.email.toLowerCase() === email.value.toLowerCase()
    )

    if (foundUser) {
      alert(`Welcome back, ${foundUser.name}!`)
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser))
      router.push('/create')
    } else {
      alert('User not found! Please create a new account.')
    }
  } catch (err) {
    console.error(err)
    alert('Failed to fetch users. Start backend server!')
  }
}
</script>

<style scoped>

</style>
