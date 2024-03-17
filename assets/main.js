
// AJAX ADD TO CART
const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');

addToCartForms.forEach( (form) => {
  form.addEventListener('submit', async(event) => {
    event.preventDefault()

    var cartBtn = document.querySelector('#AddToCart');
    cartBtn.textContent = 'Add To Cart ...';
    await fetch('/cart/add', {
      method: 'post',
      body: new FormData(form)
    })

    cartBtn.textContent = 'Add To Cart'

    // get the cart info
    const res = await fetch('/cart.json')
    const cart = await res.json()
    //console.log(cart)

    // update cart cout
    document.querySelectorAll('.cart-count').forEach( (el) => {
      el.textContent = cart.item_count
    })

    // display messae
    const message = document.createElement('p')
    message.classList.add('added-to-cart')
    message.textContent = 'Added to cart!';
    form.querySelector('.cart-button').appendChild(message)
  })
})


// MONEY FORMAT
var formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};