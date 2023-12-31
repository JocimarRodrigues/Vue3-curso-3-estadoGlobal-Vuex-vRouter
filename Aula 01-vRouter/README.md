# Vue Router

- cmd para instalar npm i vue-router

# 1 Tu vai criar o roteador na pasta router/index.ts

Router/index.ts
```ts
import { createRouter, createWebHashHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router";
import Tarefas from '../views/Tarefas.vue'

const rotas: RouteRecordRaw[] = [{
    path: '/',
    name: 'Tarefas',
    component: Tarefas
}]

const roteador = createRouter({
    history: createWebHashHistory(),
    routes: rotas
})

export default roteador;
```

- Todas  as rotas que tu vai criar vai ser um objeto, dentro dele vai ter o caminho, name, component
- Na aula foi usado uma view para a rota principal

- RouteRecordRaw =>  É o tipo, a interface que representa cada rota da aplicação
- createWebHasHistory => Pelo q eu entendi isso é para definir para o navegador q todas as rotas depois do / Não é uma nova url, isso é não vai fazer uma nova req, ele vê q é uma ancora.

- Caso tu queira adicionar mais  rotas nesse roteador, basta abrir um novo objeto e definir o path,name,component novamente.

# 2 Precisa chamar esse roteaddor lá no main.ts(arquivo principal do projeto)

main.ts
```ts
import { createApp } from 'vue'
import App from './App.vue'
import roteador from './router/index'

import '@fortawesome/fontawesome-free/css/all.css'

createApp(App)
.use(roteador) // Aqui
.mount('#app')

```

# 3 Agora basta chamar o roteador com o RouterView no componente
App.vue
```vue
<template>
  <main class="columns is-gapless is-multiline" :class="{ 'modo-escuro': modoEscuroAtivo }">
    <div class="column is-one-quarter">
      <BarraLateral @aoTemaAlterado="trocarTema" />
    </div>
    <div class="column is-three-quarter conteudo">
      <!--Aqui vai a viw correspondente-->
      <RouterView></RouterView>
    </div>

  </main>
</template>
```
- Note que tu não precisa importar o RouterView

# View x Component

- As Views são as páginas em si. Normalmente uma view está relacionada diretamente a uma ou mais rotas da nossa aplicação.

- Os componentes em si são as partes menores e reaproveitáveis.

# Depois de criar o roteador, fica bem mais tranquilo criar uma nova rota.

roteador/index.ts
```ts
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Tarefas from '../views/Tarefas.vue'
import Projetos from '../views/Projetos.vue'

const rotas: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Tarefas',
    component: Tarefas
  },
  { // Nova rota
    path: '/projetos',
    name: 'Projetos',
    component: Projetos
  }
]

const roteador = createRouter({
  history: createWebHashHistory(),
  routes: rotas
})

export default roteador

```

- Aí basta criar a view

Projetos
```vue
<template>
    <h1>Projetos</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ProjetosView'
})
</script>
```

# Criando navbar/links

BarraLateral.vue
```vue
<template>
    <header>
        <h1><img src="../assets/logo.png" alt="Logo alura  tracker"></h1>
        <button class="button" @click="alterarTema">{{ textoBotao }}</button>
        <nav class="panel mt-5">
            <ul>
                <li>
                    <router-link to="/" class="link"> <!--Aqui-->
                        <i class="fas fa-tasks"></i>
                        tarefas
                    </router-link>
                </li>
                <li>
                    <router-link to="/projetos" class="link">
                        <i class="fas fa-project-diagram"></i>
                        tarefas
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>
```

- O router-link, funciona da mesma forma q o Link do react-router-dom
- Na lógica q tu criou acima, quando tu clicar em cada icone, vai ser direcionado pra rota correspondente

# Documentação oficial do router--vue

- https://router.vuejs.org/guide/

# Criando página de projetos

Projetos.vue
```vue
<template>
    <section class="projetos">
        <h1 class="title">Projetos</h1>
        <form @submit.prevent="salvar"> <!--Aqui-->
            <div class="field">
                <label for="nomeDoProjeto" class="label">
                    Nome do Projeto
                </label>
                <input 
                type="text" 
                class="input" 
                v-model="nomeDoProjeto" 
                id="nomeDoProjeto"
                /> <!--v-model aqui-->
            </div>
            <div class="field">
                <button class="button" type="submit">
                    Salvar
                </button>
            </div>
            <table class="table is-fullwidth">
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            Bine
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="projeto in projetos" :key="projeto.id">
                        <td>
                            {{ projeto.id }}
                        </td>
                        <td>{{ projeto.nome }}</td>
                    </tr>
                </tbody>
            </table>
        </form>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type IProjeto from '../interfaces/IProjeto'

export default defineComponent({
    name: 'ProjetosView',
    data() {
        return {
            nomeDoProjeto: '',
            projetos: [] as IProjeto[]
        }
    },
    methods: {
        salvar() {
            const projeto: IProjeto = {
                nome: this.nomeDoProjeto,
                id: new Date().toISOString()
            }
            this.projetos.push(projeto)
            this.nomeDoProjeto = ''
        }
    }
})
</script>

<style scoped>
.projetos {
    padding: 1.25rem;
}

</style>
```

- Sobre o código acima oq tu pode acrescentar é a vorma q tu trabalha com o form, usando v-model para atribuir o valor do input na variável e o submit.prevent q é para impedir o comportamento padrao de um submit(Recarregar a página)