export default function DashboardLoading() {
  return (
    <div style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:24,height:24,border:"2px solid var(--border)",borderTopColor:"var(--brand)",borderRadius:"50%",animation:"spin 0.6s linear infinite"}}></div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
