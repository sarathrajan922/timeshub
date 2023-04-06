

  const imagebox1 = document.getElementById('image-box1')
  const crop_btn1 = document.getElementById('crop-btn1')
  const input1 = document.getElementById('id_image1')
  function viewImage1(event) {
    var fileInput1 = document.getElementById('id_image1');
    var filePath1 = fileInput1.value;
    var allowedExtensions =
      /(\.jpg|\.jpeg|\.png|\.gif|\.jfif|\.webp)$/i;
    if (!allowedExtensions.exec(filePath1)) {
      fileInput1.value = '';
      swal("There is a problem!", "Please choose image file.");
      return false;
    } else {
      document.getElementById('imgView1').src = URL.createObjectURL(event.target.files[0])
    }
  }
  // When user uploads the image this event will get triggered
  input1.addEventListener('change', () => {
    // Getting image file object from the input variable
    const img_data1 = input1.files[0]
    // createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
    // The new object URL represents the specified File object or Blob object.
    const url1 = URL.createObjectURL(img_data1)
    // Creating a image tag inside imagebox which will hold the cropping view image(uploaded file) to it using the url created before.
    imagebox1.innerHTML = `<img src="${url1}" id="image1" style="width:100%;">`
    // Storing that cropping view image in a variable
    const image1 = document.getElementById('image1')
    // Displaying the image box
    document.getElementById('image-box1').style.display = 'block'
    // Displaying the Crop buttton
    document.getElementById('crop-btn1').style.display = 'block'
    document.getElementById('imgView1').style.display = 'block'
    // Hiding the Post button
    const cropper1 = new Cropper(image1, {
      autoCropArea: 1,
      viewMode: 1,
      scalable: false,
      zoomable: false,
      movable: false,
      minCropBoxWidth: 50,
      minCropBoxHeight: 50,
      aspectRatio: 1 / 1,
    })
    // When crop button is clicked this event will get triggered
    crop_btn1.addEventListener('click', () => {
      // This method coverts the selected cropped image on the cropper canvas into a blob object
      cropper1.getCroppedCanvas().toBlob((blob) => {
        // Gets the original image data
        let fileInputElement1 = document.getElementById('id_image1');
        // Make a new cropped image file using that blob object, image_data.name will make the new file name same as original image
        let file1 = new File([blob], img_data1.name, { type: "image/*", lastModified: new Date().getTime() });
        // Create a new container
        let container1 = new DataTransfer();
        // Add the cropped image file to the container
        container1.items.add(file1);
        // Replace the original image file with the new cropped image file
        fileInputElement1.files = container1.files;
        document.getElementById('imgView1').src = URL.createObjectURL(fileInputElement1.files[0])
        // Hide the cropper box
        document.getElementById('image-box1').style.display = 'none'
        // Hide the crop button
        document.getElementById('crop-btn1').style.display = 'none'
      })
    })
  })
  const imagebox2 = document.getElementById('image-box2')
  const crop_btn2 = document.getElementById('crop-btn2')
  const input2 = document.getElementById('id_image2')
  function viewImage2(event) {
    var fileInput2 = document.getElementById('id_image2');
    var filePath2 = fileInput2.value;
    var allowedExtensions =
      /(\.jpg|\.jpeg|\.png|\.gif|\.jfif|\.webp)$/i;
    if (!allowedExtensions.exec(filePath2)) {
      fileInput1.value = '';
      swal("There is a problem!", "Please choose image file.");
      return false;
    } else {
      document.getElementById('imgView2').src = URL.createObjectURL(event.target.files[0])
    }
  }
  // When user uploads the image this event will get triggered
  input2.addEventListener('change', () => {
    // Getting image file object from the input variable
    const img_data2 = input2.files[0]
    // createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
    // The new object URL represents the specified File object or Blob object.
    const url2 = URL.createObjectURL(img_data2)
    // Creating a image tag inside imagebox which will hold the cropping view image(uploaded file) to it using the url created before.
    imagebox2.innerHTML = `<img src="${url2}" id="image2" style="width:100%;">`
    // Storing that cropping view image in a variable
    const image2 = document.getElementById('image2')
    // Displaying the image box
    document.getElementById('image-box2').style.display = 'block'
    // Displaying the Crop buttton
    document.getElementById('crop-btn2').style.display = 'block'
    document.getElementById('imgView2').style.display = 'block'
    // Hiding the Post button
    const cropper2 = new Cropper(image2, {
      autoCropArea: 1,
      viewMode: 1,
      scalable: false,
      zoomable: false,
      movable: false,
      minCropBoxWidth: 50,
      minCropBoxHeight: 50,
      aspectRatio: 1 / 1,
    })
    // When crop button is clicked this event will get triggered
    crop_btn2.addEventListener('click', () => {
      // This method coverts the selected cropped image on the cropper canvas into a blob object
      cropper2.getCroppedCanvas().toBlob((blob) => {
        // Gets the original image data
        let fileInputElement2 = document.getElementById('id_image2');
        // Make a new cropped image file using that blob object, image_data.name will make the new file name same as original image
        let file2 = new File([blob], img_data2.name, { type: "image/*", lastModified: new Date().getTime() });
        // Create a new container
        let container2 = new DataTransfer();
        // Add the cropped image file to the container
        container2.items.add(file2);
        // Replace the original image file with the new cropped image file
        fileInputElement2.files = container2.files;
        document.getElementById('imgView2').src = URL.createObjectURL(fileInputElement2.files[0])
        // Hide the cropper box
        document.getElementById('image-box2').style.display = 'none'
        // Hide the crop button
        document.getElementById('crop-btn2').style.display = 'none'
      })
    })
  })
  const imagebox3 = document.getElementById('image-box3')
  const crop_btn3 = document.getElementById('crop-btn3')
  const input3 = document.getElementById('id_image3')
  function viewImage3(event) {
    var fileInput3 = document.getElementById('id_image3');
    var filePath3 = fileInput3.value;
    var allowedExtensions =
      /(\.jpg|\.jpeg|\.png|\.gif|\.jfif|\.webp)$/i;
    if (!allowedExtensions.exec(filePath3)) {
      fileInput3.value = '';
      swal("There is a problem!", "Please choose image file.");
      return false;
    } else {
      document.getElementById('imgView3').src = URL.createObjectURL(event.target.files[0])
    }
  }
  // When user uploads the image this event will get triggered
  input3.addEventListener('change', () => {
    // Getting image file object from the input variable
    const img_data3 = input3.files[0]
    // createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
    // The new object URL represents the specified File object or Blob object.
    const url3 = URL.createObjectURL(img_data3)
    // Creating a image tag inside imagebox which will hold the cropping view image(uploaded file) to it using the url created before.
    imagebox3.innerHTML = `<img src="${url3}" id="image3" style="width:100%;">`
    // Storing that cropping view image in a variable
    const image3 = document.getElementById('image3')
    // Displaying the image box
    document.getElementById('image-box3').style.display = 'block'
    // Displaying the Crop buttton
    document.getElementById('crop-btn3').style.display = 'block'
    // Hiding the Post button
    const cropper3 = new Cropper(image3, {
      autoCropArea: 1,
      viewMode: 1,
      scalable: false,
      zoomable: false,
      movable: false,
      minCropBoxWidth: 50,
      minCropBoxHeight: 50,
      aspectRatio: 1 / 1,
    })
    // When crop button is clicked this event will get triggered
    crop_btn3.addEventListener('click', () => {
      // This method coverts the selected cropped image on the cropper canvas into a blob object
      cropper3.getCroppedCanvas().toBlob((blob) => {
        // Gets the original image data
        let fileInputElement3 = document.getElementById('id_image3');
        // Make a new cropped image file using that blob object, image_data.name will make the new file name same as original image
        let file3 = new File([blob], img_data3.name, { type: "image/*", lastModified: new Date().getTime() });
        // Create a new container
        let container3 = new DataTransfer();
        // Add the cropped image file to the container
        container3.items.add(file3);
        // Replace the original image file with the new cropped image file
        fileInputElement3.files = container3.files;
        document.getElementById('imgView3').src = URL.createObjectURL(fileInputElement3.files[0])
        // Hide the cropper box
        document.getElementById('image-box3').style.display = 'none'
        // Hide the crop button
        document.getElementById('crop-btn3').style.display = 'none'
        document.getElementById('imgView3').style.display = 'block'
      })
    })
  })

 
