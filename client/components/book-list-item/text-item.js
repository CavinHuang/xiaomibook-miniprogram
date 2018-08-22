/**
 * text book item script
 */

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    },
    currentIndex: {
      type: Number,
      value: 0
    }
  },
  onLoad: () => {
    console.log(this.item);

  }
})