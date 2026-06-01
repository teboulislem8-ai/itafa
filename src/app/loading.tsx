export default function LoadingPage() {
  return (
    <div style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px"}}>
        <svg width="36" height="17" viewBox="370 567 760 366" xmlns="http://www.w3.org/2000/svg">
          <path fill="#34ab53" d="M749.4 922.8C544.9 922.3 379.6 749.4 379.6 749.4S545.7 577.2 750.5 577.4C955.2 577.6 1120.3 750.8 1120.3 750.8S954 923.3 749.4 922.8Z"/>
        </svg>
        <div style={{width:24,height:24,border:"2px solid var(--border)",borderTopColor:"var(--brand)",borderRadius:"50%",animation:"spin 0.6s linear infinite"}}></div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
