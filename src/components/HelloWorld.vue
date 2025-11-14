
<template>
   <div class="container">
     <div class="page">
      <form class="user-form" @submit.prevent="addUser">
        <h1>Create User</h1>

        <label>
          Name
          <input v-model="name" type="text" placeholder="Enter name"/>
        </label>
        <div v-if="errors.name" class="error">{{ errors.name }}</div>

        <label>
          Email
          <input v-model="email" type="email" placeholder="Enter email" @input="clearEmailError"/>
        </label>
        <div v-if="errors.email" class="error">{{ errors.email }}</div>

        

        <label>
          Phone
        </label><vue-tel-input v-model="phone" placeholder="Enter phone number" defaultCountry="IN" />
        <div v-if="errors.phone" class="error">{{ errors.phone }}</div>




        <label>
          Role
          <select v-model="role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </label>

        <button type="submit">Create</button>
        <button v-if="users.length && isLoggedIn" type="button" @click="page = 'tabel', logout() " class="btn-secondary">
          View Users
        </button>
      </form>
    </div>
   </div> 
</template>

<script>
export default {
  name: 'Create',

  data() {
    return {
      name: '',
      email: '',
      phone:'',
      role: 'user',
      errors: {},
      users: [],
      editingId: null,
      editCache: {},
      search: '',
      page: localStorage.getItem('page') || 'form',
      api: 'http://localhost:3000/api/users',
    }
  },
created(){
console.log('created')
},
  computed: {
    filteredUsers() {
      const q = this.search.toLowerCase().trim()
      return q
        ? this.users.filter(u => u.name.toLowerCase().includes(q))
        : this.users
    },
    isLoggedIn() {
      return !!localStorage.getItem('loggedInUser');
    }
  },

  watch: {
    page(newPage) {
      localStorage.setItem('page', newPage)
    },
  },

  methods: {
    displayAdduser(){
    this.$router.push({ path: '/create' }) 
    },
    
    clearEmailError() {
      // Clear email error when user types
      if (this.errors.email) {
        delete this.errors.email;
      }
    },

    async checkEmailExists(email) {
      try {
        // Fetch all users to check if email exists
        const res = await fetch(this.api);
        const data = await res.json();
        const users = Array.isArray(data) ? data : [];
        
        // Check if email already exists in the database
        return users.some(u => u.email.toLowerCase() === email.toLowerCase());
      } catch (err) {
        console.error('Error checking email:', err);
        return false;
      }
    },

    async validate() {
      this.errors = {}
      if (!this.name.trim()) this.errors.name = 'Name is required'
      if (!this.email.trim()) {
        this.errors.email = 'Email is required'
      } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        this.errors.email = 'Email is invalid'
      } else {
        // Check if email already exists in database
        const emailExists = await this.checkEmailExists(this.email);
        if (emailExists) {
          this.errors.email = 'Email already exists';
        }
      }

      const numericPhone = this.phone.replace(/\D/g, ''); // remove non-digits
      if (!numericPhone || numericPhone.length < 10) {
        this.errors.phone = 'Valid phone number is required';
      } else if (/[a-zA-Z]/.test(this.phone)) {
        this.errors.phone = 'Phone number cannot contain letters';
      }

      const isValid = Object.keys(this.errors).length === 0;
      if (isValid) {
        this.$router.push({ path: '/user' });
      }
      return isValid;   
    },

    async fetchUsers() {
      try {
        const res = await fetch(this.api)
        const data = await res.json()
        this.users = Array.isArray(data)
          ? data.map(u => ({ id: u._id ?? u.id, ...u }))
          : []
      } catch (err) {
        console.error(err)
        alert('Failed to fetch users. Start backend server!')
      }
    },

    async addUser() {
      if (!(await this.validate())) return;
      try {
        localStorage.setItem('loggedInUser', JSON.stringify({
          name: this.name,
          email: this.email,
          phone: this.phone,
          role: this.role,
        }));

        await fetch(this.api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            phone: this.phone,
            role: this.role,
          }),
        });

        this.name = '';
        this.email = '';
        this.phone = '';
        this.role = 'user';

        await this.fetchUsers();
        this.page = 'table';
      } catch (err) {
        console.error(err);
        alert('Failed to save user.');
      }
    },

    async deleteUser(id) {
      if (!confirm('Are you sure you want to delete this user?')) return
      try {
        await fetch(`${this.api}/${id}`, { method: 'DELETE' })
        this.users = this.users.filter(u => u.id !== id)
      } catch (err) {
        console.error(err)
        alert('Failed to delete user.')
      }
    },

    editUser(u) {
      this.editingId = u.id
      this.editCache = { ...u }
    },

    async saveEdit(id) {
      try {
        await fetch(`${this.api}/${id}`,{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editCache),
        })
        this.editingId = null
        this.editCache = {}
        await this.fetchUsers()
      } catch (err) {
        console.error(err)
        alert('Failed to update user.')
      }
    },

    cancelEdit() {
      this.editingId = null
      this.editCache = {}
    },

     logout(){ 
      const storedUser = localStorage.getItem('loggedInUser')
      if(storedUser) {

        this.$router.push({path:'/user'})
      } else {

        localStorage.removeItem('loggedInUser')
        this.$router.push({path:'/'})
      }
    }
  },

  mounted() {
    this.fetchUsers()

    const storedUser = localStorage.getItem('loggedInUser')
    if (storedUser) {
      this.page = 'table'
    } else {
      this.page = 'form'
    }
  },
}
</script>

<style scoped>
@import '../assets/style.css';
</style>