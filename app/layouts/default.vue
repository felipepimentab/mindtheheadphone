<template>
  <div class="bg-background dark:bg-background-dark text-text dark:text-text-dark grid grid-rows-[auto_1fr_auto] min-h-screen w-screen font-lexend">
    <PageHeader />
    <main class="side-padding">
      <slot/>
    </main>
    <PageFooter />
  </div>
</template>