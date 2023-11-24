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

# Editando um projeto

- Note que no caso acima, tu usou o v-bind para passar um id, mas para tu usar esse valor para fazer uma dicao, tu precisa definir que ele é uma proprs
- Para fazer isso, dentro da rota do router, você vai criar uma propriedade chamada props e definir ela como true
- Essa propriedade serve para definir para o router que a rota vai receber um valor

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
    path: '/projetos/:id',
    name: 'Projetos',
    component: Formulario,
    props: true // Aqui
  }
]

const roteador = createRouter({
  history: createWebHashHistory(),
  routes: rotas
})

export default roteador

```

## Agora dentro do componente que está recebendo essa proprs do router, q é o projetos/Formulario.vue

- Você vai definir que ele vai receber a props

projetos/Formulario.vue
```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
    name: 'FormularioView',
    props: { // Aqui
        id: {
            type: String
        }
    },
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            this.store.commit('ADICIONA_PROJETO', this.nomeDoProjeto)
            this.nomeDoProjeto = '',
            this.$router.push('/projetos')
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

## Agora tu vai usar a funcao mounted para criar a lógica de busca

### Mounted

- Serve para definir tudo que vai acontecer na hora que o componente é criado/renderizado

projetos/Formulario.vue

```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
    name: 'FormularioView',
    props: {
        id: {
            type: String
        }
    },
    mounted() { // Aqui
        if(this.id) {
            const projeto = this.store.state.projetos.find(proj => proj.id == this.id)
            this.nomeDoProjeto = projeto?.nome || ''
        }
    },
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            this.store.commit('ADICIONA_PROJETO', this.nomeDoProjeto)
            this.nomeDoProjeto = '',
            this.$router.push('/projetos')
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

## Agora que você já criou a rota, pegou o id, buscou o item, precisa criar a mutation para alterar o valor no store

store/index.ts
```ts
import type IProjeto from '@/interfaces/IProjeto'
import type { InjectionKey } from 'vue'
import { createStore, Store, useStore as vuexUseStore } from 'vuex'

interface Estado {
  projetos: IProjeto[]
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
  state: {
    projetos: []
  },
  mutations: {
    'ADICIONA_PROJETO'(state, nomeDoProjeto: string) {
      const projeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto
      } as IProjeto
      state.projetos.push(projeto)
    },
    'ALTERA_PROJETO'(state, projeto: IProjeto) { // Aqui
      const index = state.projetos.findIndex(proj => proj.id == projeto.id)
      state.projetos[index] = projeto
    }
  }
})

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}
```

## Agora basta tu  chamar essa nova mutation e criar a lógica na funcao do formulário  que está realizando a operacao de salvar projetos

projetos/Formulario.vue
```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
    name: 'FormularioView',
    props: {
        id: {
            type: String
        }
    },
    mounted() {
        if(this.id) {
            const projeto = this.store.state.projetos.find(proj => proj.id == this.id)
            this.nomeDoProjeto = projeto?.nome || ''
        }
    },
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() { 
            if (this.id) { // Aqui
                //EDIÇÃO
                this.store.commit('ALTERA_PROJETO', {
                    id: this.id,
                    nome: this.nomeDoProjeto
                })
            } else { // Aqui
                //ADICIONANDO PROJETO
                this.store.commit('ADICIONA_PROJETO', this.nomeDoProjeto)
                
            }
            this.nomeDoProjeto = '',
            this.$router.push('/projetos')
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

