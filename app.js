const NOMOR_WA = "6281234567890";

// DATA PRODUK
const produk = [
{
id:1,
nama:"Soto Medan",
kategori:"Makanan",
harga:25000,
stok:12,
gambar:"https://images.unsplash.com/photo-1547592180-85f173990554?w=600",
deskripsi:"Soto Medan gurih dan kaya rempah."
},
{
id:2,
nama:"Bika Ambon",
kategori:"Camilan",
harga:18000,
stok:8,
gambar:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600",
deskripsi:"Kue khas Medan yang lembut."
},
{
id:3,
nama:"Mie Gomak",
kategori:"Makanan",
harga:22000,
stok:9,
gambar:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
deskripsi:"Mie lidi khas Sumatera Utara."
},
{
id:4,
nama:"Lontong Medan",
kategori:"Makanan",
harga:"20000",
stok:3,
gambar:"https://raw.githubusercontent.com/cooki4483-cpu/katalog_umkm_medan/main/file_000000003980821182ad6839c16a52c6.png",
deskripsi:"Lontong dengan sayur dan tauco."
},
{
id:5,
nama:"Pisang Goreng",
kategori:"Camilan",
harga:15000,
stok:15,
gambar:"https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600",
deskripsi:"Pisang goreng renyah dan manis."
},
{
id:6,
nama:"Kopi Susu Aren",
kategori:"Minuman",
harga:18000,
stok:0,
gambar:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
deskripsi:"Kopi susu dengan gula aren."
},
{
id:7,
nama:"Es Teh Lemon",
kategori:"Minuman",
harga:12000,
stok:10,
gambar:"https://images.unsplash.com/photo-1513558161293-cb0e9b3b2d1c?w=600",
deskripsi:"Minuman segar lemon."
},
{
id:8,
nama:"Durian Kupas",
kategori:"Camilan",
harga:45000,
stok:4,
gambar:"https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600",
deskripsi:"Durian pilihan khas Sumatera."
}
];

// KERANJANG LOCAL STORAGE
let keranjang = JSON.parse(
localStorage.getItem("keranjangMedan") || "{}"
);

function simpan() {
localStorage.setItem(
"keranjangMedan",
JSON.stringify(keranjang)
);
}

// FORMAT RUPIAH
function rupiah(angka) {
return new Intl.NumberFormat("id-ID", {
style:"currency",
currency:"IDR",
maximumFractionDigits:0
}).format(angka);
}

// TAMPILKAN PRODUK
function tampilProduk(data=produk) {
const area = document.getElementById("daftarProduk");

area.innerHTML = "";

data.forEach(p => {

let stok = p.stok === 0
? `<span class="stock-empty">Stok Habis</span>`
: p.stok < 5
? `<span class="stock-low">Stok Menipis: ${p.stok}</span>`
: `<span class="stock-safe">Stok Aman: ${p.stok}</span>`;

area.innerHTML += `
<div class="col-md-3 col-sm-6">
<div class="product-card">

<img src="${p.gambar}" alt="${p.nama}"
onerror="this.src='https://placehold.co/600x400/f2e8df/8b7768?text=Produk'">

<div class="product-content">

<h5>${p.nama}</h5>

<p>${p.deskripsi}</p>

${stok}

<h5 class="product-price mt-3">
${rupiah(p.harga)}
</h5>

<button class="add-btn w-100"
onclick="tambah(${p.id})"
${p.stok===0?"disabled":""}>
${p.stok===0?"Stok Habis":"+ Tambah"}
</button>

</div>
</div>
</div>
`;
});

document.getElementById("totalProduk").innerText=produk.length;
}

// FILTER KATEGORI
function filterProduk(kategori) {
if(kategori==="Semua") {
tampilProduk();
} else {
tampilProduk(produk.filter(p=>p.kategori===kategori));
}
}

// PENCARIAN
document.getElementById("search").addEventListener("input",function(){
const kata=this.value.toLowerCase();

tampilProduk(produk.filter(p=>
p.nama.toLowerCase().includes(kata)
));
});

// TAMBAH PRODUK
function tambah(id) {
const p=produk.find(x=>x.id===id);

if(!p || p.stok===0)return;

const jumlah=keranjang[id]||0;

if(jumlah>=p.stok){
alert("Stok tidak mencukupi!");
return;
}

keranjang[id]=jumlah+1;

simpan();
tampilKeranjang();
}

// HITUNG TOTAL
function hitungTotal() {
let total=0;

Object.keys(keranjang).forEach(id=>{
const p=produk.find(x=>x.id==id);
if(p)total+=p.harga*keranjang[id];
});

return total;
}

