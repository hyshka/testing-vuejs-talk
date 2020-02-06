## Overview
- Intro
- 0. Mounting components
- 1. Testing asynchronous DOM updates and Promises
- 3. Stubbing components
- 4. Mocking methods injected into the Vue instance
- 2. Mocking the Vuex store within components
- Outro

## Intro
- explain why I wanted to do this talk
  - started new job in July
  - no test coverage
  - not much documentation out there
- assume working knowledge of Vue, Vuex, and Jest
- will be working with the official unit testing library, Vue Test Utils
- a lot of info, do my best to get through it, slides available on GitHub
- because I want to give as much info, make a note if you have any questions,
    and I'll do my best to answer at the end

## Mounting components
- topics: vue-test-utils
- mount vs. shallowMount
  - mount, creates wrapper that contains the mounted and rendered Vue
    component
  - shallowMount, same as mount but with stubbed child components
  - start with shallowMount, as it better isolates your unit tests
  - Gotcha: I end up using mount a lot when I'm using a component framework
- mounting a component that relies on external dependencies
    - component libraries, filter libraries, Vuex, etc.
    - anything that uses Vue.use()
    - avoids polluting a global instance
- wrapper methods
  - wrapper.vm -> the mounted Vue instance
  - wrapper.element -> the root DOM node
  - wrapper.find() -> select element, returns wrapper
  - setValue/setSelected/setChecked?

## Testing asynchronous DOM updates and Promises
- topics: Promises, async/await, Vue DOM batching (nextTick), microtask event queue
- testing DOM updates
  - Vue batches DOM updates and applies them asyncrounously
  - you need to make your test async and `await Vue.nextTick()`
  - or, if you've mounted with localVue, use `await localVue.nextTick()`
- testing with promises
  - even though you may have mocked your promises, no network requests
  - they won't resolve immediately
  - flush the microtask event queue
  - easy helper for this called flush-promises
  - basically just a wrapper around setImmediate or setTimeout
  - it returns a promise that resolves when the browser has hit it's next "tick"
      in the event queue

## Stubbing components
- topics: Vue, vue-test-utils, form input bindings (v-model)
- show component that will fail
  - so far, only needed for 3rd party components
  - ex. fancy select inputs or date pickers
  - throwing errors when mounting
- show example of ElDatePicker which can't use setValue
  - note that we're using `mount` here
  - setValue/setSelected
  - components don't expose or handle input events correctly
- show creating a stub
  - replicate the behaviour you want to test
  - no longer testing production code
  - at least you can test how your code interfaces with the library

## Mocking methods injected into the Vue instance
- topics: Vuex, vue router, 3rd party Vue packages
- need to test properties/methods on Vue instance
- common with 3rd party libraries
- easy if you need the same values for each test
  - create wrapper as usual with `mocks` option
  - example of component that relys on $route + $router
- more cumbersome when testing more values or bigger components
  - some of mine are over 80 lines (show example)
  - create a wrapper in each test w/ factory function
  - I apply this to Vuex config

## Testing Vuex in components
- topics: Vuex, namespaced modules
- component with simple store is straightforward
    - if a little verbose
    - this is what they recommend in the vue-test-utils docs
    - assertions are a bit weird
    - first arg is "context" just like in a real Vuex action
- mocking dispatch
  - simplifies things for larger components
  - works with namespaced modules
  - requires a lot of boilerplate
  - would be less if you keep components small
  - but makes assertions more intuitive IMO

## Outro
- thanks to vue test utils
- and Edd Yerburgh for his vue testing book (250 pages)
- questions?
