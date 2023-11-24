# this.router.push

- Serve para redirecionar o usuario para uma outra rota

FormularioView.vue
```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
    name: 'FormularioViw',
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            this.store.commit('ADICIONA_PROJETO', this.nomeDoProjeto)
            this.nomeDoProjeto = '',
            this.$router.push('/projetos') // Aqui
        },
    },
    setup() {
        const store = useStore();
        return {
            store
        }
    }
})
</script>
```

- Ao final da funcao salvar() q está usando uma mutation o método router.push vai redirecionar o usuario para a rota /projetos

# Usando parametros como id para as rotas

- Para fazer isso tu vai definir os : depois da parra para informar q vai ir um parametro para a rota, tu faz isso no router
- Depois basta usar o v-bind para passar o parametro com o ts

router.ts
```ts
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Tarefas from '../views/Tarefas.vue'
import Projetos from '../views/Projetos.vue'
import Formulario from '../views/Projetos/Formulario.vue'

const rotas: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Tarefas',
    component: Tarefas
  },
  {
    path: '/projetos',
    name: 'ProjetosView',
    component: Projetos
  },
  {
    path: '/projetos/novo',
    name: 'Novo projeto',
    component: Formulario
  },
  {
    path: '/projetos/:id', // Aqui
    name: 'Projetos',
    component: Formulario
  }
]

const roteador = createRouter({
  history: createWebHashHistory(),
  routes: rotas
})

export default roteador

```

ProjetosView.vue
```vue
<template>
    <section class="projetos">
        <h1 class="title">Projetos</h1>
        <router-link to="/projetos/novo" class="button">
            <span class="icon is-small">
                <i class="fas fa-plus"></i>
            </span>
            <span>Novo Projeto</span>
        </router-link>
            <table class="table is-fullwidth">
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            Nome
                        </th>
                        <th>
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="projeto in projetos" :key="projeto.id">
                        <td>
                            {{ projeto.id }}
                        </td>
                        <td>{{ projeto.nome }}</td>
                        <td>
                            <router-link :to="`/projetos/${projeto.id}`" class="button"> <!--Aqui-->
                                <span class="icon is-small">
                                    <i class="fas fa-pencil-alt"></i>
                                </span>
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
    </section>
</template>
```