// TAMPILKAN KERANJANG
function tampilKeranjang() {
const area=document.getElementById("isiKeranjang");

area.innerHTML="";

Object.keys(keranjang).forEach(id=>{

const p=produk.find(x=>x.id==id);
if(!p)return;

const jumlah=keranjang[id];

area.innerHTML+=`
<div class="cart-item">

<div class="d-flex align-items-center gap-2">
<img src="${p.gambar}" alt="${p.nama}">
<div>
<strong>${p.nama}</strong>
<div>${rupiah(p.harga)}</div>
</div>
</div>

<div class="text-end">

<button class="qty-btn"
onclick="ubah(${id},-1)">−</button>

<strong>${jumlah}</strong>

<button class="qty-btn"
onclick="ubah(${id},1)"
${jumlah>=p.stok?"disabled":""}>+</button>

<br>

<button class="delete-btn mt-2"
onclick="hapus(${id})">Hapus</button>

</div>

</div>
`;
});

if(Object.keys(keranjang).length===0){
area.innerHTML="<p class='text-center'>Keranjang masih kosong 🛒</p>";
}

document.getElementById("totalHarga").innerText=
rupiah(hitungTotal());

document.getElementById("totalKeranjang").innerText=
Object.values(keranjang).reduce((a,b)=>a+b,0);

hitungKembalian();
}

// UBAH JUMLAH
function ubah(id,angka) {
const p=produk.find(x=>x.id==id);
const jumlah=(keranjang[id]||0)+angka;

if(jumlah<=0){
delete keranjang[id];
}
else if(jumlah<=p.stok){
keranjang[id]=jumlah;
}
else{
alert("Stok tidak mencukupi!");
return;
}

simpan();
tampilKeranjang();
}

// HAPUS PRODUK
function hapus(id) {
delete keranjang[id];
simpan();
tampilKeranjang();
}

// PEMBAYARAN TUNAI / DIGITAL
document.querySelectorAll('input[name="bayar"]').forEach(input=>{
input.addEventListener("change",function(){
document.getElementById("cashSection").style.display=
this.value==="Tunai"?"block":"none";
});
});

// KALKULATOR KEMBALIAN
function hitungKembalian() {
const uang=Number(document.getElementById("uang").value)||0;
const total=hitungTotal();
const area=document.getElementById("kembalian");

if(total===0){
area.innerText="";
}
else if(uang<total){
area.style.color="red";
area.innerText="Uang kurang: "+rupiah(total-uang);
}
else{
area.style.color="green";
area.innerText="Kembalian: "+rupiah(uang-total);
}
}

document.getElementById("uang").addEventListener("input",hitungKembalian);

// ORDER WHATSAPP
function pesanWhatsApp() {

if(Object.keys(keranjang).length===0){
alert("Keranjang masih kosong!");
return;
}

const nama=document.getElementById("nama").value.trim();
const alamat=document.getElementById("alamat").value.trim();

if(!nama){
alert("Masukkan nama pemesan!");
return;
}

const metode=document.querySelector(
'input[name="bayar"]:checked'
).value;

const total=hitungTotal();
const uang=Number(document.getElementById("uang").value)||0;

if(metode==="Tunai" && uang<total){
alert("Uang tunai belum mencukupi!");
return;
}

let pesan="Halo, saya ingin memesan:%0A";

Object.keys(keranjang).forEach(id=>{
const p=produk.find(x=>x.id==id);

pesan+=`%0A${p.nama} x ${keranjang[id]} = ${rupiah(p.harga*keranjang[id])}`;
});

pesan+=`%0A%0ANama: ${nama}`;
pesan+=`%0AAlamat/Catatan: ${alamat||"-"}`;
pesan+=`%0ATotal: ${rupiah(total)}`;
pesan+=`%0APembayaran: ${metode}`;

if(metode==="Tunai"){
pesan+=`%0AUang: ${rupiah(uang)}`;
pesan+=`%0AKembalian: ${rupiah(uang-total)}`;
}

pesan+="%0A%0AMohon konfirmasi pesanan saya. Terima kasih.";

if(!/^\d{10,15}$/.test(NOMOR_WA)){
alert("Nomor WhatsApp penjual belum diatur di app.js!");
return;
}

window.open(
`https://wa.me/${NOMOR_WA}?text=${pesan}`,
"_blank"
);
}

// JALANKAN APLIKASI
tampilProduk();
tampilKeranjang();
