import { createLocalVue, mount, shallowMount } from "@vue/test-utils"
import ElementUI from "element-ui"

const localVue = createLocalVue()
localVue.use(ElementUI)

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

const DatePickerStub = {
  props: ["value"],
  template: `
    <input :value="value" @input="$emit('input', $event.target.value)" />
  `,
}

describe("Stubbing Components", () => {
  it("datepicker without stub", () => {
    const wrapper = mount(DateForm, {
      localVue,
    })

    console.log("datepicker without stub", wrapper.html())
    // <form><div class="el-date-editor el-input el-input--prefix el-input--suffix el-date-editor--date"><!----><input type="text" autocomplete="off" name="" class="el-input__inner"><span class="el-input__prefix"><i class="el-input__icon el-icon-date"></i><!----></span><span class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-input__icon"></i><!----><!----><!----><!----></span><!----></span><!----><!----></div></form>

    const input = wrapper.find("input")
    input.setValue("2020-03-05")
    console.log("datepicker without stub - setValue", wrapper.vm.date)
    // should equal "2020-03-05" but "2020-02-06" is returned
  })

  it("datepicker with stub", () => {
    const wrapper = shallowMount(DateForm, {
      localVue,
      stubs: {
        ElDatePicker: DatePickerStub,
      },
    })

    console.log("datepicker with stub", wrapper.html())
    // <form><input></form>

    const input = wrapper.find("input")
    input.setValue("2020-03-05")
    console.log("datepicker with stub - setValue", wrapper.vm.date)
    // now equals "2020-03-05"
  })
})
