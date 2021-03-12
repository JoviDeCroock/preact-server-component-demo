import { render, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

// TODO: this has to be transpiled out and replaced by:
/**
 * const ServerLoader = ({ hash = 'data.server.js#ServerComponent', ...props }) => {
 *    // Will parse when the loading completes
 *    const module = useModule(hash, props);
 *    return null;
 * }
 */
import { parse } from './stream';

const useModule = (hash: string, props: { [key: string]: any }) => {
  useEffect(() => {
    fetch(`/preact?module=${hash}&state=${props.state}`).then(d => {
      return d.text();
    }).then(r => {
      return parse(JSON.parse(r));
    });
  }, [props.state]);
}

const ServerLoader = ({ hash, ...props }: { [key: string]: any }) => {
  useModule(hash, props);
  return null;
}

const App = () => {
  const [state, setState] = useState(true);
  return (
    <main>
      <h1>
        <span class="atom">⚛</span>
        Preact Server Components
      </h1>
      <p>
        This demo demonstrates how components are rendered on the server and
        inserted on the client.
      </p>
      <button id="toggle" onClick={() => setState(!state)}>Fetch data</button>
      <br />
      <div class="area">
        <div class="server-component">
          <h2 class="area-title">Server Component A</h2>
          <div data-root="J0">
            <ServerLoader hash="data.server.mjs|ServerComponent" state={state} />
          </div>
        </div>
        <div class="server-component">
          <h2 class="area-title">Server Component B</h2>
          <div data-root="J1">
            <ServerLoader hash="data.server.mjs|ServerComponent2" state={state} />
          </div>
        </div>
      </div>
      <br />
    </main>
  )
}

render(<App />, document.body);
