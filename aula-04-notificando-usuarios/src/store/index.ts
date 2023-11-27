import type IProjeto from '@/interfaces/IProjeto'
import type { InjectionKey } from 'vue'
import { createStore, Store, useStore as vuexUseStore } from 'vuex'
import { ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUIR_PROJETO } from './tipo-mutations'
import {INotificao, TipoNotificacao} from '@/interfaces/INotificacao'

interface Estado {
  projetos: IProjeto[],
  notificacoes: INotificao[],
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
  state: {
    projetos: [],
    notificacoes: [
      {
        id: 1,
        texto: 'Uma notificação de sucesso',
        titulo: 'sucesso',
        tipo: TipoNotificacao.SUCESSO
      },
      {
        id: 2,
        texto: 'Uma notificação de atenção',
        titulo: 'atenção',
        tipo: TipoNotificacao.ATENCAO
      },
      {
        id: 3,
        texto: 'Uma notificação de falha',
        titulo: 'falha',
        tipo: TipoNotificacao.FALHA
      }
    ]
  },
  mutations: {
    [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
      const projeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto
      } as IProjeto
      state.projetos.push(projeto)
    },
    [ALTERA_PROJETO](state, projeto: IProjeto) {
      const index = state.projetos.findIndex(proj => proj.id == projeto.id)
      state.projetos[index] = projeto
    },
    [EXCLUIR_PROJETO](state, id: string) {
      state.projetos = state.projetos.filter(proj => proj.id != id)
    }
  }
})

export function useStore(): Store<Estado> {
  return vuexUseStore(key)
}