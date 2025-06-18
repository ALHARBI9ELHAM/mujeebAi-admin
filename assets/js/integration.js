document.getElementById('integrationForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = {
    storeName: form.storeName.value,
    storeLink: form.storeLink.value,
    phone: form.phone.value,
    storeType: form.storeType.value,
    plan: form.plan.value
  };
  const res = await fetch('/submit-integration', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  if(res.ok){
    alert('تم استلام البيانات');
    form.reset();
  }else{
    alert('حدث خطأ في الإرسال');
  }
});
