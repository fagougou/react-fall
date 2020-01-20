const rmSize = () => Math.floor(100 + Math.random() * 300);

export const getImageList = ({pageSize}) => {
  return new Promise((resolve) => {
    const list = [];
    for (let i = 0; i < pageSize; i++) {
      list.push({id: Date.now().toString(16), url: `http://dummyimage.com/${rmSize()}x${350}`});
    }
    setTimeout(() => {
      resolve(list);
    }, 500);
  });
};
