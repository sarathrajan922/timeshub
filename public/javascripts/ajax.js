// const { response } = require("express");


const changeQuantity = (cartId, productId, userId, count,i) => {
  let quantity = parseInt(document.getElementById(productId).innerHTML);
  $.ajax({
    type: "POST",
    url: "/change-quantity",
    data: {
      cartId: cartId,
      productId: productId,
      count: count,
      quantity: quantity,
      userId: userId,
      i,
    
    },
    success: (response) => {
      if (response.removed) {
        // alert("Product reomove from your cart");
        // swal({
        //   title: "Are you sure?",
        //   text: "Once deleted, it will disapear!",
        //   icon: "warning",
        //   buttons: true,
        //   dangerMode: true,
        // }).then((willDelete) => {
        //   if (willDelete) {
        //     swal("Poof! Your item has been deleted!", {
        //       icon: "success",
        //     });
        //   } else {
        //     swal("Your item is safe!");
        //   }
        // });
      } else {
        console.log(response)
        document.getElementById(productId).innerHTML = quantity + count;
        let india = new Intl.NumberFormat("en-IN",{
          style: 'currency',
          currency: 'INR'
      })
        const total = india.format(response.total.total)
        const subtotal = india.format(response.subtotal)
        document.getElementById("totalAmout").innerHTML = total;
        document.getElementById("subtotal").innerHTML = total;
        document.getElementById(productId+'-subtotal').innerHTML = subtotal

        console.log(response.total);

        //  const subtotalArr = response.subtotal
        //  for(let i=0; i < subtotalArr.length; i++){
        //   const subtotal = subtotalArr[i].subtotal
        //   const productId = subtotal._id.toString()
        //   document.getElementById(`${productId}-subtotal`).innerHTML = `${subtotal}`
        //  }
      }
    },
    error: function (data) {
      alert(data);
      console.log(JSON.stringify(data));
    },
  });
};

const removeCartItem = (cartId, prodcutId)=>{
  swal({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      swal("Poof! Your item has been deleted!", {
        icon: "success",
      }).then(() => {
        removeItem(cartId, prodcutId)
      });
    } else {
      swal("Your item is safe!");
    }
  });
}

const removeItem = (cartId, productId) => {
  $.ajax({
    type: "POST",
    url: "/delete-cartItem",
    data: {
      cartId: cartId,
      productId: productId,
    },
    success: (response) => {
      if (response.status) {
        location.reload();
      }
    },
  });
};

// const orderAndPayment=()=>{
//   $.ajax({
//     type: 'post',
//     url:'/proceed-to-checkout',
//     data: $('#checkout-form').serialize(),
//     success:(response)=>{
//       console.log(response)
//       if(response.status === 'COD'){
//         location.href('/order-success-page')
//       }else if(response.status === 'UPI'){
//         location.reload()
//       }
//     }
//   })
// }

// $("#checkout-form").submit((e) => {
//   e.preventDefault();
//   $.ajax({
//     url: '/proceed-to-checkout',
//     method: 'post',
//     data: $('#checkout-form').serialize(),
//     success: (response) => {
//       switch (response.status) {
//         case "COD":
//           swal("Successfull !", "Order Placed Successfully !", "success").then(
//             () => {
//               location.href("/order-success-page");
//             }
//           );
//         case "UPI":
//           razorPayPayment(response);
//       }
//     },
//     error: (response, stat, err) => {
//       console.log(response);
//     },
//   });
// });


function setData(id) {
  var id = id;
}
function deleteOrder(id) {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this order details!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      swal("Poof! Your order has been cancelled!", {
        icon: "success",
      }).then(() => {
        orderCancel(id);
      });
    } else {
      swal("Your order is safe!");
    }
  });
}



const generateSalesReport = (format,orderId) => {
console.log(format);
$.ajax({
url: "/download-invoice",
data: { format ,orderId },
method: "post",
xhrFields: {
  responseType: "blob", // set the response type to blob
},
success: function (response, status, xhr) {
  const contentType = xhr.getResponseHeader("Content-Type");
  const fileExtension = contentType === "application/pdf" ? "pdf" : "xlsx";
  const fileName = `sales-report.${fileExtension}`;
  const blob = new Blob([response], { type: contentType });

  if (contentType === "application/pdf") {
      swal({
          title: "Do you want to download the PDF file?",
          text: "",
          buttons: true,
          dangerMode: false,
      })
      .then((willDelete) => {
      if (willDelete) {
          const fileURL = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = fileURL;
          a.download = "file.pdf";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          swal("Poof! Your Order Invoice file has been downloaded!", {
              icon: "success",
              });
          } else {
          swal("Your Order Invoice file is not downloaded!");
        }
      });
  
  } else if ( contentType ==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ) {
      const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

   
    console.error("Unsupported file type:", contentType);
  }
},
error: function (xhr, status, error) {
  console.log("Error generating report:", error);
},
});
};









