# Sobre Mixins

- Mixins é usado para simplificar o código/reaproveitar, por exemplo ao usar o store em um componente, poder reaproveitar esse store para usar em outros componentes.

## Como criar
- Dentro de src, tu vai criar uma pasta chamada mixins
- Nesse arquivo tu vai criar um método que vai ser usado para tua lógica

notifiacaoMixin.ts
```ts
import { TipoNotificacao } from "@/interfaces/INotificacao";
import { NOTIFICAR } from "@/store/tipo-mutations";
import { store } from "@/store";

export const notificacaoMixin = {
  methods: {
    notificar(tipo: TipoNotificacao, titulo: string, texto: string): void {
      store.commit(NOTIFICAR, {
        titulo,
        texto,
        tipo,
      });
    },
  },
};

```

- Note que tu está retornando um objeto e dentro desse objeto tem o methods q é aquela propriedade do vue para criar funcoes
- Dentro dele tu vai usar a lógica para comitar dentro da store
- Note também que o import do store é diferente do import personalizado que tu criou para usar nos componentes o porque disso é q aquele useStore só pode ser usado dentro de componentes e como esse arquivo não é um componente vue, tu não pode usar ele aqui, então basta usar a store inteira, como tu fez no arquivo.

## Feito os passos acima, basta ir dentro do componente e usar o mixin.


### COM MIXINS

```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { ADICIONA_PROJETO, ALTERA_PROJETO } from '@/store/tipo-mutations';
import { TipoNotificacao } from '@/interfaces/INotificacao';
import { notificacaoMixin } from '@/mixins/notifcar'

export default defineComponent({
    name: 'FormularioView',
    props: {
        id: {
            type: String
        }
    },
    mixins: [notificacaoMixin], //  Aqui
    mounted() {
        if (this.id) {
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

                this.store.commit(ALTERA_PROJETO, {
                    id: this.id,
                    nome: this.nomeDoProjeto
                })
            } else {
    
                this.store.commit(ADICIONA_PROJETO, this.nomeDoProjeto)

            }
            this.nomeDoProjeto = '',
                this.notificar(TipoNotificacao.SUCESSO, 'Excelente', 'O projeto foi cadastrado com sucesso') // Aqui
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

- Note que para usar o mixin tu criou a propriedade mixins e ela é um ARRAY, porque tu pode ter Vários MIXINS.
- Depois bastou tu chamar o mixin dentro da funcao salvar, ao concluir a adição de um projeto, dessa forma tua lógica está concluida.

### SEM MIXINS

projetos/Formulario.vue
```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { ADICIONA_PROJETO, ALTERA_PROJETO, NOTIFICAR } from '@/store/tipo-mutations';
import { TipoNotificacao } from '@/interfaces/INotificacao';

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
                //EDIÇÃO
                this.store.commit(ALTERA_PROJETO, {
                    id: this.id,
                    nome: this.nomeDoProjeto
                })
            } else {
                //ADICIONANDO PROJETO
                this.store.commit(ADICIONA_PROJETO, this.nomeDoProjeto)
                
            }
            this.nomeDoProjeto = '',
            this.store.commit(NOTIFICAR, {
                titulo: 'Novo projeto foi salvo',
                texto: 'Prontinho :) seu projeto já está disponível.',
                tipo: TipoNotificacao.SUCESSO
            })
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

