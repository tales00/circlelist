<template lang="pug">
.listView
  | {{ evName }} / 
  | {{ listId }}
</template>

<script>
export default {
  name: 'listView',
  props: ['evName', 'listId'],
  // setup() {},
};
</script>
