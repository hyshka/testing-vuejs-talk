import { shallowMount } from "@vue/test-utils"
import merge from "lodash/merge"

const LoginView = {
  data() {
    return {
      email: "",
      password: "",
    }
  },
  methods: {
    submitForm() {
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
      } else {
        this.$router.push("/dashboard")
      }
    },
  },
  template: `
    <form>
      <input type="email" v-model="email">
      <input type="password" v-model="password">
      <button v-on:click="submitForm">Login</button>
    </form>
  `,
}

describe("Mocking Vue instance properties and methods", () => {
  it("mocks per instance", () => {
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

    const button = wrapper.find("button")
    button.trigger("click")
  })

  it("mocks with factory function", () => {
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

    const button = wrapper.find("button")
    button.trigger("click")
  })
})
