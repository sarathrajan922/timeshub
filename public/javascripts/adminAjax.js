const generateReport = (format)=>{

  
 $.ajax({
   url: "/admin/download-report",
   data: { format },
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
             swal("Poof! Your Sales Report has been downloaded!", {
                 icon: "success",
                 });
             } else {
             swal("Your Sales Report is not downloaded!");
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

   }







   const emailEl = document.querySelector('#email');
    const passwordEl = document.querySelector('#password');
    
    
    const form = document.querySelector('#signup');
    
    
    
    
    
    const checkEmail = () => {
    let valid = false;
    const email = emailEl.value.trim();
    if (!isRequired(email)) {
        showError(emailEl, 'Email cannot be blank.');
    } else if (!isEmailValid(email)) {
        showError(emailEl, 'Email is not valid.')
    } else {
        showSuccess(emailEl);
        valid = true;
    }
    return valid;
    };
    
    const checkPassword = () => {
    let valid = false;
    
    const min = 3;
    const max = 8;
    
    const password = passwordEl.value.trim();
    
    if (!isRequired(password)) {
        showError(passwordEl, 'Password cannot be blank.');
    }else if(!isBetween(password.length, min, max)){
        showError(passwordEl, `Password must be between ${min} and ${max}`)
    }else {
        showSuccess(passwordEl);
        valid = true;
    }
    
    return valid;
    };
    
    // const checkConfirmPassword = () => {
    //     let valid = false;
    //     // check confirm password
    //     const confirmPassword = confirmPasswordEl.value.trim();
    //     const password = passwordEl.value.trim();
    
    //     if (!isRequired(confirmPassword)) {
    //         showError(confirmPasswordEl, 'Please enter the password again');
    //     } else if (password !== confirmPassword) {
    //         showError(confirmPasswordEl, 'The password does not match');
    //     } else {
    //         showSuccess(confirmPasswordEl);
    //         valid = true;
    //     }
    
    //     return valid;
    // };
    
    
    
    const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    };
    
    
    
    const isPasswordSecure = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");
    return re.test(password);
    };
    
    const isRequired = value => value === '' ? false : true;
    const isBetween = (length, min, max) => length < min || length > max ? false : true;
    
    
    const showError = (input, message) => {
    // get the form-field element
    const formField = input.parentElement;
    // add the error class
    formField.classList.remove('success');
    formField.classList.add('error');
    
    // show the error message
    const error = formField.querySelector('small');
    error.textContent = message;
    };
    
    const showSuccess = (input) => {
    // get the form-field element
    const formField = input.parentElement;
    
    // remove the error class
    formField.classList.remove('error');
    formField.classList.add('success');
    
    // hide the error message
    const error = formField.querySelector('small');
    error.textContent = '';
    }
    
    
    form.addEventListener('submit', function (e) {
    // prevent the form from submitting
    
    
    // validate fields
    let isEmailValid = checkEmail(),
        isPasswordValid = checkPassword()
       
    
    let isFormValid = isEmailValid &&
        isPasswordValid 
       
    
    // submit to the server if the form is valid
    if (isFormValid) {
        
        // $("#signup").submit((e)=>{
            
        //     $.ajax({
        //         url:"/register-submit",
        //         data:{
        //             name:"username",
        //             password:"password"
        //         },
        //         type:"POST",
        //         success:function (response){
        //             window.location.reload()
        //             //window.location.href="https://google.com"
        //         },
        //         error:function (err){
        //             alert("Something Error")
        //         }
        //     })
        // })
    
    
    }
    });
    
    
    const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
    };
    
    form.addEventListener('input', debounce(function (e) {
    switch (e.target.id) {
        
        case 'email':
            checkEmail();
            break;
        case 'password':
            checkPassword();
            break;
        
    }
    }));
    
    
    