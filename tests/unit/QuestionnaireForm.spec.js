import { mount } from "@vue/test-utils";
import Questionnaire from "@/components/Questionnaire.vue";
import questionConfig from "@/data/questionConfig.json";

jest.mock("@/data/questionConfig.json", () => ({
  questions: [
    {
      id: "Q1",
      question: "What is your full legal name?",
      type: "text",
      next: "Q2",
    },
    {
      id: "Q2",
      question: "What is your birth year?",
      type: "year",
      next: "Q3",
    },
    {
      id: "Q3",
      question: "What is your marital status?",
      type: "select",
      options: ["Single", "Married", "Divorced", "Widowed", "Domestic Partner"],
      next: "Q4",
    },
  ],
}));

describe("Questionnaire.vue", () => {
  it("renders the first question", () => {
    const wrapper = mount(Questionnaire);
    expect(wrapper.text()).toContain("What is your full legal name?");
  });

  it("navigates to the next question on answer", async () => {
    const wrapper = mount(Questionnaire);
    const input = wrapper.find("input");
    await input.setValue("John Doe");
    await wrapper.vm.handleAnswer("John Doe");
    await wrapper.vm.nextQuestion();

    expect(wrapper.vm.currentQuestionId).toBe("Q2");
    expect(wrapper.text()).toContain("What is your birth year?");
  });

  it("saves answers and navigates to summary", async () => {
    const wrapper = mount(Questionnaire);
    await wrapper.vm.handleAnswer("John Doe");
    await wrapper.vm.nextQuestion();
    await wrapper.vm.handleAnswer(1990);
    await wrapper.vm.nextQuestion();
    await wrapper.vm.handleAnswer("Single");
    await wrapper.vm.nextQuestion();

    expect(sessionStorage.getItem("formData")).toContain("John Doe");
    expect(sessionStorage.getItem("formData")).toContain("1990");
    expect(sessionStorage.getItem("formData")).toContain("Single");
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: "QuestionnaireSummary",
    });
  });
});
