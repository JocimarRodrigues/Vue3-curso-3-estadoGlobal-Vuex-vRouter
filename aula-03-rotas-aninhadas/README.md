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
