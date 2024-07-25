import { createRouter, createWebHistory } from "vue-router";
import UserLogin from "../components/UserLogin.vue";
import QuestionnaireForm from "../components/QuestionnaireForm.vue";
import QuestionnaireSummary from "../components/QuestionnaireSummary.vue";
import SuccessPage from "../components/SuccessPage.vue";
import { auth } from "../firebaseConfig";

const routes = [
  { path: "/login", component: UserLogin },
  {
    path: "/questionnaire",
    name: "QuestionnaireForm",
    component: QuestionnaireForm,
  },
  {
    path: "/questionnaire-summary",
    name: "QuestionnaireSummary",
    component: QuestionnaireSummary,
  },
  { path: "/", redirect: "/login" },
  {
    path: "/success",
    name: "SuccessPage",
    component: SuccessPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else {
    next();
  }
});

export default router;
