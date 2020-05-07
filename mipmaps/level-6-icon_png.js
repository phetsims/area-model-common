/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const mipmaps = [
  {
    "width": 150,
    "height": 196,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 75,
    "height": 98,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 38,
    "height": 49,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 19,
    "height": 25,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAZCAYAAADTyxWqAAAAAklEQVR4AewaftIAAAUASURBVI3BC0zUdQAH8O/v/n/uxfuOx4HJQ94IKIhCoEJuhLrMqZjKTMhKotFmoY3pRDEfFTLFNGWSgtpQJDRxk1eagCITlBCUC4EU5Hlwd9xDjuP+/87ttm4I1edD8B9Yll2SVnnoBI+y6AkWeXcnh65JJ4RMYBo0TLoryraOtrZsDPtq1+eEkGcw+bmtPPak7GEIgJAN2uGxj8LWfoEZcGD0avBl6ItrJd8MFOyOq9ueUvWy7tZ6mHSMdPnBhMexGMS/4MBI+kvxfnVdoSuM1M333RVdnZEwCRF7N6ZLIss+sQ965G/r/hhmWJb16a68sQMmBEZ6jSroYc7hvJHykiinNR9Wh+/cE4d/iABMAhiDGUWXNLrt9ImzGmmrh9um5H3+G5MOE5h5dr3ke69V604SQp5vT1iQ7SK23kJRxBEsDHoD0zMwqrmaW9KYDqP6zJ3to1ez/WDEC3xPE5SekUrBzPGi4qqsrCxl8orgVLGtIMPWkific2liQVMcPpe2t7fmvR3m6xxV29J7MX3bp2JNjyKaUckp+9j3W/w2JR+jMI2EGL9TDMN6WtnPAsW1gsTVGwxlBZVWBxh0HInYMiD1SP5OIwdh4CJl+NeZ8YSQIYI32X2bEtNnI/YULImKwphaC4mDCH1DIzBM6pCbX3Dkak17NoAhTMGBibR5dMut6z3JABbxLGhBgF8AbKws4eIogk6vh7ODHTzdZiMuNnYVgCFMg7p48ml+oCTpXEXhQKLOoHeprs+7+G64R4pao+V4eMyBkhHC3icCinEC/uQYhgZ6HXydqdC6xy+LAbAwwyGETHTXj4vG5QzUyklvAG0TekPn5Kth1N6tBdHIoOx5Cr6mFwzLQi7rh6OdMC52vttmTEH9ePo7tuHOUKLAjsOKXXmK6vrT94rOHn8lshHEjGkmiJeXNywYHViDAQ1NDyAbfN79Z698b2mN9Fy4f9Lh+Z5Jpw4c3KfKL8xppo4cPdRxMHuvcONnXvuXb3BLy8rK6n3QPnDH0U4Qac2HmCuw17u/5cprfiJtv1lV+d3RK40bHnUMNrryExoqzgx/0P9kQqTj6F2q7ublUzC6cPlYdfbRg10wk5MhWxkS2DNuYJwsxSJ/G5Wml1m5tEwTH02CL93EnaTELxc+qVEvgBGHB8m1ytw/aExjRxJWRQQjYVwHrotDKeRjPLg5NjsFeGIzw0AJ4EzCVp89HS2q1RRNZGFLRAVOsyyvU5jGuQPkjIsj5uj0gJMIANMKW6tRCHizQXGU/GURhPgs3FdafT+vZnG8a/mFS8eKYEThTd57tpFMSyH4Y2rASghYCgGBewWg10OtaoKAP0vs5Zk4jyP/KyMqNNDn19/qi2BEYwqWZZXFhb/3hkyUC+jJn0acxSMucL4BiKIA1T3I5GKWtdjlGzlv0pemKCjVWiVMaEzR0MquTb28dC5FliLtnd2STI91AEcAaLsBygY6vY8UhNh1vujrGRpVtP5wvjQXJjTMrF++OKbrwcO0USYUr8lkWj0M1Vz0VwPCdEB7FmJb+bB7fH0ApkHDTJDvHMdhhVaRH1uAzj5r9DMrpNpxBAv5ALQ5eI1rARFmQMPM3uPnS5YvbhuJjQxd5mTNRfTcTprPRTDM0DQcMAMaU5TXNd0ur2u6DaMrOSRlwBkdIlt48XngqLXQDwyjGTMg+B/WLMPqj9ci4nIFai+U4SZm8Df7Nwbs6JjnkwAAAABJRU5ErkJggg=="
  },
  {
    "width": 10,
    "height": 13,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAANCAYAAACQN/8FAAAAAklEQVR4AewaftIAAAHNSURBVGMAgQvT+nP///8vzAAE8Vuqt0ZuKrv8//9/ZgYkwHRp9tTE5yvndx/KSV7NAAb/Wf79/8/CyMj49////8L3d22xZQAC5kkrVj5/cfmKNo+S8hpZ6V9RUveeiglceXTwwIVHexyf3z305tC+2O6FCw8yMkBBXZxVGScXd6uosAjLz58/GZ48f7bMS8zwz98f32Xtp80PZWQAgtMHX7juWx5RYm3n4yYoIMDw+/dvhm37j7RVTVhazQAFTLUpp84t6bu3guH//8+vXjxhYOCVYuDgFWLgZf6eZq8va8QABUxcvMyn+URZjjKJGcy5fv3S619vH/y5c+vanXfvXk5xtlnfWJty6hQDEDAyQEFJPINmXjTDpi8/M2XZWG68e/9h//KNu08Z//n1X7KoUyeAmQEKVnQxdAsLMDiJ8J9hERDx5/3/57oEr7DC/n9MRzY4+PnvYmGAgunHXwjpiN38EeV5koOBx5jhw01mQcb///y//vj5mAEIWBiAoCQpxIz733PTXZcU/oRb2TMwf7VjEOY5tFQ/kCGHAQqYGYDg2PlrT211v900Uzt7Vl36lAMjw0PmT18ZLvQvZtjCgAsEOjFoLetg8GdAAwDHPbvIhWNKFAAAAABJRU5ErkJggg=="
  }
];
mipmaps.forEach( mipmap => {
  mipmap.img = new Image();
  const unlock = simLauncher.createLock( mipmap.img );
  mipmap.img.onload = unlock;
  mipmap.img.src = mipmap.url; // trigger the loading of the image for its level
  mipmap.canvas = document.createElement( 'canvas' );
  mipmap.canvas.width = mipmap.width;
  mipmap.canvas.height = mipmap.height;
  const context = mipmap.canvas.getContext( '2d' );
  mipmap.updateCanvas = () => {
    if ( mipmap.img.complete && ( typeof mipmap.img.naturalWidth === 'undefined' || mipmap.img.naturalWidth > 0 ) ) {
      context.drawImage( mipmap.img, 0, 0 );
      delete mipmap.updateCanvas;
    }
  };
} );
export default mipmaps;