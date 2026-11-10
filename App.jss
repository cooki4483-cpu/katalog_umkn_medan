// ==========================================
// KATALOG UMKM KULINER MEDAN - MARTABAK
// ==========================================

// GANTI NOMOR INI DENGAN NOMOR WHATSAPP PENJUAL
// Gunakan format 62, tanpa tanda + atau angka 0 di depan.
const WHATSAPP_NUMBER = "6281234567890";

// DATA PRODUK MARTABAK
const products = [
  {
    id: 1,
    name: "Martabak Cokelat",
    category: "Martabak Manis",
    price: 25000,
    stock: 15,
    desc: "Martabak lembut dengan cokelat melimpah.",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600"
  },
  {
    id: 2,
    name: "Martabak Keju",
    category: "Martabak Manis",
    price: 28000,
    stock: 12,
    desc: "Taburan keju gurih dan susu kental manis.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
  },
  {
    id: 3,
    name: "Martabak Cokelat Keju",
    category: "Martabak Manis",
    price: 32000,
    stock: 10,
    desc: "Perpaduan cokelat dan keju yang lezat.",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600"
  },
  {
    id: 4,
    name: "Martabak Kacang",
    category: "Martabak Manis",
    price: 27000,
    stock: 8,
    desc: "Martabak manis dengan kacang renyah.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600"
  },
  {
    id: 5,
    name: "Martabak Oreo",
    category: "Martabak Manis",
    price: 35000,
    stock: 9,
    desc: "Martabak dengan topping Oreo favorit.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"
  },
  {
    id: 6,
    name: "Martabak Red Velvet",
    category: "Martabak Manis",
    price: 38000,
    stock: 7,
    desc: "Martabak lembut dengan rasa red velvet.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
  },
  {
    id: 7,
    name: "Martabak Telur Ayam",
    category: "Martabak Telur",
    price: 30000,
    stock: 11,
    desc: "Martabak telur dengan isian ayam gurih.",
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600"
  },
  {
    id: 8,
    name: "Martabak Telur Spesial",
    category: "Martabak Telur",
    price: 40000,
    stock: 6,
    desc: "Martabak telur spesial dengan daging dan sayuran.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600"
  }
];

// DATA KERANJANG
let cart = JSON.parse(localStorage.getItem("martabakCart")) || [];

// STOK DISIMPAN SECARA LOKAL
let savedStocks = JSON.parse(localStorage.getItem("martabakStocks")) || {};

products.forEach(product => {
  if (savedStocks[product.id] !== undefined) {
    product.stock = savedStocks[product.id];
  }
});

function saveData() {
  localStorage.setItem("martabakCart", JSON.stringify(cart));

  const stocks = {};
  products.forEach(product => {
    stocks[product.id] = product.stock;
  });

  localStorage.setItem("martabakStocks", JSON.stringify(stocks));
}

function formatRupiah(number) {
  return "Rp" + Number(number).toLocaleString("id-ID");
}

// ==========================================
// MENAMPILKAN PRODUK
// ==========================================

