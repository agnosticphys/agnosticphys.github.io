// Load calculation/rendering code only as the relevant figure approaches view.
// A rejected load leaves the static content intact; observing is one-shot.
function nearView(selector, load, margin) {
  const target=document.querySelector(selector);
  if(!target)return;
  const observer=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    observer.disconnect();
    load().catch(error=>console.warn('The illustration could not be started.',error));
  },{rootMargin:margin});
  observer.observe(target);
}
nearView('.artwork',()=>import('./artwork.js'),'160px');
nearView('.anderson-figure',()=>import('./anderson.js'),'220px');
