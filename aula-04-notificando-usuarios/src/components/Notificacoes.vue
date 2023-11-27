<template>
    <div class="notificacoes">
        <article class="message is-success">
            <div class="message-header">
                <div class="message-body">
                    Aqui vai o texto da notificação
                </div>
            </div>
        </article>
        <article class="message is-warning">
            <div class="message-header">
                <div class="message-body">
                    Aqui vai o texto da notificação
                </div>
            </div>
        </article>
        <article class="message is-danger">
            <div class="message-header">
                <div class="message-body">
                    Aqui vai o texto da notificação
                </div>
            </div>
        </article>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'NotificacoesComponent'
})
</script>

<style scoped>
.notificacoes {
    position: absolute;
    right: 0;
    widows: 300px;
    padding: 8px;
    z-index: 105;
}
</style>