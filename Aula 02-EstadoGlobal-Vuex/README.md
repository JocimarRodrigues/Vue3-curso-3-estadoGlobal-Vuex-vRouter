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