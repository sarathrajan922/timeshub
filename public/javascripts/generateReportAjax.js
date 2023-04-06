function generateSalesReport (format,orderId) {
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