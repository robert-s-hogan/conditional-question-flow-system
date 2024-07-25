import { mount } from "@vue/test-utils";
import QuestionnaireSummary from "@/components/QuestionnaireSummary.vue";
import questionConfig from "@/data/questionConfig.json";

jest.mock("@/data/questionConfig.json", () => ({
  questions: [
    {
      id: "Q1",
      question: "What is your full legal name?",
      type: "text",
    },
    {
      id: "Q2",
      question: "What is your birth year?",
      type: "year",
    },
    {
      id: "Q3",
      question: "What is your marital status?",
      type: "select",
      options: ["Single", "Married", "Divorced", "Widowed", "Domestic Partner"],
    },
  ],
}));

describe("QuestionnaireSummary.vue", () => {
  it("displays the summary of answers", () => {
    sessionStorage.setItem(
      "formData",
      JSON.stringify({
        Q1: "John Doe",
        Q2: 1990,
        Q3: "Single",
      })
    );

    const wrapper = mount(QuestionnaireSummary);

    expect(wrapper.text()).toContain("What is your full legal name?: John Doe");
    expect(wrapper.text()).toContain("What is your birth year?: 1990");
    expect(wrapper.text()).toContain("What is your marital status?: Single");
  });

  it("submits the form data", async () => {
    sessionStorage.setItem(
      "formData",
      JSON.stringify({
        Q1: "John Doe",
        Q2: 1990,
        Q3: "Single",
      })
    );

    const wrapper = mount(QuestionnaireSummary);
    await wrapper.vm.finalSubmit();

    expect(wrapper.vm.submissionMessage).toBe("Data submitted successfully!");
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: "SuccessPage",
    });
  });
});
