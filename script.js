let sepet = [];
const sepetPaneli = document.getElementById('sepet-paneli');
const sepetListesi = document.getElementById('sepet-listesi');
const toplamFiyatElement = document.getElementById('toplam-fiyat');

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

// Kapatma
document.getElementById('sepet-kapat').addEventListener('click', () => {
    sepetPaneli.classList.remove('acik');
});

function sepetiGuncelle() {
    sepetListesi.innerHTML = '';
    let toplam = 0;
    sepet.forEach((urun) => {
        toplam += urun.fiyat;
        const div = document.createElement('div');
        div.innerHTML = `<p style="padding:10px; border-bottom:1px solid #eee">${urun.ad} - <b>${urun.fiyat} TL</b></p>`;
        sepetListesi.appendChild(div);
    });
    toplamFiyatElement.innerText = toplam.toLocaleString('tr-TR');
}