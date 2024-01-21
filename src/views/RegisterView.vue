<script setup lang="ts">
import store from './../vuex/store'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const { push } = useRouter()

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const errors = ref<string[] | null>(null)

const register = () => {
  store
    .dispatch('register', {
      name: name,
      email: email,
      password: password
    })
    .then(() => {
      push({ name: 'home' })
    })
    .catch((err) => {
      console.log(err)
      errors.value = err.response.data.error
    })
}
</script>
<template>
  <div>
    <form @submit.prevent="register">
      <label for="name"> Name: </label>
      <input v-model="name" type="text" name="name" />
      <label for="email"> Email: </label>
      <input v-model="email" type="email" name="email" />
      <label for="password"> Password: </label>
      <input v-model="password" type="password" name="password" />
      <button type="submit" name="button">Register</button>
      {{ name + email + password }}
      <ul>
        <li v-for="(error, index) in errors" :key="index">
          {{ error }}
        </li>
      </ul>

      <router-link to="/login"> Already have an account? Login. </router-link>
    </form>
  </div>
</template>

<style scoped></style>
