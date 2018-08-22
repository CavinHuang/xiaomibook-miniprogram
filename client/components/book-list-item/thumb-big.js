/**
 *  book list big pic  item component 
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
      showTag: {
        type: Boolean,
        value: false
      }
    },
    onLoad: () => {
      console.log(this.item);

    }
  })