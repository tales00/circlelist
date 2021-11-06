<template lang="pug">
.listView
  | {{ evName }} / {{ listId }}
  .btn
    router-link(:to="{name: 'Home'}") back
</template>

<script>
export default {
  name: 'listView',
  props: ['evName', 'listId'],
  // setup() {},
};
</script>
