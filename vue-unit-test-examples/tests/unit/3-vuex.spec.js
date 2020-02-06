import Vuex, { mapState, mapActions } from "vuex"
import { createLocalVue, shallowMount } from "@vue/test-utils"

const localVue = createLocalVue()
localVue.use(Vuex)

const VuexButtonCounter = {
  template: `<button v-on:click="increment('hello')">You clicked me {{count}} times.</button>`,
  computed: {
    ...mapState({
      count: state => state.count,
    }),
  },
  methods: {
    ...mapActions(["increment"]),
  },
}

const VuexNamespacedButtonCounter = {
  template: `<button v-on:click="increment('hello')">You clicked me {{count}} times.</button>`,
  computed: {
    ...mapState("counter", {
      count: state => state.count,
    }),
  },
  methods: {
    ...mapActions("counter", ["increment"]),
  },
}

describe("Testing Vuex in components", () => {
  it("vue test utils docs", () => {
    const actions = {
      increment: jest.fn(),
    }
    const state = {
      count: 0,
    }

    const store = new Vuex.Store({ actions, state })
    const wrapper = shallowMount(VuexButtonCounter, {
      localVue,
      store,
    })

    wrapper.trigger("click")

    // Used this way, the action gets called as it would normally with the first
    // argument being 'context', containing the various commit, dispatch, etc.
    // methods sometimes used within an action.
    expect(actions.increment).toHaveBeenCalledWith(expect.anything(), "hello")
  })

  it("mocking dispatch", () => {
    const storeOptions = {
      modules: {
        counter: {
          namespaced: true,
          actions: {
            increment: jest.fn(),
          },
          state: {
            count: 0,
          },
        },
      },
    }
    const store = new Vuex.Store(storeOptions)
    store.dispatch = jest.fn()

    const wrapper = shallowMount(VuexNamespacedButtonCounter, {
      localVue,
      store,
    })

    wrapper.trigger("click")
    expect(store.dispatch).toHaveBeenCalledWith("counter/increment", "hello")
  })
})
