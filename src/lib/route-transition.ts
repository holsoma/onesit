import { useEffect, useRef } from 'preact/hooks';
export function useRouteTransition(route:(url:string)=>void) {
  const routeRef=useRef(route);
  routeRef.current=route;
  useEffect(()=>{
    if(!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let active:ViewTransition|undefined;
    const navigate=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const link=event.target instanceof Element?event.target.closest('a'):null;
      if(!link||link.target||link.hasAttribute('download')||link.getAttribute('href')?.startsWith('#'))return;
      const url=new URL(link.href);
      if(url.origin!==location.origin||url.hash||url.pathname===location.pathname&&url.search===location.search)return;
      event.preventDefault();event.stopImmediatePropagation();active?.skipTransition();
      active=document.startViewTransition(async()=>{
        routeRef.current(url.pathname+url.search);
        await new Promise<void>(resolve=>setTimeout(resolve,0));
      });
      active.ready.catch(()=>{});
    };
    document.addEventListener('click',navigate,true);
    return()=>{document.removeEventListener('click',navigate,true);active?.skipTransition()};
  },[]);
}
