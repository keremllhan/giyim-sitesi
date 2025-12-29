// Sayfa yüklendiğinde çalışacak kodlar
document.querySelectorAll('.sepete-ekle').forEach(button => {
    button.addEventListener('click', () => {
        // Ürünün ismini alalım
        const urunAdi = button.parentElement.querySelector('h3').innerText;
        
        // Şık bir uyarı mesajı gösterelim
        alert('Harika seçim! ' + urunAdi + ' sepetine eklendi. 🛍️');
        
        // Butonun rengini geçici olarak değiştirelim
        button.innerText = 'Eklendi!';
        button.style.backgroundColor = '#2ed573';
        
        setTimeout(() => {
            button.innerText = 'Sepete Ekle';
            button.style.backgroundColor = '#333';
        }, 2000);
    });
});
// Form gönderme işlemi
const mesajFormu = document.getElementById('mesaj-formu');

if(mesajFormu) {
    mesajFormu.addEventListener('submit', (e) => {
        e.preventDefault(); // Sayfanın yenilenmesini engeller
        alert('Mesajınız başarıyla alındı dostum! En kısa sürede dönüş yapacağız. 📧');
        mesajFormu.reset(); // Formu temizler
    });
}