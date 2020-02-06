import Vue from "vue"
import { shallowMount } from "@vue/test-utils"
import flushPromises from "flush-promises"

const ButtonCounter = {
  data() {
    return {
      count: 0,
    }
  },
  template:
    '<button v-on:click="count++">You clicked me {{count}} times.</button>',
}

const AsyncButtonCounter = {
  data() {
    return {
      count: 0,
    }
  },
  template:
    '<button v-on:click="getResults">You clicked me {{count}} times.</button>',
  methods: {
    async getResults() {
      await Promise.resolve()
      this.count++
    },
  },
}

describe("Mounting Components", () => {
  it("testing DOM updates", () => {
    const wrapper = shallowMount(ButtonCounter)

    wrapper.trigger("click")
    console.log("without nextTick", wrapper.text())
    // component gets rendered so fast we always hit the first tick, so the
    // count is always updated correctly
  })

  it("using nextTick", async () => {
    const wrapper = shallowMount(ButtonCounter)
    wrapper.trigger("click")
    await Vue.nextTick()
    console.log("with nextTick", wrapper.text())
  })

  it("testing with promises", () => {
    const wrapper = shallowMount(AsyncButtonCounter)
    wrapper.trigger("click")

    console.log("with promises", wrapper.text())
  })

  it("using flushPromises", async () => {
    const wrapper = shallowMount(AsyncButtonCounter)
    wrapper.trigger("click")

    await flushPromises()
    console.log("using flushPromises", wrapper.text())
  })
})
