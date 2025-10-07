<script lang="ts" setup>
import { ref } from 'vue'

const appLinks = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Lista de Recomendações',
    path: '/recomendacoes',
  },
];

const externalLinks = [
  {
    name: 'Canal',
    path: 'https://www.youtube.com/@MindtheHeadphone',
  },
];

// Mobile menu state
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header 
    class="side-padding py-4 sticky top-0 z-50 bg-background dark:bg-background-dark transition-all duration-300"
    role="banner"
  >
    <div class="max-w-7xl">
      <div class="flex justify-between items-center">
        <!-- Logo/Brand -->
        <RouterLink 
          to="/" 
          class="flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:ring-offset-2 rounded-lg transition-all duration-200"
          aria-label="Mind the Headphone - Home"
        >
          <h1 class="sr-only">Mind the Headphone</h1>
          <LogoMTH />
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav 
          class="hidden md:flex items-center space-x-6 lg:space-x-8"
          role="navigation"
          aria-label="Main navigation"
        >
          <RouterLink
            v-for="link in appLinks"
            :key="link.path"
            :to="link.path"
            class="text-text/80 dark:text-text-dark/80 hover:text-primary dark:hover:text-primary-dark font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:ring-offset-2 rounded-md px-3 py-2"
            active-class="text-primary dark:text-primary-dark font-semibold"
            exact-active-class="text-primary dark:text-primary-dark font-semibold"
          >
            {{ link.name }}
          </RouterLink>
          
          <a
            v-for="link in externalLinks"
            :key="link.path"
            :href="link.path"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text/80 dark:text-text-dark/80 hover:text-primary dark:hover:text-primary-dark font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:ring-offset-2 rounded-md px-3 py-2 flex items-center gap-2"
            aria-label="Visit our YouTube channel (opens in new tab)"
          >
            <span>{{ link.name }}</span>
            <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" aria-hidden="true" />
          </a>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-text dark:text-text-dark hover:text-primary dark:hover:text-primary-dark hover:bg-text/5 dark:hover:bg-text-dark/5 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:ring-offset-2 transition-colors duration-200"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          @click="toggleMobileMenu"
        >
          <Icon 
            :name="isMobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" 
            class="w-6 h-6" 
            aria-hidden="true"
          />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div 
          v-show="isMobileMenuOpen"
          id="mobile-menu"
          class="md:hidden bg-background dark:bg-background-dark"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div class="mt-4 space-y-1">
            <RouterLink
              v-for="link in appLinks"
              :key="link.path"
              :to="link.path"
              class="block px-3 py-2 rounded-md text-base font-medium text-text/80 dark:text-text-dark/80 hover:text-primary dark:hover:text-primary-dark hover:bg-text/5 dark:hover:bg-text-dark/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:ring-offset-2"
              active-class="text-primary dark:text-primary-dark font-semibold bg-primary/10 dark:bg-primary-dark/10"
              exact-active-class="text-primary dark:text-primary-dark font-semibold bg-primary/10 dark:bg-primary-dark/10"
              @click="closeMobileMenu"
            >
              {{ link.name }}
            </RouterLink>
            
            <a
              v-for="link in externalLinks"
              :key="link.path"
              :href="link.path"
              target="_blank"
              rel="noopener noreferrer"
              class="block px-3 py-2 rounded-md text-base font-medium text-text/80 dark:text-text-dark/80 hover:text-primary dark:hover:text-primary-dark hover:bg-text/5 dark:hover:bg-text-dark/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:ring-offset-2"
              aria-label="Visit our YouTube channel (opens in new tab)"
              @click="closeMobileMenu"
            >
              <span class="flex items-center gap-2">
                {{ link.name }}
                <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>
