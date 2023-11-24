# Documentação oficial sobre o router-vue
- https://router.vuejs.org/guide/

# Provide/Inject com Composition API
- https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity


# Observações

### Tu está reutilizando o código do curso 2

### Sobre o erro multi-world

- Ao declerar o nome de um componente em vue a documentação recomenda q o mesmo tenha o nome de Mais uma palavra por exemplo
```js
/* ✓ GOOD */
Vue.component('todo-item', {
  // ...
})

/* ✗ BAD */
Vue.component('Todo', {
  // ...
})

```

#### E o por que disso?

- Porque se tu não o fizer, pode ter conflito com os elementos html no futuro.

#### Link da documentação que explica sobre isso

- https://eslint.vuejs.org/rules/multi-word-component-names.html#options

- Não necessarimente o nome do arquivo, precisa ser o mesmo do nome do Componente, isso é: tu pode ter o arquivo Box.vue e definir o nome dele como BoxComponent e mesmo assim, tu vai conseguir usar o componente sem problemas, mas acredito que isso não seja uma boa prática; por isso no futuro quando for escrever os Componentes ficar bem atento a esse detalhe. xD