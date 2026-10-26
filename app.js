(() => {
  "use strict";
  const WHATSAPP_NUMBER = "573002733324"; // Colombia: +57 300 273 3324
  const COP = new Intl.NumberFormat("es-CO", {style:"currency", currency:"COP", maximumFractionDigits:0});
  const departments = ["Amazonas","Antioquia","Arauca","Atlántico","Bogotá D.C.","Bolívar","Boyacá","Caldas","Caquetá","Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guainía","Guaviare","Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander","Putumayo","Quindío","Risaralda","San Andrés y Providencia","Santander","Sucre","Tolima","Valle del Cauca","Vaupés","Vichada"];
  const $ = (s) => document.querySelector(s);
  const grid = $("#product-grid"), drawer = $("#cart-drawer"), backdrop = $("#drawer-backdrop");
  const checkout = $("#checkout-modal"), checkoutBackdrop = $("#checkout-backdrop");
  let cart = {};
  let activeCategory = "Todos";
  let searchTerm = "";

  function money(value){ return COP.format(value).replace(/\u00a0/g," "); }
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function productArt(product){
    if(product.image) return `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.remove()">`;
    if(product.visual==="watch") return `<div class="product-placeholder"><div class="placeholder-watch"></div></div>`;
    if(product.visual==="combo") return `<div class="product-placeholder"><div class="placeholder-combo"><div class="placeholder-bottle">SADEZ</div><div class="placeholder-watch"></div></div></div>`;
    return `<div class="product-placeholder"><div class="placeholder-bottle">SADEZ</div></div>`;
  }
  function renderProducts(){
    const products = (window.SADEZ_PRODUCTS || []).filter(p =>
      (activeCategory==="Todos" || p.category===activeCategory) &&
      (p.name+" "+p.description+" "+p.category).toLowerCase().includes(searchTerm.toLowerCase())
    );
    grid.innerHTML = products.length ? products.map(p=>`
      <article class="product-card">
        <div class="product-image">${productArt(p)}${p.badge?`<span class="product-badge">${escapeHtml(p.badge)}</span>`:""}</div>
        <div class="product-info">
          <div class="product-category">${escapeHtml(p.category)}</div>
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          <p class="product-description">${escapeHtml(p.description||"Un favorito de la colección SADEZ.")}</p>
          <div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-button" data-add="${escapeHtml(p.id)}" aria-label="Agregar ${escapeHtml(p.name)} al carrito">+</button></div>
        </div>
      </article>`).join("") : `<div class="no-results">No encontramos productos con esa búsqueda.</div>`;
  }
  function cartEntries(){return Object.entries(cart).map(([id,qty])=>({product:window.SADEZ_PRODUCTS.find(p=>p.id===id),qty})).filter(x=>x.product&&x.qty>0);}
  function total(){return cartEntries().reduce((sum,x)=>sum+x.product.price*x.qty,0);}
  function renderCart(){
    const entries=cartEntries();
    $("#cart-count").textContent=entries.reduce((s,x)=>s+x.qty,0);
    $("#cart-items").innerHTML=entries.map(({product:p,qty})=>`
      <div class="cart-line">
        <div class="cart-thumb">${p.visual==="watch"?"◷":p.visual==="combo"?"✧":"S."}</div>
        <div><h3>${escapeHtml(p.name)}</h3><div class="line-price">${money(p.price)} c/u</div><div class="quantity-control"><button data-qty="${escapeHtml(p.id)}" data-delta="-1" aria-label="Quitar una unidad">−</button><span>${qty}</span><button data-qty="${escapeHtml(p.id)}" data-delta="1" aria-label="Agregar una unidad">+</button></div></div>
        <div><strong>${money(p.price*qty)}</strong><br><button class="remove-button" data-remove="${escapeHtml(p.id)}">Eliminar</button></div>
      </div>`).join("");
    $("#cart-empty").style.display=entries.length?"none":"block";
    $("#cart-summary").classList.toggle("hidden",!entries.length);
    $("#cart-subtotal").textContent=money(total());
    $("#checkout-total").textContent=money(total());
  }
  function openDrawer(){drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");backdrop.classList.add("show");document.body.classList.add("locked");}
  function closeDrawer(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");backdrop.classList.remove("show");if(!checkout.classList.contains("open"))document.body.classList.remove("locked");}
  function openCheckout(){
    if(!cartEntries().length){showToast("Agrega al menos un producto antes de continuar.");return;}
    closeDrawer();checkout.classList.add("open");checkout.setAttribute("aria-hidden","false");checkoutBackdrop.classList.add("show");document.body.classList.add("locked");$("#form-error").textContent="";
  }
  function closeCheckout(){checkout.classList.remove("open");checkout.setAttribute("aria-hidden","true");checkoutBackdrop.classList.remove("show");document.body.classList.remove("locked");}
  let toastTimer;
  function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400);}
  function addToCart(id){const p=window.SADEZ_PRODUCTS.find(x=>x.id===id);if(!p)return;cart[id]=(cart[id]||0)+1;renderCart();showToast(`${p.name} agregado al carrito`);}
  function populateDepartments(){const select=$("#department");departments.forEach(d=>{const opt=document.createElement("option");opt.value=d;opt.textContent=d;select.appendChild(opt);});}
  function buildMessage(data){
    const lines=cartEntries().map(({product:p,qty})=>`• ${p.name} x${qty} — ${money(p.price*qty)}`);
    return [
      "¡Hola, SADEZ! Quiero realizar un pedido contraentrega.",
      "",
      "🛍️ *RESUMEN DEL PEDIDO*",
      ...lines,
      "",
      `*TOTAL DE PRODUCTOS: ${money(total())} COP*`,
      "Envío: por confirmar con SADEZ.",
      "",
      "📦 *DATOS DE ENTREGA*",
      `Nombre: ${data.name}`,
      `Teléfono: ${data.phone}`,
      `Departamento: ${data.department}`,
      `Ciudad/municipio: ${data.city}`,
      `Dirección: ${data.address}`,
      `Indicaciones: ${data.notes || "No especificadas"}`,
      "",
      "Por favor, confirmar disponibilidad, costo de envío y tiempo estimado de entrega. ¡Gracias!"
    ].join("\n");
  }

  document.addEventListener("click",e=>{
    const add=e.target.closest("[data-add]");if(add){addToCart(add.dataset.add);return;}
    const qty=e.target.closest("[data-qty]");if(qty){const id=qty.dataset.qty;cart[id]=(cart[id]||0)+Number(qty.dataset.delta);if(cart[id]<=0)delete cart[id];renderCart();return;}
    const remove=e.target.closest("[data-remove]");if(remove){delete cart[remove.dataset.remove];renderCart();return;}
    const tab=e.target.closest("[data-category]");if(tab){activeCategory=tab.dataset.category;document.querySelectorAll(".filter-tab").forEach(b=>b.classList.toggle("active",b===tab));renderProducts();}
  });
  $("#search-input").addEventListener("input",e=>{searchTerm=e.target.value;renderProducts();});
  $("#open-cart").addEventListener("click",openDrawer);
  $("#close-cart").addEventListener("click",closeDrawer);
  $("#continue-shopping").addEventListener("click",closeDrawer);
  backdrop.addEventListener("click",closeDrawer);
  $("#go-checkout").addEventListener("click",openCheckout);
  $("#close-checkout").addEventListener("click",closeCheckout);
  checkoutBackdrop.addEventListener("click",closeCheckout);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCheckout();closeDrawer();}});
  $("#checkout-form").addEventListener("submit",e=>{
    e.preventDefault();
    const form=e.currentTarget;
    if(!cartEntries().length){closeCheckout();showToast("Tu carrito está vacío.");return;}
    if(!form.reportValidity())return;
    const fd=new FormData(form);
    const data={name:String(fd.get("name")).trim(),phone:String(fd.get("phone")).trim(),department:String(fd.get("department")).trim(),city:String(fd.get("city")).trim(),address:String(fd.get("address")).trim(),notes:String(fd.get("notes")).trim()};
    if(!data.name||!data.phone||!data.department||!data.city||!data.address){$("#form-error").textContent="Completa todos los campos obligatorios para continuar.";return;}
    const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(data))}`;
    const opened=window.open(url,"_blank","noopener,noreferrer");
    if(!opened){window.location.href=url;}
  });
  $("#year").textContent=new Date().getFullYear();
  populateDepartments();renderProducts();renderCart();
})();
