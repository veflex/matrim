<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title
      :id="iconName"
      lang="fr"
    >{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({
  name: "IconBase"
})
class IconBase extends Vue {
  @Prop({ default: 'box' }) iconName!: String;
  @Prop({ default: '18' }) width!: Number | String;
  @Prop({ default: '18' }) height!: Number | String;
  @Prop({ default: '0 0 180 180' }) viewBox!: String | undefined;
  @Prop({ default: '#fff' }) iconColor!: String | undefined;
}
export default IconBase;
</script>
