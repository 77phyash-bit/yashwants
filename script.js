(function(){
  var root = document.documentElement;
  var saved = localStorage.getItem('theme');
  if(saved){ root.setAttribute('data-theme', saved); }
  var btn = document.getElementById('themeToggle');
  function updateIcon(){
    var t = root.getAttribute('data-theme');
    var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if(btn) btn.textContent = dark ? '☀️' : '🌙';
  }
  updateIcon();
  if(btn){
    btn.addEventListener('click', function(){
      var current = root.getAttribute('data-theme');
      var dark = current === 'dark' || (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon();
    });
  }
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length > 1){
        var el = document.querySelector(id);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
      }
    });
  });
})();
