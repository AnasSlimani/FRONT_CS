export default function AdminDashboard() {
  console.log("Admin Layout Loaded");  
  return (
      <div className="min-h-screen bg-red-500">
        <div className="p-0">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p>This is a test page for the admin dashboard. It has its own layout without the main navbar and footer.</p>
        </div>
      </div>
    )
  }
  
  