<template>
  <div class="container">
   

    <!-- TABLE PAGE -->
    <!-- <div class="page" v-if="page === 'table'" > -->
    <div class="page">
      <div class="users-table">
        <div class="table-header">
          <h2>Users</h2>

          <div class="search-bar">
            <input v-model="search" type="text" placeholder="Search by name..." class="search-input"/>
          </div>
          <button @click="displayAdduser" class="btn-back">Add User</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td>
                <input v-if="editingId === u.id" v-model="editCache.name" class="edit-input"/>
                <span v-else>{{ u.name }}</span>
              </td>

              <td>
                <input v-if="editingId === u.id" v-model="editCache.email" class="edit-input"/>
                <span v-else>{{ u.email }}</span>
              </td>
              
              <td>
                <vue-tel-input v-if="editingId === u.id" v-model="editCache.phone" defaultCountry="IN" class="edit-input"/>
                <span v-else>{{ u.phone }}</span>
              </td>

              <td>
                <select v-if="editingId === u.id" v-model="editCache.role" class="edit-select" >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
                <span v-else class="role-badge" :class="u.role">{{ u.role }}</span>
              </td>

              <td class="actions">
                <template v-if="editingId === u.id">
                  <button @click="saveEdit(u.id)" class="btn-save">Save</button>
                  <button @click="cancelEdit" class="btn-cancel">Cancel</button>
                </template>
                <template v-else>
                  <button @click="editUser(u)" class="btn-edit">Edit</button>
                  <button @click="deleteUser(u.id)" class="btn-delete">
                    Delete
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- <router-link to="/"> -->
          <div class="out">
            <button class="log-out" @click="logout">LogOut</button>
          </div>
        <!-- </router-link> -->

      </div>
      
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
    validate() {
      this.errors = {}
      if (!this.name.trim()) this.errors.name = 'Name is required'
      if (!this.email.trim()) this.errors.email = 'Email is required'
      else if (!/^\S+@\S+\.\S+$/.test(this.email))
        this.errors.email = 'Email is invalid'
      if (!this.phone || this.phone.length < 10) {
        this.errors.phone = 'Valid phone number is required';
      }

      const isValid = Object.keys(this.errors).length === 0;
      if (isValid) {
        this.$router.push({ path: '/user' });
      }
      return isValid;
      
    },

    async fetchUsers() {
      debugger
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
      if (!this.validate()) return;
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
          method: 'PATCH',
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
      localStorage.removeItem('loggedInUser')
      this.$router.push({path:'/'})
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



