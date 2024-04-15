import { Link, Outlet } from 'react-router-dom';

export function NavBar() {
  return (
    <>
      <header className="bg-purple-900 p-5 mb-8">
        <div className="container">
          <div className="row">
            <div className="col-span-1 flex items-center">
              <h1 className="text-white text-4xl">Code Journal</h1>
              <Link to="/" className="pl-3 inline bg-transparent text-white">
                <h3 className='text-base'>Entries</h3>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}
