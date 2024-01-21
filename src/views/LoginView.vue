<script setup lang="ts">
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const store = useStore()
const router = useRouter()

const email = ref<string>('')
const password = ref<string>('')
const error = ref<string | null>(null)

const login = () => {
  store
    .dispatch('login', {
      email: email,
      password: password
    })
    .then(() => {
      router.push({ name: '/' })
    })
    .catch((err) => {
      error.value = err.response.data.error
    })
}
</script>
<template>
  <div>
    <form @submit.prevent="login">
      <label for="email"> Email: </label>
      <input v-model="email" type="email" name="email" value />

      <label for="password"> Password: </label>
      <input v-model="password" type="password" name="password" value />

      <button type="submit" name="button">Login</button>

      <p>{{ error }}</p>

      <router-link to="/register"> Don't have an account? Register. </router-link>
    </form>
  </div>
</template>

<style scoped></style>
