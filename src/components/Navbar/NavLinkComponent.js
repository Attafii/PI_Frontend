import React from 'react'

function NavLinkComponent({link,itemClass}) {
    return (
      <li key={link.id}>
         <a href={link.href}
          className={itemClass}>
           {link.text}
         </a>
       </li>
       
    )
  
}

export default NavLinkComponent
