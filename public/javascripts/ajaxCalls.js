

const changeQuantity = (cartId, productId, userId, count) => {
    const quantity = parseInt(document.getElementById(productId).innerHTML);
    const data = {
      cartId,
      productId,
      count,
      quantity,
      userId
    };
    
    $.ajax({
      type: 'POST',
      url: '/change-quantity',
      data,
      success: ({ removed, total }) => {
        if (removed) {
          console.log("Product removed from your cart");
          location.reload();
        } else {
          document.getElementById(productId).innerHTML = `${quantity + count}`;
          document.getElementById('totalAmount').innerHTML = `${total.total}`;
          console.log(total.total);
        }
      },
      error: (error) => {
        console.error(JSON.stringify(error));
        // Display error message on the page or use a more user-friendly approach
      }
    });
  };
  

    const register=() => {
            $.ajax({
        url:"/register-submit",
        // data:{
        //     userId:userId,
        //     currentStat:currStatus
        // },
        method:'post',
        success:(res)=>{
            
        }
      })
    }

 function addtoCart(productId){
    console.log(productId)
    $.ajax({
        url: `/add-to-cart/${productId}`,
        method:'get',
        success:(response)=>{
            if(response.status){
                location.reload()
            }
        }
    })
   }


