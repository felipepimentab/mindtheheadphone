<template>
  <UContainer class="py-16 sm:py-24 lg:py-32 text-default">
    <ui-text type="h2">
      Você realmente consegue ouvir a diferença?
    </ui-text>
    <p>
      Todo mundo já viu alguém afirmar com certeza que
      <strong class="text-highlighted">LDAC soa muito melhor que MP3</strong>.
      Mas será que essa diferença é realmente perceptível em um teste cego?
    </p>
    <p>
      Nesta página, você pode colocar sua audição à prova.
    </p>
    <p>
      Você encontrará
      <strong class="text-highlighted">4 players com a mesma música</strong>,
      mas cada um pode estar reproduzindo o arquivo em
      <strong class="text-highlighted">LDAC ou MP3</strong>.
      A sua missão é simples:
      <strong class="text-primary-400">Ouça atentamente cada player e marque quais deles você acredita estar tocando a versão em LDAC</strong>.
    </p>
    <ui-text type="h2">
      Como o teste funciona
    </ui-text>
    <div class="flex flex-col gap-y-2">
      <UPageFeature
        icon="i-lucide-arrow-right"
        :ui="{
          title: 'text-default font-normal'
        }"
      >
        <template #title>
          Sempre existe pelo menos <strong class="text-highlighted">1 player em LDAC</strong> e <strong class="text-highlighted">1 em MP3</strong>
        </template>
      </UPageFeature>
      <UPageFeature
        icon="i-lucide-arrow-right"
        :ui="{
          title: 'text-default font-normal'
        }"
      >
        <template #title>
          A posição dos arquivos é <strong class="text-highlighted">embaralhada automaticamente</strong>
        </template>
      </UPageFeature>
      <UPageFeature
        icon="i-lucide-arrow-right"
        :ui="{
          title: 'text-default font-normal'
        }"
      >
        <template #title>
          Sempre que a página for recarregada ou você clicar em
          <strong class="text-highlighted">“Recomeçar”</strong>, uma nova combinação será criada
        </template>
      </UPageFeature>
      <UPageFeature
        icon="i-lucide-arrow-right"
        :ui="{
          title: 'text-default font-normal'
        }"
      >
        <template #title>
          O teste é totalmente cego: você só descobre o resultado no final ao clicar em
          <strong class="text-highlighted">"Ver resultados"</strong>
        </template>
      </UPageFeature>
    </div>
    <p>
      Isso significa que você <strong class="text-highlighted">não pode decorar a posição correta</strong> —
      a cada rodada, tudo muda.
    </p>
    <ui-text type="h2">
      Dicas para um resultado mais preciso
    </ui-text>
    <div class="flex flex-col gap-y-2">
      <UPageFeature
        title="Use um fone de boa qualidade"
        icon="i-lucide-headphones"
        :ui="{
          title: 'text-default font-normal'
        }"
      />
      <UPageFeature
        title="Faça o teste em um ambiente silencioso"
        icon="i-lucide-volume-x"
        :ui="{
          title: 'text-default font-normal'
        }"
      />
      <UPageFeature
        title="Ouça trechos com vocais, pratos, reverbs e microdetalhes"
        icon="i-lucide-speech"
        :ui="{
          title: 'text-default font-normal'
        }"
      />
      <UPageFeature
        title="Repita o mesmo trecho entre os players"
        icon="i-lucide-copy"
        :ui="{
          title: 'text-default font-normal'
        }"
      />
      <UPageFeature
        title="Evite volume muito alto"
        icon="i-lucide-volume-off"
        :ui="{
          title: 'text-default font-normal'
        }"
      />
    </div>
    <p>
      O objetivo aqui não é <strong class="text-highlighted">“acertar por sorte”</strong>, mas descobrir se a diferença entre os formatos é realmente audível para você.
    </p>
  </UContainer>
</template>

<style scoped>
h2 {
  margin-bottom: 2rem;
  margin-top: 2rem;
}
p {
  margin-bottom: 1rem;
  margin-top: 1rem;
}
</style>
