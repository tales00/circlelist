<template lang="pug">
.onLoading(v-if="status.isLoading")
  h2 Now loading...
  ul
    li.listId
      .name List Id
      .content.ellipsis {{ listId }}

    li.settings
      .name settings
      .content(v-if="status.isSettingReady") OK!
      .content(v-else) Loading...

    li.lists
      .name lists
      .content(v-if="status.isListReady") OK!
      .content(v-else) Loading...

.onError(v-if="status.isError")
  h2 error
  ul
    li.error
      .name error
      .content {{ status.errorMessage }}
    li
      .name link
      .content #[a(:href="sheet_url" style="text-decoration: underline;") open origin sheet]
</template>

<script>
export default {
  name: 'listView_loading',
  props: ['isReady', 'listId', 'sheet_url', 'status'],
  // setup() {},
};
</script>

<style lang="scss" scoped>
.onLoading,
.onError {
  display: grid;
  // align-items: center;
  justify-content: center;

  ul {
    min-width: 70vw;
    max-width: 42rem;
    display: grid;
    gap: 1rem;
    padding: 0;
    margin: 0 auto;
    li {
      list-style: none;
      display: flex;
      gap: 1rem;
      align-items: center;

      &.listId .content {
        max-width: 60vw;
      }
    }

    .name {
      min-width: 4rem;
      text-align: center;
      background-color: lightgray;
      border-radius: 0.4rem;
      padding: 0.3rem 0.8rem;
    }
    .content {
      overflow: hidden;
    }
  }
}
</style>