function renderProducts() {
  const container = document.getElementById("productList");

  container.innerHTML = products.map(product => {
    let stockStatus = "";
    let stockColor = "";

    if (product.stock === 0) {
      stockStatus = "Stok Habis";
      stockColor = "#dc5555";
    } else if (product.stock < 5) {
      stockStatus = "Stok Menipis";
      stockColor = "#d59b32";
    } else {
      stockStatus = "Stok Tersedia";
      stockColor = "#6a9a69";
    }

    return `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card">

          <img
            src="${product.image}"
            class="product-img"
            alt="${product.name}"
            loading="lazy"
            onerror="this.onerror=null;this.src='https://placehold.co/600x400/f8dfe0/765345?text=Martabak';"
          >

          <div class="card-body">
            <span class="category-badge">${product.category}</span>

            <h6 class="product-name mt-3">${product.name}</h6>

            <p class="product-desc">${product.desc}</p>

            <div class="price mb-2">
              ${formatRupiah(product.price)}
            </div>

            <div class="stock-label mb-3"
              style="color:${stockColor}">
              ● ${stockStatus} (${product.stock})
            </div>

            <button
              class="btn soft-btn w-100"
              onclick="addToCart(${product.id})"
              ${product.stock === 0 ? "disabled" : ""}
              style="${product.stock === 0 ? "opacity:.5" : ""}"
            >
              ${product.stock === 0 ? "Stok Habis" : "+ Tambah"}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ==========================================
// MENAMBAHKAN PRODUK KE KERANJANG
// ==========================================

function addToCart(id) {
  const product = products.find(item => item.id === id);

  if (!product || product.stock <= 0) {
    alert("Maaf, stok produk habis!");
    return;
  }

  const existing = cart.find(item => item.id === id);

  if (existing) {
    if (existing.qty >= product.stock) {
      alert("Jumlah pembelian melebihi stok!");
      return;
    }

    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1
    });
  }

  saveData();
  renderAll();

  alert(product.name + " berhasil ditambahkan!");
}

// ==========================================
// MENAMBAH DAN MENGURANGI JUMLAH
// ==========================================

function changeQty(id, amount) {
  const item = cart.find(item => item.id === id);
  const product = products.find(item => item.id === id);

  if (!item || !product) return;

  const newQty = item.qty + amount;

  if (newQty <= 0) {
    removeItem(id);
    return;
  }

  if (newQty > product.stock) {
    alert("Jumlah melebihi stok yang tersedia!");
    return;
  }

  item.qty = newQty;

  saveData();
  renderAll();
}

// ==========================================
// MENGHAPUS PRODUK
// ==========================================

function removeItem(id) {
  const item = cart.find(item => item.id === id);

  if (!item) return;

  if (!confirm("Yakin ingin menghapus produk ini dari keranjang?")) {
    return;
  }

  cart = cart.filter(item => item.id !== id);

  saveData();
  renderAll();
}

// ==========================================
// MENGHITUNG TOTAL BELANJA
// ==========================================

function getTotal() {
  return cart.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);
}

function getTotalItems() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

// ==========================================
// MENAMPILKAN KERANJANG
// ==========================================

function renderCart() {
  const container = document.getElementById("cartItems");

  document.getElementById("cartCount").textContent = getTotalItems();
  document.getElementById("totalItems").textContent = getTotalItems();
  document.getElementById("grandTotal").textContent =
    formatRupiah(getTotal());

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div style="font-size:45px">🛍️</div>
        Keranjang masih kosong.
      </div>
    `;

    updateCash();
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="d-flex justify-content-between gap-2">

        <div>
          <b>${item.name}</b>
          <div class="small text-secondary">
            ${formatRupiah(item.price)} x ${item.qty}
          </div>

          <div class="mt-2 d-flex align-items-center gap-2">
            <button class="qty-btn"
              onclick="changeQty(${item.id},-1)">−</button>

            <b>${item.qty}</b>

            <button class="qty-btn"
              onclick="changeQty(${item.id},1)">+</button>
          </div>
        </div>

        <div class="text-end">
          <b>${formatRupiah(item.price * item.qty)}</b>
          <div class="mt-2">
            <button class="remove-btn"
              onclick="removeItem(${item.id})">
              🗑 Hapus
            </button>
          </div>
        </div>

      </div>
    </div>
  `).join("");

  updateCash();
}

// ==========================================
// METODE PEMBAYARAN
// ==========================================

function getPayment() {
  const selected = document.querySelector(
    'input[name="payment"]:checked'
  );

  return selected ? selected.value : "Tunai";
}

function updatePayment() {
  const payment = getPayment();

  const cashSection = document.getElementById("cashSection");
  const transferSection = document.getElementById("transferSection");
  const paymentInfo = document.getElementById("paymentInfo");

  cashSection.hidden = payment !== "Tunai";
  transferSection.hidden = payment === "Tunai";

  if (payment === "QRIS") {
    paymentInfo.innerHTML =
      "Silakan minta kode QRIS resmi penjual untuk melakukan pembayaran. Konfirmasi pembayaran kepada penjual.";
  } else if (payment === "Transfer Bank") {
    paymentInfo.innerHTML =
      "Silakan hubungi penjual untuk mendapatkan nomor rekening dan informasi transfer.";
  }

  updateCash();
}

// ==========================================
// KALKULATOR KEMBALIAN OTOMATIS
// ==========================================

function updateCash() {
  const cashInput = document.getElementById("cashAmount");
  const message = document.getElementById("cashMessage");
  const change = document.getElementById("changeAmount");

  if (!cashInput || !message || !change) return;

  const cash = Number(cashInput.value) || 0;
  const total = getTotal();

  if (getPayment() !== "Tunai") {
    message.textContent = "Pembayaran non-tunai diproses sesuai metode pilihan.";
    change.textContent = formatRupiah(0);
    return;
  }

  if (total === 0) {
    message.textContent = "Belum ada produk yang dibeli.";
    change.textContent = formatRupiah(0);
  } else if (cash >= total) {
    message.textContent = "✓ Uang pembayaran mencukupi.";
    message.style.color = "green";
    change.textContent = formatRupiah(cash - total);
  } else {
    message.textContent = "✗ Uang pembayaran masih kurang " +
      formatRupiah(total - cash);
    message.style.color = "red";
    change.textContent = formatRupiah(0);
  }
}

// ==========================================
// CHECKOUT KE WHATSAPP
// ==========================================

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Keranjang belanja masih kosong!");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !phone || !address) {
    alert("Mohon lengkapi nama, nomor WhatsApp, dan alamat!");
    return;
  }

  const total = getTotal();
  const payment = getPayment();

  const phoneDigits = phone.replace(/\D/g, "");

  if (phoneDigits.length < 9) {
    alert("Masukkan nomor WhatsApp yang valid!");
    return;
  }

  if (payment === "Tunai") {
    const cash = Number(document.getElementById("cashAmount").value) || 0;

    if (cash < total) {
      alert("Uang tunai belum mencukupi!");
      return;
    }
  }

  const orderId = "MRT-" + Date.now().toString().slice(-8);

  let message = `HALO MARTABAK MEDAN! 🥞\n`;
  message += `Saya ingin memesan martabak.\n\n`;
  message += `Nomor Pesanan: ${orderId}\n`;
  message += `Nama: ${name}\n`;
  message += `No. WhatsApp: ${phone}\n`;
  message += `Alamat: ${address}\n\n`;
  message += `DAFTAR PESANAN:\n`;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   ${item.qty} x ${formatRupiah(item.price)} = `;
    message += `${formatRupiah(item.qty * item.price)}\n`;
  });

  message += `\nTOTAL: ${formatRupiah(total)}\n`;
  message += `Metode Pembayaran: ${payment}\n`;

  if (payment === "Tunai") {
    const cash = Number(document.getElementById("cashAmount").value);
    message += `Uang Dibayar: ${formatRupiah(cash)}\n`;
    message += `Kembalian: ${formatRupiah(cash - total)}\n`;
  } else {
    message += `Status: Menunggu konfirmasi pembayaran\n`;
  }

  message += `\nMohon konfirmasi pesanan saya. Terima kasih! ❤️`;

  const whatsappURL =
    "https://wa.me/" + WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(message);

  window.open(whatsappURL, "_blank");
}

