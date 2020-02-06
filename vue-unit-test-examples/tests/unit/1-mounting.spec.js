import { createLocalVue, mount, shallowMount } from "@vue/test-utils"
import Vue2Filters from "vue2-filters"

const localVue = createLocalVue()
localVue.use(Vue2Filters)

const Count = {
  props: ["count"],
  template: "<span>{{count}}</span>",
}

const ButtonCounter = {
  components: {
    Count,
  },
  data() {
    return {
      count: 0,
    }
  },
  template:
    '<button v-on:click="count++">You clicked me <Count :count="count"/> times.</button>',
}

const Message = {
  data() {
    return {
      msg: "",
    }
  },
  template: '<div>{{ msg | placeholder("Text if msg is missing") }}</div>',
}

describe("Mounting Components", () => {
  it("mount", () => {
    const wrapper = mount(ButtonCounter)
    console.log("mount", wrapper.html())
  })

  it("shallowMount", () => {
    const wrapper = shallowMount(ButtonCounter)
    console.log("shallowMount", wrapper.html())
  })

  it("localVue", () => {
    //const wrapper = shallowMount(Message)
    // [Vue warn]: Failed to resolve filter: placeholder

    const wrapper2 = shallowMount(Message, {
      localVue,
    })
    console.log("localVue", wrapper2.html())
  })
})
