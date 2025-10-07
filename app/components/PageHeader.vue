<template>
  <header class=" flex justify-between items-center">
    <RouterLink to="/" class="text-2xl font-bold">
      <!-- <img src="/img/mth-logo.png" alt="Mind the Headphone"> -->
      <span class="font-sans p-1.5 border border-text dark:border-text-dark">
        <span class="font-bold tracking-wider">MIND</span>
        <span class="font-thin tracking-wider">THE</span>
        <span class="font-bold tracking-wider">HEADPHONE</span>
      </span>
    </RouterLink>
    <nav>
      <RouterLink to="/" class="text-lg font-bold">
        Home
      </RouterLink>
      <RouterLink to="/recomendacoes" class="text-lg font-bold">
        Lista de Recomendações
      </RouterLink>
      <a href="https://www.youtube.com/@MindtheHeadphone" target="_blank" rel="noopener noreferrer">
        Canal
      </a>
    </nav>
  </header>
</template>