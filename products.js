/*
 * CATÁLOGO EDITABLE DE SADEZ
 * Cambia nombre, categoría, precio, descripción, etiqueta e imagen.
 * Categorías válidas: "Perfumes", "Relojes", "Combos".
 * Precio en pesos colombianos (COP), sin puntos ni símbolos.
 * Para una foto, agrega una URL pública en image. Si image queda vacío,
 * se muestra una ilustración de producto generada con CSS.
 */
window.SADEZ_PRODUCTS = [
  {id:"p1",name:"Versace Eros",category:"Perfumes",price:20000,description:"Fragancia intensa, fresca y amaderada.",badge:"Favorito",image:"",visual:"perfume"},
  {id:"p2",name:"Valentino Uomo",category:"Perfumes",price:20000,description:"Aroma elegante con carácter cálido.",badge:"Selección SADEZ",image:"",visual:"perfume"},
  {id:"p3",name:"Yara Candy",category:"Perfumes",price:20000,description:"Dulce, juvenil y envolvente.",badge:"",image:"",visual:"perfume"},
  {id:"p4",name:"Mandarin Sky",category:"Perfumes",price:20000,description:"Notas cítricas, dulces y ambaradas.",badge:"Nuevo",image:"",visual:"perfume"},
  {id:"r1",name:"Reloj clásico negro",category:"Relojes",price:40000,description:"Un diseño sobrio para todos los días.",badge:"",image:"",visual:"watch"},
  {id:"r2",name:"Reloj estilo ejecutivo",category:"Relojes",price:45000,description:"Un toque elegante para ocasiones especiales.",badge:"",image:"",visual:"watch"},
  {id:"c1",name:"Combo de 3 perfumes",category:"Combos",price:49900,description:"Combina tres fragancias de tu elección; confirma disponibilidad.",badge:"Combo",image:"",visual:"combo"},
  {id:"c2",name:"Reloj + perfume",category:"Combos",price:50000,description:"Un detalle completo para regalar.",badge:"Combo",image:"",visual:"combo"}
];
