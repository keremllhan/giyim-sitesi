let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
const sepetPaneli = document.getElementById('sepet-paneli');
const sepetListesi = document.getElementById('sepet-listesi');
const toplamFiyatElement = document.getElementById('toplam-fiyat');

// Quick View Modal
const quickViewModal = document.getElementById('quick-view-modal');
const modalCloseBtn = document.querySelector('.modal-close');
const modalUrunResim = document.getElementById('modal-urun-resim');
const modalUrunAd = document.getElementById('modal-urun-ad');
const modalUrunFiyat = document.getElementById('modal-urun-fiyat');
const modalUrunAciklama = document.getElementById('modal-urun-aciklama');
const modalSepeteEkleBtn = document.getElementById('modal-sepete-ekle-btn');
// Mobil Menü
const menuToggle = document.getElementById('menu-ac-kapa');
const mobilMenu = document.getElementById('mobil-menu');

// Kategori Filtreleme
const kategoriButonlari = document.querySelectorAll('.kategori-btn');
const urunKartlari = document.querySelectorAll('.urun-kart');

kategoriButonlari.forEach(button => {
    button.addEventListener('click', () => {
        // Aktif butonu güncelle
        kategoriButonlari.forEach(btn => btn.classList.remove('aktif'));
        button.classList.add('aktif');

        const secilenKategori = button.dataset.category;
        urunleriFiltrele(secilenKategori);
    });
});

function urunleriFiltrele(kategori) {
    urunKartlari.forEach(kart => {
        const urunKategori = kart.dataset.category;
        if (kategori === 'tumu' || urunKategori === kategori) {
            kart.classList.remove('hidden');
        } else {
            kart.classList.add('hidden');
        }
    });
}

// Sepete Ekleme
document.querySelectorAll('.sepete-ekle').forEach(button => {
    button.addEventListener('click', () => {
        const urunKarti = button.parentElement;
        const ad = urunKarti.querySelector('h3').innerText;
        const fiyat = parseInt(urunKarti.querySelector('p').innerText.replace(' TL', '').replace('.', ''));

        sepet.push({ ad, fiyat });
        sepetiGuncelle();
        sepetPaneli.classList.add('acik');
    });
});

// Hızlı Bakış Butonları
document.querySelectorAll('.hizli-bakis-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const urunKarti = button.closest('.urun-kart'); // Find the parent product card
        const ad = urunKarti.querySelector('h3').innerText;
        const fiyat = urunKarti.querySelector('p').innerText;
        const resimSrc = urunKarti.querySelector('img').src;
        const aciklama = urunKarti.dataset.description || "Ürün açıklaması bulunmamaktadır."; // Get description from data attribute

        // Populate modal with product details
        modalUrunResim.src = resimSrc;
        modalUrunResim.alt = ad;
        modalUrunAd.innerText = ad;
        modalUrunFiyat.innerText = fiyat;
        modalUrunAciklama.innerText = aciklama;

        // Store product data on the modal's add to cart button for later use
        modalSepeteEkleBtn.dataset.urunAd = ad;
        modalSepeteEkleBtn.dataset.urunFiyat = fiyat.replace(' TL', '').replace('.', ''); // Clean price for calculation

        quickViewModal.classList.add('acik');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    });
});

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        quickViewModal.classList.remove('acik');
        document.body.style.overflow = ''; // Restore scrolling
    });
}

if (quickViewModal) {
    quickViewModal.addEventListener('click', (event) => {
        if (event.target === quickViewModal) {
            quickViewModal.classList.remove('acik');
            document.body.style.overflow = '';
        }
    });
}

// Mobil Menü Açma/Kapama
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        mobilMenu.classList.toggle('acik');
    });
}

if (document.querySelector('.menu-kapat')) {
    document.querySelector('.menu-kapat').addEventListener('click', () => {
        mobilMenu.classList.remove('acik');
    });
}

// Menüdeki linklere tıklayınca menüyü kapat
if (mobilMenu) {
    mobilMenu.querySelectorAll('li a').forEach(link => {
        link.addEventListener('click', () => mobilMenu.classList.remove('acik'));
    });
}

