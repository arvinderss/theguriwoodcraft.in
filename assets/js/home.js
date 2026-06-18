/* ============================================================================
   home.js — behaviour used ONLY on the homepage:
   cursor spotlight reveal, before/after slider, contact-form submit.
   Shared behaviour (theme/lang/menu) is in site.js.
   ============================================================================ */

/* ---- SET YOUR BEFORE/AFTER IMAGES HERE ----------------------------------
   Use SAME-ORIGIN paths (files in /assets/img/ of this repo). Cross-origin
   images break the canvas spotlight ("tainted canvas"). Slider is unaffected. */
var BEFORE_IMG = "";  /* e.g. "/assets/img/bed-before.jpg" */
var AFTER_IMG  = "";  /* e.g. "/assets/img/bed-after.jpg"  */

(function(){
  if(BEFORE_IMG){
    var b=document.getElementById('heroBase'); if(b){b.style.backgroundImage="url('"+BEFORE_IMG+"')"; var t=b.querySelector('.ph-tex'),l=b.querySelector('.ph-label'); t&&t.remove(); l&&l.remove();}
    var rb=document.getElementById('rvBefore'); if(rb){rb.style.backgroundImage="url('"+BEFORE_IMG+"')"; var t2=rb.querySelector('.ph-tex'); t2&&t2.remove();}
  }
  if(AFTER_IMG){
    var r=document.getElementById('heroReveal'); if(r){r.style.backgroundImage="url('"+AFTER_IMG+"')"; var t=r.querySelector('.ph-tex'),l=r.querySelector('.ph-label'); t&&t.remove(); l&&l.remove();}
    var ra=document.getElementById('rvAfter'); if(ra){ra.style.backgroundImage="url('"+AFTER_IMG+"')"; var t2=ra.querySelector('.ph-tex'); t2&&t2.remove();}
  }
})();

/* ---- CURSOR SPOTLIGHT (desktop pointer only) ---- */
(function(){
  var canvas=document.getElementById('spot'); if(!canvas) return;
  var SPOTLIGHT_R=260, reveal=document.getElementById('heroReveal'), hero=document.getElementById('hero'),
      ctx=canvas.getContext('2d'),
      isTouch=matchMedia('(hover:none),(pointer:coarse)').matches,
      reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,
      mouse={x:-9999,y:-9999}, smooth={x:-9999,y:-9999};
  function sizeCanvas(){canvas.width=hero.clientWidth;canvas.height=hero.clientHeight;}
  function paint(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var g=ctx.createRadialGradient(smooth.x,smooth.y,0,smooth.x,smooth.y,SPOTLIGHT_R);
    g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(0.4,'rgba(255,255,255,1)');
    g.addColorStop(0.6,'rgba(255,255,255,0.75)');g.addColorStop(0.75,'rgba(255,255,255,0.4)');
    g.addColorStop(0.88,'rgba(255,255,255,0.12)');g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(smooth.x,smooth.y,SPOTLIGHT_R,0,Math.PI*2);ctx.fill();
    var url=canvas.toDataURL();
    reveal.style.webkitMaskImage="url("+url+")";reveal.style.maskImage="url("+url+")";
    reveal.style.webkitMaskSize='100% 100%';reveal.style.maskSize='100% 100%';
  }
  function loop(){smooth.x+=(mouse.x-smooth.x)*0.1;smooth.y+=(mouse.y-smooth.y)*0.1;paint();requestAnimationFrame(loop);}
  if(isTouch||reduce){
    reveal.style.display='none';canvas.style.display='none';
    var ht=document.getElementById('hintText'); /* leave language text; just note slider below */
  }else{
    sizeCanvas();addEventListener('resize',sizeCanvas);
    reveal.style.webkitMaskImage='none';reveal.style.maskImage='none';reveal.style.opacity='0';
    hero.addEventListener('mousemove',function(e){var r=hero.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;if(reveal.style.opacity!=='1'){reveal.style.opacity='1';var h=document.getElementById('revealHint');if(h)h.style.opacity='0';}});
    hero.addEventListener('mouseleave',function(){reveal.style.opacity='0';var h=document.getElementById('revealHint');if(h)h.style.opacity='1';});
    loop();
  }
})();

/* ---- BEFORE/AFTER DRAG SLIDER (mouse + touch) ---- */
(function(){
  var stage=document.getElementById('rvStage'); if(!stage) return;
  var before=document.getElementById('rvBefore'), handle=document.getElementById('rvHandle'), dragging=false;
  function setPct(px){var r=stage.getBoundingClientRect();var pct=Math.min(100,Math.max(0,((px-r.left)/r.width)*100));before.style.clipPath="inset(0 "+(100-pct)+"% 0 0)";handle.style.left=pct+'%';}
  stage.addEventListener('mousedown',function(e){dragging=true;setPct(e.clientX);});
  addEventListener('mousemove',function(e){if(dragging)setPct(e.clientX);});
  addEventListener('mouseup',function(){dragging=false;});
  stage.addEventListener('touchstart',function(e){dragging=true;setPct(e.touches[0].clientX);},{passive:true});
  addEventListener('touchmove',function(e){if(dragging)setPct(e.touches[0].clientX);},{passive:true});
  addEventListener('touchend',function(){dragging=false;});
})();

/* ---- CONTACT FORM (fetch → Formspree; degrades to normal submit) ---- */
(function(){
  var form=document.getElementById('contactForm'),status=document.getElementById('formStatus');
  if(!form) return;
  form.addEventListener('submit',function(e){
    if(form.action.indexOf('YOUR_FORM_ID')>-1){
      e.preventDefault();status.className='form-status err';
      status.textContent='Form not configured yet — set your Formspree id in _config.yml. Use WhatsApp or email meanwhile.';
      return;
    }
    e.preventDefault();
    var data=new FormData(form);
    status.className='form-status';status.style.display='block';status.textContent='Sending…';
    fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}})
      .then(function(res){if(res.ok){form.reset();status.className='form-status ok';status.textContent='Thanks — your enquiry is on its way.';}
        else{return res.json().then(function(j){throw new Error((j.errors&&j.errors[0]&&j.errors[0].message)||'Something went wrong.');});}})
      .catch(function(err){status.className='form-status err';status.textContent='Could not send: '+err.message+' Please use WhatsApp or email.';});
  });
})();
