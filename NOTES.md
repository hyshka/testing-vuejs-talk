## Intro
- why I wanted to do this talk
  - started new job in July
  - no test coverage
  - not much documentation
- focus on Vue Test Utils
- a lot of info
- do my best to get through
- slides available on GitHub
- questions at the end

## Mounting components
- topics: vue-test-utils
- mount vs. shallowMount
  - a stub is just an empty shell
  - stick with shallowMount
  - better isolates your unit tests
  - Gotcha: use mount a lot with component frameworks
- mounting a component that relies on external dependencies
  - component libraries, filter libraries, Vuex, etc.
  - anything that uses Vue.use()
  - avoids polluting a global instance

## Testing asynchronous DOM updates and Promises
- topics: Promises, async/await, Vue DOM batching (nextTick), microtask event queue
- testing DOM updates
  - Vue batches DOM updates and applies them asyncrounously
  - async test and `await Vue.nextTick()`
  - `await localVue.nextTick()`
- testing with promises
  - even though you may have mocked request
  - won't resolve immediately
  - flush the microtask event queue
  - easy helper for this called flush-promises
  - just a wrapper around setImmediate or setTimeout
  - returns promise, resolves when browser hits next "tick"

## Stubbing components
- topics: Vue, vue-test-utils, form input bindings (v-model)
- example of ElDatePicker
  - note that we're using `mount` here
  - so far, only needed for 3rd party components
  - ex. fancy select inputs or date pickers
  - components don't handle input events correctly
  - throwing errors when mounting
- show creating a stub
  - can use shallowMount, even with nested component
  - replicate the behaviour you want to test
  - no longer testing production code
  - at least you can test how your code interfaces with the library

## Mocking methods injected into the Vue instance
- topics: Vuex, vue router, 3rd party Vue packages
- test properties/methods on Vue instance
- common with 3rd party libraries
- easy if you need the same values
  - use `mocks` option
- more cumbersome when testing bigger components
  - some of mine are over 80 lines
  - create factory function
  - create a wrapper in each test
  - can apply to Vuex config

## Testing Vuex in components
- topics: Vuex, namespaced modules
- component with simple store
    - straightforward if a little verbose
    - recommend in the vue-test-utils docs
    - doesn't scale well
    - assertions are a bit weird
    - first arg is "context" just like in a real Vuex action
    - won't work for namespaced modules
- complex example
  - namespaced modules
  - requires a lot of boilerplate
  - simplifies things for larger components
  - would be less if you keep components small
  - but makes assertions more intuitive IMO

## Outro
- thanks to vue test utils
- Edd Yerburgh for his book
- questions?
