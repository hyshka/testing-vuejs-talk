%title: Unit Testing Vue.js Applications
%author: Bryan Hyshka
%date: 2020-02-01

# Unit Testing Vue.js Applications

              _   _       _ _     _____         _   _
             | | | |_ __ (_) |_  |_   _|__  ___| |_(_)_ __   __ _
             | | | | '_ \| | __|   | |/ _ \/ __| __| | '_ \ / _` |
             | |_| | | | | | |_    | |  __/\__ \ |_| | | | | (_| |
              \___/|_| |_|_|\__|   |_|\___||___/\__|_|_| |_|\__, |
                                                            |___/
                          __     __             _
                          \ \   / /   _  ___   (_)___
                           \ \ / / | | |/ _ \  | / __|
                            \ V /| |_| |  __/_ | \__ \
                             \_/  \__,_|\___(_)/ |___/
                                             |__/
               _                _ _           _   _
              / \   _ __  _ __ | (_) ___ __ _| |_(_) ___  _ __  ___
             / _ \ | '_ \| '_ \| | |/ __/ _` | __| |/ _ \| '_ \/ __|
            / ___ \| |_) | |_) | | | (_| (_| | |_| | (_) | | | \__ \
           /_/   \_\ .__/| .__/|_|_|\___\__,_|\__|_|\___/|_| |_|___/
                   |_|   |_|

---

## Working knowledge

- Vue.js is a framework for building user interfaces and single-page applications

- Vuex is a state management pattern and library inspired by Flux + Redux

- Jest is a testing framework

- Vue Test Utils is the official unit testing library for Vue.js

---

## Mounting components

```
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
    };
  },
  template:
    '<button v-on:click="count++">You clicked me <Count :count="count"/> times.</button>',
}
```

---

## Using `mount` vs `shallowMount`

```
const wrapper = mount(ButtonCounter);
wrapper.html()
>> <button>You clicked me <span>0</span> times.</button>

const wrapper = shallowMount(ButtonCounter);
wrapper.html()
>> <button>You clicked me <count-stub count="0"></count-stub> times.</button>
```

---

## Mounting with external dependencies

```
const Message = {
  data() {
    return {
      msg: "",
    }
  },
  template: '<div>{{ msg | placeholder("Text if msg is missing") }}</div>',
}
```

---

## Using `createLocalVue`

```
const wrapper = shallowMount(Message)
>> [Vue warn]: Failed to resolve filter: placeholder

import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vue2Filters from "vue2-filters"

const localVue = createLocalVue()
localVue.use(Vue2Filters)

const wrapper2 = shallowMount(Message, {
    localVue,
})

wrapper.html()
>> <div>Text if msg is missing</div>
```

---

## Testing asynchronous DOM updates and Promises

```
const wrapper = shallowMount(ButtonCounter)
wrapper.trigger("click")

wrapper.text()
>> You clicked me 1 times.

it("using nextTick", async () => {
    const wrapper = shallowMount(ButtonCounter)
    wrapper.trigger("click")
    await Vue.nextTick()

    wrapper.text()
    >> You clicked me 1 times.
})
```

---

## Testing asynchronous DOM updates and Promises

```
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
```
---

## Testing asynchronous DOM updates and Promises

```
const wrapper = shallowMount(AsyncButtonCounter)
wrapper.trigger("click")

wrapper.text()
>> You clicked me 0 times.
```

---

## Testing asynchronous DOM updates and Promises

```
import flushPromises from "flush-promises"

const wrapper = shallowMount(AsyncButtonCounter)
wrapper.trigger("click")
await flushPromises()

wrapper.text()
>> You clicked me 1 times.
```

---

## Stubbing components

```
const DateForm = {
  data() {
    return {
      date: "2020-02-06",
    }
  },
  template: `
    <form>
      <ElDatePicker v-model="date" />
    </form>
  `,
}
```

---

## Stubbing components

```
const wrapper = mount(DateForm, {
  localVue,
})

wrapper.html()
>> <form><div class="el-date-editor el-input el-input--prefix el-input--suffix el-date-editor--date"><!----><input type="text" autocomplete="off" name="" class="el-input__inner"><span class="el-input__prefix"><i class="el-input__icon el-icon-date"></i><!----></span><span class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-input__icon"></i><!----><!----><!----><!----></span><!----></span><!----><!----></div></form>

const input = wrapper.find("input")
input.setValue("2020-03-05")

wrapper.vm.date
>> "2020-02-06"
```

---

## Stubbing components

```
const DatePickerStub = {
  props: ["value"],
  template: `
    <input :value="value" @input="$emit('input', $event.target.value)" />
  `,
}

const wrapper = shallowMount(DateForm, {
  localVue,
  stubs: {
    ElDatePicker: DatePickerStub,
  },
})

wrapper.html()
>> <form><input></form>

const input = wrapper.find("input")
input.setValue("2020-03-05")

wrapper.vm.date
>> "2020-03-05"
```

---

## Mocking methods injected into the Vue instance

```
const LoginView = {
  methods: {
    submitForm() {
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
      } else {
        this.$router.push("/dashboard")
      }
    },
  },
  ...
}

const wrapper = shallowMount(LoginView, {
  mocks: {
    $route: {
      query: {
        redirect: "/dashboard/resource",
      },
    },
    $router: {
      push: jest.fn(),
    },
  },
})
```

---

## Mocking methods for each test is more cumbersome with larger components

```
const store = new Vuex.Store({
  modules: {
    auth: {
      namespaced: true,
      actions: {
        signup: jest.fn().mockResolvedValue(),
        signupCompanyUser: jest.fn().mockResolvedValue(),
        signupOrganizationUser: jest.fn().mockResolvedValue(),
      },
    },
  },
})

const wrapper = shallowMount(Signup, {
  localVue,
  mocks: {
    $router: {
      push: jest.fn(),
    },
    $route: {
      query: {},
    },
  },
  stubs: {
    RouterLink: true,
    ElSelect: ElSelect,
    ElOption: ElOption,
  },
  store,
})
```

---

## Using factory functions to keep it DRY

```
import merge from "lodash/merge"

function createWrapper(overrides) {
  const defaultMountingOptions = {
    mocks: {
      $route: {
        query: {},
      },
      $router: {
        push: jest.fn(),
      },
    },
  }
  return shallowMount(LoginView, merge(defaultMountingOptions, overrides))
}

const mocks = {
  $route: {
    query: {
      redirect: "/dashboard/resource",
    },
  },
}
const wrapper = createWrapper({ mocks })
```

---

## Testing Vuex in components

```
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
```

---

## Recommended in the Vue Test Utils docs

```
const localVue = createLocalVue()
localVue.use(Vuex)

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

expect(actions.increment).toHaveBeenCalledWith(expect.anything(), "hello")
>> {"commit": [Function boundCommit], "dispatch": [Function boundDispatch], "getters": {}, "rootGetters": {}, "rootState": {"count": 0}, "state": {"count": 0}}, "hello"
```

---

## A more complex example

```
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
```

---

## Mocking `store.dispatch`

```
const localVue = createLocalVue()
localVue.use(Vuex)

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
>> "counter/increment", "hello"
```

---

## References

- [Vue Test Utils](https://vue-test-utils.vuejs.org/)

-  [Testing Vue.js Applications book](https://www.manning.com/books/testing-vue-js-applications) by [Edd Yerburgh](https://github.com/eddyerburgh)

- [Flush promises library](https://github.com/kentor/flush-promises)

- [These slides](https://github.com/hyshka/@todo)
