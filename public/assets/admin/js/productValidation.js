
const productnameEl = document.querySelector('#productname');
const descriptionEl = document.querySelector('#description');
const priceEl = document.querySelector('#price');
const modelE1 = document.querySelector('#model');

const form = document.querySelector('#signup');


const checkProductname = () => {

let valid = false;

const min = 3, max = 30;

const productname = productnameEl.value.trim();

if (!isRequired(productname)) {
showError(productnameEl, 'productname cannot be blank.');
} else if (!isBetween(productname.length, min, max)) {
showError(productnameEl, `productname must be between ${min} and ${max} characters.`)
} else {
showSuccess(productnameEl);
valid = true;
}
return valid;
};


const checkDescription = () => {
let valid = false;
const description = descriptionEl.value.trim();
if (!isRequired(description)) {
showError(descriptionEl, 'description cannot be blank.');
} else if (!isBetween(description)) {
showError(descriptionEl, 'description is not valid.')
} else {
showSuccess(descriptionEl);
valid = true;
}
return valid;
};

const checkPrice = () => {
let valid = false;

const min = 1, max = 1000000;

const price = priceEl.value;

if (!isRequired(price)) {
showError(priceEl, 'price cannot be blank.');
}else if(!isBetween(price, min ,max)){
showError(priceEl, `price must be between ${min} and ${max}`)
}else {
showSuccess(priceEl);
valid = true;
}

return valid;
};


const checkModel =()=>{
let valid = false;
const model = modelE1.value.trim();
if (!isRequired(model)) {
showError(modelE1, 'model number cannot be blank.');
}  else {
showSuccess(modelE1);
valid = true;
}
return valid;

}

const isDescriptionValid = (description) => {
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
return re.test(description);
};



const isPasswordSecure = (price) => {
const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");
return re.test(price);
};

const isRequired = value => value === '' ? false : true;
const isBetween = (price, min ,max) => price < min && price > max ? false : true;


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
let isProductnameValid = checkProductname(),
isDescriptionValid = checkDescription(),
isPriceValid = checkPrice(),
ModelValid = checkModel()

let isFormValid = isProductnameValid &&
isDescriptionValid &&
isPriceValid &&
ModelValid 

// submit to the server if the form is valid
if (isFormValid) {

// $("#signup").submit((e)=>{
    
//     $.ajax({
//         url:"/register-submit",
//         data:{
//             name:"productname",
//             price:"price"
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
case 'productname':
    checkProductname();
    break;
case 'description':
    checkDescription();
    break;
case 'price':
    checkPrice();
    break;
case 'model':
    checkModel();
    break;
}
}));



