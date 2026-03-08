import readingFadeIn from "~/directives/readingFadeIn";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reading-fade-in", readingFadeIn);
});
