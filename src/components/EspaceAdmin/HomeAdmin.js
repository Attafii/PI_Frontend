import React from 'react'
import AdminSideBarComponent from './AdminSideBarComponent'
import SidebarComponent from './sidebarComponent'

function HomeAdmin() {
  return (
    <>
    <div style={{ display: "flex" }}>
      
      <section style={{ flex: 3 }}>
        <SidebarComponent />
      </section>
      <section style={{ flex: 1 }}>
        <AdminSideBarComponent />
      </section>
    </div>
  </>
  
  )
}

export default HomeAdmin
