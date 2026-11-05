document.documentElement.classList.add('js');
document.getElementById('y').textContent = new Date().getFullYear();

// Menu mobile
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
const setMenu = (open) => {
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
};
toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Hiện dần khi cuộn tới
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.card, .steps li, .why, .case, .chips li').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 3) * 40}ms`;
  io.observe(el);
});

// Form: kiểm tra → chép nội dung → mở Zalo.
// ponytail: web tĩnh không có backend; cần lưu lead tự động thì thêm Google Form/Apps Script hoặc API riêng.
const form = document.getElementById('lead');
const msg = form.querySelector('.form__msg');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { name, phone } = form.elements;
  const err = phone.parentElement.querySelector('.err');
  let ok = true;
  for (const el of [name, phone]) {
    const valid = el.checkValidity();
    el.setAttribute('aria-invalid', !valid);
    if (!valid) ok = false;
  }
  err.textContent = phone.checkValidity() ? '' : 'Số điện thoại chưa đúng (VD: 0912 345 678)';
  if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }

  const d = Object.fromEntries(new FormData(form));
  const text = `Chào Minh Hưng Agency, tôi cần tư vấn:
- Họ tên: ${d.name}
- SĐT: ${d.phone}
- Ngành nghề: ${d.industry || '-'}
- Dịch vụ: ${d.service}
- Ngân sách/tháng: ${d.budget}
- Ghi chú: ${d.note || '-'}`;
  try { await navigator.clipboard.writeText(text); msg.textContent = 'Đã chép nội dung. Dán vào khung chat Zalo vừa mở để gửi.'; }
  catch { msg.textContent = 'Đang mở Zalo — vui lòng nhắn nội dung yêu cầu hoặc gọi 056 569 2789.'; }
  window.open('https://zalo.me/0565692789', '_blank', 'noopener');
});
