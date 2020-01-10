const packItems = (items = [], startIndex = 0) => {
  return items.map((item, i) => ({index: startIndex + i, data: item}));
};

export default packItems;