// Kapatma
if (document.getElementById('sepet-kapat')) {
    document.getElementById('sepet-kapat').addEventListener('click', () => {
        sepetPaneli.classList.remove('acik');
    });
}

function sepetiGuncelle() {
    localStorage.setItem('sepet', JSON.stringify(sepet)); // Sepeti her güncellemede kaydet

    if (!sepetListesi || !toplamFiyatElement) return; // Eğer bu elementler sayfada yoksa (örn: profil sayfası) hata verme

    sepetListesi.innerHTML = '';
    let toplam = 0;
    sepet.forEach((urun, index) => { // index'i de alıyoruz
        toplam += urun.fiyat;
        const div = document.createElement('div');
        // Her ürün için bir silme butonu ekliyoruz
        div.innerHTML = `
            <p>${urun.ad} - <b>${urun.fiyat} TL</b></p>
            <button class="urun-sil-btn" data-index="${index}">X</button>
        `;
        sepetListesi.appendChild(div);
    });
    // Yeni eklenen silme butonlarına olay dinleyici ekle
    document.querySelectorAll('.urun-sil-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            urunuSil(parseInt(event.target.dataset.index)); // data-index'ten gelen değeri kullanarak sil
        });
    });
    toplamFiyatElement.innerText = toplam.toLocaleString('tr-TR');
}
// Sayfa yüklendiğinde sepeti güncelle (Sepet paneli varsa)
sepetiGuncelle();

if (document.querySelector('.odeme-btn')) {
    document.querySelector('.odeme-btn').addEventListener('click', () => {
        if (sepet.length === 0) {
            alert("Sepetin boş dostum!");
            return;
        }

        // Sepeti localStorage'a kaydet ki ödeme sayfasında görebilelim
        localStorage.setItem('sepet', JSON.stringify(sepet));
        localStorage.setItem('toplamFiyat', toplamFiyatElement.innerText);
        window.location.href = 'odeme.html';
    });
}

// Ürün Silme Fonksiyonu
function urunuSil(index) {
    sepet.splice(index, 1); // Diziden o sıradaki ürünü çıkar
    sepetiGuncelle(); // Listeyi ve fiyatı yeniden hesapla
}

// Basit Geri Sayım Sistemi
function geriSayim() {
    const hedefZaman = new Date();
    // Hedef zamanı her gün gece yarısı olarak ayarla
    // Eğer şu an gece yarısından sonraysa, bir sonraki günün gece yarısını hedefle
    if (hedefZaman.getHours() >= 23 && hedefZaman.getMinutes() >= 59 && hedefZaman.getSeconds() >= 59) {
        hedefZaman.setDate(hedefZaman.getDate() + 1);
    }
    hedefZaman.setHours(23, 59, 59, 999); // Her gün gece yarısına kadar sayar (23:59:59.999)

    setInterval(() => {
        const simdi = new Date();
        const fark = hedefZaman - simdi;

        const saat = Math.floor((fark / (1000 * 60 * 60)) % 24);
        const dakika = Math.floor((fark / 1000 / 60) % 60);
        const saniye = Math.floor((fark / 1000) % 60);

        document.getElementById('sayac').innerText = 
            `${saat < 10 ? '0'+saat : saat}:${dakika < 10 ? '0'+dakika : dakika}:${saniye < 10 ? '0'+saniye : saniye}`;
    }, 1000);
}
geriSayim(); // Sayfa yüklendiğinde geri sayımı başlat

// Bülten Formu (Kayıt Ol) Entegrasyonu
const bultenForm = document.querySelector('.bulten-form');
if (bultenForm) {
    bultenForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // LocalStorage'dan mevcut kullanıcıları al
        let users = JSON.parse(localStorage.getItem('users')) || {};
        
        // Eğer kullanıcı yoksa listeye ekle
        if (!users[email]) {
            users[email] = {
                ad: 'Yeni Abone', // İsim bilinmiyor
                tel: '-',
                siparisler: []
            };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Kaydınız başarıyla alındı! Admin panelinde görünecektir.');
        } else {
            alert('Bu e-posta zaten kayıtlı.');
        }
        this.reset();
    });
}