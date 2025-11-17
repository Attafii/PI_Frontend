import { pageLinks } from '../../data';
import NavLinkComponent from './NavLinkComponent';
const NavLinksComponent=({parentClass,itemClass}) =>{
  return (
    <ul className={parentClass} id='nav-links'>
    {pageLinks.map((link)=>{
        return(
   <NavLinkComponent key={link.id} link={link} itemClass={itemClass}/>
        );
    })}
     
   </ul>
  )
}

export default NavLinksComponent
