# Instalando vuex

- npm i vuex

# Configurando estado global

# Passo 1

- Criar a pasta store e dentro dela o arquivo index.ts; ele q vai ser o responsável por definir e configurar os estados

# Passo 2: Configurando o index.ts da pasta store/Criando estados

main.ts
```ts
import type IProjeto from '@/interfaces/IProjeto'
import type { InjectionKey } from 'vue'
// import { createStore, Store } from 'vuex/types/index.d.ts'
import { createStore, Store } from 'vuex'

interface Estado {
  projetos: IProjeto[]
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
  state: {
    projetos: [
      {
        id: new Date().toISOString(),
        nome: 'TypeScript'
      },
      {
        id: new Date().toISOString(),
        nome: 'Vue'
      },
      {
        id: new Date().toISOString(),
        nome: 'Vuex'
      }
    ]
  }
})


```

- 1 Tu cria uma interface para usar no teu estado
- 2 cria o store com a function createStore, tu vai tipar ela com a interface q tu criou
- 3 Dentro do createStore, vai criar a propriedade state e dentro dela tu vai definir o objeto, lista, variaveis q vai ser o teu estado
- 4 Tu usou uma lista de objetos, e definiu as props nesse exemplo

### Observação

- Note que a interface Estado é para tu tipar a lista do estado q tu tá criando dentro do store
- Note também que tu está tipando a lista com uma interface q tu criou lá na pasta interfaces

### Sobre o InjectionKey

- Na versão 3, além da store tu precisa definir uma chave de acesso, essa é a função do InjectionKey; é através dessa chave de acesso que o teu componente vai conseguir acesso a sua store

- O Symbol é para definir o valor que vai ser colocado dentro do key
- Desas forma tu termina a configuracao da chave
- Aí sempre que o componente pedir acesso a store, ele vai precisar passar a chave

# Consumindo os estados

- Para tu usar a store, precisa usar um hook chamado useStore, ele fica dentro do setup() do componente
- Agora tu vai precisar passar a chave de acesso
- Como você vai adicionar novos projetos no state, é melhor usar o computed e passar uma arrow function e ela retornar a store
```vue
<script lang="ts">
import { computed, defineComponent } from 'vue'; //aqui
import Temporizador from './Temporizador.vue'
import { useStore } from 'vuex'; //aqui

import {key} from '@/store' //aqui

export default defineComponent({
    name: "FormulárioComponent",
    emits: ['aoSalvarTarefa'],
    components: {
        Temporizador
    },
    data() {
        return {
            descricao: '',
            idProjeto: '',
        }
    },
    methods: {
        salvarTarefa(tempoDecorrido: number): void {
            this.$emit('aoSalvarTarefa', {
                duracaoEmSegundos: tempoDecorrido,
                descricao: this.descricao,
                projeto: this.projetos.find(proj => proj.id == this.idProjeto) //aqui
            })
            this.descricao = ''
        }
    },
    setup() {
        const store = useStore(key) //aqui
        return {
            projetos: computed(() => store.state.projetos) //aqui
        }
    }
})
</script>
```

- Note que o find está fazendo uma busca dentro da lista projetos q é o teu stateGlobal q tu criou lá na store
- Depois que tu usa o useStore, passa a key,os states global, q tu passou para o computed, vão ficar disponiveís para uso no teu componente, por isso tu consegue utilizar ele no methods e dentro do teu template

# Importante não esquecer de importar  store e a key no main.ts
main.ts
```ts
import { createApp } from 'vue'
import App from './App.vue'
import roteador from './router/index'

import '@fortawesome/fontawesome-free/css/all.css'
import { key, store } from './store'

createApp(App)
.use(roteador)
.use(store, key) // Aqui
.mount('#app')

```

# Feito os passos acima, basta consumir o estado no template

```vue
<template>
    <div class="box formulario">
        <div class="columns">
            <div class="column is-5" role="form" aria-label="Formulário para criação de uma nova tarefa">
                <input type="text" class="input" placeholder="Qual tarefa você deseja iniciar?" v-model="descricao">
            </div>
            <div class="column is-3">
                <div class="select"> <!--Aqui-->
                    <select v-model="idProjeto">
                    <option value="">Selecione o projeto</option>
                    <option :value="projeto.id" v-for="projeto in projetos" :key="projeto.id">{{ projeto.nome }}</option>
                    </select>
                </div> <!---->
            </div>
            <div class="column">
                <Temporizador @aoTemporizadorFinalizado="salvarTarefa" />
            </div>
        </div>
    </div>
</template>

```

- Caso tenha dúvidas a aula em que tu cria o state é essa => https://cursos.alura.com.br/course/vue3-avancando-framework/task/98159
- E a que consome esse state é essa => https://cursos.alura.com.br/course/vue3-avancando-framework/task/98160


# Definindo um estado/adiciona um novo item ao estado

- Tu vai criar essa lógica dentro do state global, isso é dentro do store
- Tu vai usar as mutations para isso

## Mutations

- É uma outra propriedade que vai dentro do createStore, ela é a responsável por abrigar as funções que vão criar a lógica de alterar os seus states

store/index.ts
```ts
import type IProjeto from '@/interfaces/IProjeto'
import type { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

interface Estado {
  projetos: IProjeto[]
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
  state: {
    projetos: []
  },
  mutations: {
    'ADICIONA_PROJETO'(state, nomeDoProjeto: string) { // Aqui
      const projeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto
      } as IProjeto
      state.projetos.push(projeto)
    }
  }
})

```
- A convensão para o nome das mutations é ser tudo em MAIUSCULO
- Note que é dentro da mutation que tu vai criar a lógica para adicionar um novo item ao  array do state

### Feito os passos acima, basta chamar a mutation no componente

Projetos.vue
```vue
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
    name: 'ProjetosView',
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            this.store.commit('ADICIONA_PROJETO', this.nomeDoProjeto)
            this.nomeDoProjeto = ''
        },
    },
    setup() {
        const store = useStore();
        return {
            store,
            projetos: computed(() => store.state.projetos)
        }
    }
})
</script>
```

- Tu vai chamar a mutation através do método commit, o 1 parametro tem que ser o nome q tu definiu para a mutation e o segundo parametro  é o dado q ela vai receber, no caso esse dado vem do valor do input do formulário desse componente
- Note  que a lógica do computed é para retornar os dados do teu state global/store para o componente

## Dê uma olhada no componente completo para ter uma ideia de como ficou a lógica usando store
Projetos.vue
```vue
<template>
    <section class="projetos">
        <h1 class="title">Projetos</h1>
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
import { computed, defineComponent } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
    name: 'ProjetosView',
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            this.store.commit('ADICIONA_PROJETO', this.nomeDoProjeto)
            this.nomeDoProjeto = ''
        },
    },
    setup() {
        const store = useStore();
        return {
            store,
            projetos: computed(() => store.state.projetos)
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

## Caso tenha dúvidas o link da aula é esse:
- https://cursos.alura.com.br/course/vue3-avancando-framework/task/98161


# Extra, melhorando o uso do import dos store, usando o useStore

- Pra tu não ter q ficar importando o store, toda vez

- Repare comigo, nós, para adicionar a store, montar a store no setup, temos que fazer o use do using, importarmos o use store do Vuex, e importar que definimos que toda a vez temos que fazer isso, e pode ficar um pouco moroso, um pouco confuso de onde vem esse use store.

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
    }
  }
})

export function useStore(): Store<Estado> { // Aqui
  return vuexUseStore(key)
}
```
- Não esquecer de  renomear o return do useStore para não dar conflito, tu faz isso lá no import usando o as "novoNome"


