import { firestoreAction } from 'vuexfire'

export default {
    namespaced: true,
    state: {
        gameboard: {},
    },
    actions: {
        bindGameboard: firestoreAction(context => {
            return context.bindFirestoreRef('gameboard', context.getters.gameboardRef);
        }),
        initGameboard: firestoreAction((context, eventId) => {
            return context.rootGetters['events/eventsRef'].doc(eventId).collection('gameboard').doc('current').set({ visible: false })
        })
    },
    getters: {
        gameboardRef: (state, getters, rootState, rootGetters) => {
            return rootGetters['events/selectedEventRef'].collection('gameboard').doc('current')
        },
        pollIsLive: (state) => {
            return state.gameboard && state.gameboard.poll && state.gameboard.poll.visible
        },
        pollQuestions: (state) => {
            if (state.gameboard == null) return []
            const { poll } = state.gameboard
            return poll && poll.questions && Object.keys(poll.questions) || []
        }
    }
}