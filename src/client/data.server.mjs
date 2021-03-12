export const ServerComponent = ({ state }) => {
  return { J0: state === 'true' ? ["$", "h3", null, { "class": "foo", "children": "hello"}] : ["$", "p", null, { "children": "This is text coming from the server"}] }
}

export const ServerComponent2  = ({ state }) => {
  return { J1: state === 'true' ? ["$", "h3", null, { "children": "world!"}] : ["$", "h3", null, { "class": "foo", "children": "Franzbrötchen"}] }
}
