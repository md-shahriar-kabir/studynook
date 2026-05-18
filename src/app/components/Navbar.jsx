import Link from "next/link";



const Navbar = () => {
    return (
        <nav className="flex justify-between p-5">
            <div>
                <Link href={'/'}><h2 className="text-2xl font-extrabold">Study <span className="text-2xl text-cyan-400 font-extrabold">Nook</span></h2></Link>
            </div>
            <ul className="flex gap-3">
                <li><Link href={'/'}>Home</Link></li>
                <li><Link href={'/rooms'}>Rooms</Link></li>
                <li><Link href={'/add-room'}>Add Room</Link></li>
                <li><Link href={'/my-listings'}>My Listings</Link></li>
                <li><Link href={'/my-bookings'}>My Bookings</Link></li>
            </ul>

            <ul className="flex gap-3">
                <li><Link href={'/login'}>Login</Link></li>
                <li><Link href={'/signup'}>Sign Up</Link></li>
                
            </ul>
        </nav>
    );
};

export default Navbar;