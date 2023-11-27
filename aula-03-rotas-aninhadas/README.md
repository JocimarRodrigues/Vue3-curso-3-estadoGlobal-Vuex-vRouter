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


# Rotas Aninhadas

- Tu vai criar essas rotas, dentro do roteador

## COM ROTAS ANINHADAS

router/index.ts
```ts
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Tarefas from '../views/Tarefas.vue'
import Projetos from '../views/Projetos.vue'
import Formulario from '../views/Projetos/Formulario.vue'
import Lista from '../views/Projetos/Lista.vue'

const rotas: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Tarefas',
    component: Tarefas
  },
  {
    path: '/projetos',
    component: Projetos,
    children: [
      {
        path: '',
        name: 'Projetos',
        component: Lista
      },
      {
        path: 'novo',
        name: 'Novo projeto',
        component: Formulario
      },
      {
        path: ':id',
        name: 'Editar projeto',
        component: Formulario,
        props: true
      }

    ]
  },

]


const roteador = createRouter({
  history: createWebHashHistory(),
  routes: rotas
})

export default roteador

```

- Para tu aninhar as rotas basta aprir a propriedade children, dizer q vai receber um array e dentro desse array colocar as novas rotas
- Note que não precisa e nem deve se usar a / para as rotas filhas



## SEM ROTAS ANINHADAS
router/index.ts
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
    props: true
  }
]

const roteador = createRouter({
  history: createWebHashHistory(),
  routes: rotas
})

export default roteador

```

# Feito os passos acima, basta ir no componente que vai receber essas rotas e chamar o roteador lá

- Na lógica do teu projeto tu vai ter um componente Projetos vue, q é quem vai receber a rota principal e as rotas filhas

Projetos.vue
```vue
<template>
    <div class="projetos">
        <h1 class="title">Projetos</h1>
        <router-view></router-view> <!--Aqui-->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ProjetosView",
})
</script>

<style scoped>
.projetos {
    padding: 1.25rem;
}
</style>
```

- Note que nesse componente tu apenas cria um template e chama as rotas filhas dele, como tu definiu lá no roteador q essa vai ser a rota Pai, com o uso do router-view todas as rotas filhas vão ficar disponíveis nesse componente.

# IMPORTANTE => ORGANIZANDO MUTATIONS

- Note que tu está usando strings para o nome das mutations e isso funciona, mas não é uma boa prática porque caso tu digite o nome errado de uma mutation na chamada, isso vai dar um bug e pode ser bem difícil de debugar.
- Para resolver esse problema, dentro de store, tu vai criar um novo arquivo por ex mutations-tipo e lá dentro tu vai criar as const com os nomes das tuas mutations e definir como valor para elas uma string como o nome da mutation, depois basta exportar essas const.
- Depois basta tu chamar as const e usar elas no lugar das string, dessa forma fica bem mais difícil tu errar o nome de uma mutation

## Passo 1, criar o tipo-mutations.ts dentro de store

tipo-mutations.ts
```ts
export const ADICIONA_PROJETO = "ADICIONA_PROJETO";
export const ALTERA_PROJETO = "ALTERA_PROJETO";
export const EXCLUIR_PROJETO = "EXCLUIR_PROJETO";

```

## Passo 2, dentro da store importa e use essas const em vez das string

### COM AS CONST
store/index.ts
```ts
import type IProjeto from '@/interfaces/IProjeto'
import type { InjectionKey } from 'vue'
import { createStore, Store, useStore as vuexUseStore } from 'vuex'
import { ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUIR_PROJETO } from './tipo-mutations' // Aqui

interface Estado {
  projetos: IProjeto[]
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
  state: {
    projetos: []
  },
  mutations: {
    [ADICIONA_PROJETO](state, nomeDoProjeto: string) { // Aqui
      const projeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto
      } as IProjeto
      state.projetos.push(projeto)
    },
    [ALTERA_PROJETO](state, projeto: IProjeto) { // Aqui
      const index = state.projetos.findIndex(proj => proj.id == projeto.id)
      state.projetos[index] = projeto
    },
    [EXCLUIR_PROJETO](state, id: string) { // Aqui
      state.projetos = state.projetos.filter(proj => proj.id != id)
    }
  }
})

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}
```
- Note que tu coloca as const dentro de um []
- Não esquecer de importar as const

### SEM AS CONST
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
    'ALTERA_PROJETO'(state, projeto: IProjeto) {
      const index = state.projetos.findIndex(proj => proj.id == projeto.id)
      state.projetos[index] = projeto
    },
    'EXCLUIR_PROJETO'(state, id: string) {
      state.projetos = state.projetos.filter(proj => proj.id != id)
    }
  }
})

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}
```

## Passo 3, agora basta ir nos componentes que estão utilizando essas mutations e fazer o mesmo procedimento do passo 2

### COM AS CONST
Formulario.vue
```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { ADICIONA_PROJETO, ALTERA_PROJETO } from '@/store/tipo-mutations'; // Aqui

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
            if (this.id) {
                this.store.commit(ALTERA_PROJETO, { // Aqui
                    id: this.id,
                    nome: this.nomeDoProjeto
                })
            } else {
                this.store.commit(ADICIONA_PROJETO, this.nomeDoProjeto) // Aqui
                
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

- Note que aqui tu não precisa usar [], basta chamar as const.


### SEM AS CONST
Formulario.vue
```vue
<template>
    <section>
        <form @submit.prevent="salvar">
            <div class="field">
                <label for="nomeDoProjeto" class="label">
                    Nome do Projeto
                </label>
                <input type="text" class="input" v-model="nomeDoProjeto" id="nomeDoProjeto" />
            </div>
            <div class="field">
                <button class="button" type="submit">
                    Salvar
                </button>
            </div>
        </form>
    </section>
</template>

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
            if (this.id) {
                this.store.commit('ALTERA_PROJETO', {
                    id: this.id,
                    nome: this.nomeDoProjeto
                })
            } else {
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