const listProducts = document.querySelector('#listProducts');
const contentProducts = document.querySelector('#contentProducts');
const emptyCart = document.querySelector('#emptyCart');

let productsArray = [];


document.addEventListener('DOMContentLoaded', function () {
    eventListeners();

});

function eventListeners() {
    listProducts.addEventListener('click', getDataElements);
    emptyCart.addEventListener('click', function(){
        productsArray = [];
        productsHtml();
        updateCartCount();
        updateTotal();
    })
    const loadProduct = localStorage.getItem('products');
    if (loadProduct){
        productsArray =JSON.parse(loadProduct);
        productsHtml();
        updateCartCount();

    }else {
        productsArray = [];
    }
}

function updateCartCount(){
    const cartCount = document.querySelector('#cartCount');
    cartCount.textContent = productsArray.length;

}
function updateTotal() {
    const total = document.querySelector('#total');
    let totalProduct = productsArray.reduce((total,prod) => total + prod.price * prod.quantity, 0);
    total.textContent = `$${totalProduct.toFixed(2)}`;
    
}

function getDataElements(e) {
    if (e.target.classList.contains('btn-add')) {
        const elementHtml = e.target.parentElement.parentElement;
        selectData(elementHtml);
    }
};

function selectData(prod) {
    console.log(prod);
    const productObj = {
        img: prod.querySelector('img').src,
        title: prod.querySelector('h4').textContent,
        price: parseFloat(prod.querySelector('#currentPrice').textContent.replace('$', '')),
        id: parseInt(prod.querySelector('button[type="button"]').dataset.id, 10),
        quantity: 1
    }

    const exists = productsArray.some(prod => prod.id === productObj.id);
    
    if (exists) {
        showAlert('El producto ya existe en el carrito', 'error');
        return;
    }

    ///Lo uso para revisar el Objeto "const productObj" console.log(productObj);

    productsArray = [...productsArray, productObj]
    showAlert('Producto añadido correctamente', 'success');

    //console.log(productsArray);

    productsHtml();
    updateCartCount();
    
    updateTotal();

}

function productsHtml() {
    cleanHtml();
    productsArray.forEach(prod => {
        const { img, title, price, id, quantity } = prod;

        const tr = document.createElement('tr');
        const tdImg = document.createElement('td');
        const prodImg = document.createElement('img');

        prodImg.src = img;
        prodImg.alt = 'image product';
        tdImg.appendChild(prodImg);

        const tdTitle = document.createElement('td');
        const prodTitle = document.createElement('p');
        prodTitle.textContent = title;
        tdTitle.appendChild(prodTitle);

        const tdPrice = document.createElement('td');
        const prodPrice = document.createElement('p');
        const newPrice = price * quantity;
        prodPrice.textContent =  `$${newPrice.toFixed(2)}`;
        tdPrice.appendChild(prodPrice);

        const tdQuantity = document.createElement('td');
        const prodQuantity = document.createElement('input');
        prodQuantity.type = 'number'
        prodQuantity.min = '1';
        prodQuantity.value = quantity;
        prodQuantity.dataset.id = id;
        prodQuantity.oninput = updateQuantity;

        tdQuantity.appendChild(prodQuantity);

        const tdDelete = document.createElement('td');
        const prodDelete = document.createElement('button');
        prodDelete.type = 'button';
        prodDelete.textContent = 'X';
        prodDelete.onclick = () => destroyProduct (id);
        tdDelete.appendChild(prodDelete);


        tr.append(tdImg, tdTitle, tdPrice, tdQuantity, tdDelete);
        contentProducts.appendChild(tr);

    });
    saveLocalStorage();
}

function saveLocalStorage(){
    localStorage.setItem('products', JSON.stringify(productsArray));
}

function updateQuantity(e){
    const newQuantity = parseInt(e.target.value, 10);
    const idProd = parseInt(e.target.dataset.id , 10);

    const product = productsArray.find(prod => prod.id === idProd);
    if (product && newQuantity > 0){
        product.quantity = newQuantity;
    }
    productsHtml();
    updateTotal();
    saveLocalStorage();
}


function destroyProduct(idProd){
    
    productsArray = productsArray.filter(prod => prod.id !== idProd);
    showAlert('Producto eliminado', 'success');
    productsHtml();
    updateCartCount();
    updateTotal();
    saveLocalStorage();

}



function cleanHtml() {

    contentProducts.innerHTML = '';
    
}

// function cleanHtml(){
//     while (contentProducts.firstChild){
//         contentProducts.removeChild(contentProducts.firstChild);
//     }
// }



function showAlert(message, type){

    const nonRepeatAlert = document.querySelector('.alert');
    if (nonRepeatAlert) nonRepeatAlert.remove();

    const div = document.createElement('div');
    div.classList.add('alert',type);
    div.textContent = message;


    document.body.appendChild(div);
    setTimeout(()=> div.remove(), 5000);
}

// --- Mostrar/Ocultar Carrito ---
// --- Mostrar/Ocultar Carrito ---
document.addEventListener('DOMContentLoaded', () => {
  const btnCart = document.querySelector('.btn-cart button');
  const cartContainer = document.querySelector('.btn-cart');

  if (btnCart && cartContainer) {
    btnCart.addEventListener('click', () => {
      cartContainer.classList.toggle('active');
    });
  }
});



// 

// --- Guardar Pedido ---
document.addEventListener('DOMContentLoaded', () => {
  const pedidoForm = document.querySelector('#pedidoForm');
  if (pedidoForm) {
    pedidoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (productsArray.length === 0) {
        showAlert('El carrito está vacío, no puedes hacer un pedido.', 'error');
        return;
      }

      const nombre = document.querySelector('#nombre').value.trim();
      const direccion = document.querySelector('#direccion').value.trim();
      const contacto = document.querySelector('#contacto').value.trim();

      if (!nombre || !direccion || !contacto) {
        showAlert('Por favor completa todos los campos.', 'error');
        return;
      }

      const pedido = {
        cliente: {
          nombre,
          direccion,
          contacto
        },
        productos: productsArray,
        total: productsArray.reduce((acc, prod) => acc + prod.price * prod.quantity, 0),
        fecha: new Date().toLocaleString()
      };

      // Guardar en localStorage (o podrías enviarlo a un servidor)
      let pedidosGuardados = JSON.parse(localStorage.getItem('pedidos')) || [];
      pedidosGuardados.push(pedido);
      localStorage.setItem('pedidos', JSON.stringify(pedidosGuardados));

      showAlert('Pedido guardado correctamente 🎉', 'success');

      // Vaciar carrito y formulario
      productsArray = [];
      productsHtml();
      updateCartCount();
      updateTotal();
      pedidoForm.reset();

      

    });
  }
});


// 

const pedido = {
    cliente: document.getElementById("nombre").value,
    direccion: document.getElementById("direccion").value,
    telefono: document.getElementById("contacto").value,
    productos: productsArray,   // tu array de productos con cantidad
    total:  productsArray.reduce((acc, prod) => acc + prod.price * prod.quantity, 0)
};

fetch("/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido)
})
.then(res => res.json())
.then(data => {
    console.log("Pedido guardado en DB:", data);
    window.location.href = "confirmacion.html";
})
.catch(err => console.error("Error:", err));
