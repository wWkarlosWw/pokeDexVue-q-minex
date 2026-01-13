export function UsePaginLimits() {
  const limit = 10;
  const page = ref(1);
  const offset = computed(() => (page.value - 1) * limit);
  return {
    limit,
    page,
    offset,
  };
}
