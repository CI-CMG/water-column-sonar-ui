import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ErrorView() {
  useEffect(() => { document.title = `Error`; }, []);

  return (
    <div id="error-page">
      <center>
        <h1 className="text-center">Sorry</h1>

        <p>This path does not exist!</p>

        <Link to="/"><p>Click here to return home.</p></Link>
      </center>
    </div>
  );
}