// ==========================================
// CETAK NOTA
// ==========================================

function printReceipt() {
  if (cart.length === 0) {
    alert("Tidak ada transaksi untuk dicetak!");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const payment = getPayment();
  const total = getTotal();

  if (!name) {
    alert("Masukkan nama pembeli terlebih dahulu!");
    return;
  }

  if (payment === "Tunai") {
    const cash = Number(document.getElementById("cashAmount").value) || 0;

    if (cash < total) {
      alert("Uang tunai belum mencukupi!");
      return;
    }
  }

  let html = `
    <p>No: MRT-${Date.now().toString().slice(-8)}</p>
    <p>Tanggal: ${new Date().toLocaleString("id-ID")}</p>
    <p>Nama: ${name}</p>
    <p>Pembayaran: ${payment}</p>
    <hr>
  `;

  cart.forEach(item => {
    html += `
      <div style="display:flex;justify-content:space-between;margin:8px 0">
        <span>${item.name} (${item.qty}x)</span>
        <b>${formatRupiah(item.qty * item.price)}</b>
      </div>
    `;
  });

  html += `<hr><h3>Total: ${formatRupiah(total)}</h3>`;

  if (payment === "Tunai") {
    const cash = Number(document.getElementById("cashAmount").value);

    html += `
      <p>Uang: ${formatRupiah(cash)}</p>
      <p>Kembalian: ${formatRupiah(cash - total)}</p>
    `;
  }

  document.getElementById("receiptContent").innerHTML = html;

  const receipt = document.getElementById("receipt");
  receipt.style.display = "block";

  window.print();

  receipt.style.display = "none";
}

// ==========================================
// MENJALANKAN SEMUA FUNGSI
// ==========================================

function renderAll() {
  renderProducts();
  renderCart();
}

document.addEventListener("DOMContentLoaded", function() {

  renderAll();

  document.querySelectorAll('input[name="payment"]').forEach(input => {
    input.addEventListener("change", updatePayment);
  });

  document.getElementById("cashAmount").addEventListener(
    "input", updateCash
  );

  updatePayment();

});
